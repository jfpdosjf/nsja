#!/usr/bin/env bash
set -uo pipefail
DATA=/var/lib/pasarguard
mkdir -p "$DATA/node-certs" /var/lib/pg-node
export PORT=8080   # fixed: set the Railway domain target port to 8080

# owner admin/admin is written by bootstrap.py on FIRST boot only
unset SUDO_USERNAME SUDO_PASSWORD

# ---- node secrets: generated once, kept on the volume ----
[ -f "$DATA/node_api_key" ] || python -c "import uuid;print(uuid.uuid4())" > "$DATA/node_api_key"
if [ ! -f "$DATA/node-certs/cert.pem" ]; then
  openssl req -x509 -newkey ec -pkeyopt ec_paramgen_curve:prime256v1 -nodes -days 3650 -keyout "$DATA/node-certs/key.pem" -out "$DATA/node-certs/cert.pem" -subj "/CN=localhost" -addext "subjectAltName=IP:127.0.0.1,DNS:localhost" >/dev/null 2>&1
fi

# ---- unique config paths for this install (kept on the volume) ----
python /code/genpaths.py || exit 1

# ---- nginx ----
sed "s/__PORT__/${PORT}/g" /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf
nginx -t || exit 1

# ---- keep-alive: if a process ever stops, it is started again within 1 second ----
keep() {
  local name=$1; shift
  while true; do
    ( "$@" ); echo "[jinx] $name stopped (code $?), starting again in 1s"; sleep 1
  done
}

# ---- node (xray) ----
node_run() {
  cd /opt/pg-node || exit 1
  export SERVICE_PORT=62050 NODE_HOST=127.0.0.1 SERVICE_PROTOCOL=grpc
  export API_KEY="$(cat "$DATA/node_api_key")"
  export SSL_CERT_FILE="$DATA/node-certs/cert.pem" SSL_KEY_FILE="$DATA/node-certs/key.pem"
  exec ./main
}
keep node node_run &
NODE_PID=$!

# ---- panel ----
panel_run() { cd /code && python -m alembic upgrade head && exec python main.py; }
keep panel panel_run &
PANEL_PID=$!

# ---- auto setup + self-healing (restarts itself if it ever crashes) ----
( cd /code && while true; do python bootstrap.py; echo "[jinx] bootstrap exited, restarting in 10s"; sleep 10; done ) &

keep nginx nginx -g 'daemon off;' &
NGINX_PID=$!

# ---- watchdog: if the panel or nginx stops answering for ~3 minutes, restart the whole service ----
(
  sleep 120; fails=0
  while true; do
    if bash /usr/local/bin/jinx-healthcheck; then fails=0; else fails=$((fails+1)); fi
    if [ "$fails" -ge 6 ]; then echo "[jinx] watchdog: service not answering, restarting"; exit 1; fi
    sleep 30
  done
) &
WATCH_PID=$!

wait -n $NODE_PID $PANEL_PID $NGINX_PID $WATCH_PID
echo "[jinx] restarting container"; exit 1
