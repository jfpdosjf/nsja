# Super JinX Panel: PasarGuard + Xray core + nginx in one Railway service (port 8080)
FROM pasarguard/node:latest AS node

FROM pasarguard/panel:latest

RUN apt-get update && apt-get install -y --no-install-recommends nginx openssl ca-certificates curl \
 && rm -rf /var/lib/apt/lists/* /etc/nginx/sites-enabled/default

# node binary + xray core + geo files (static Go binaries, run fine on debian)
COPY --from=node /app/main /opt/pg-node/main
COPY --from=node /usr/local/bin/xray /usr/local/bin/xray
COPY --from=node /usr/local/share/xray /usr/local/share/xray

COPY nginx.conf.template /etc/nginx/nginx.conf.template
COPY ws.inc /etc/nginx/ws.inc
COPY sep-ui.js /etc/nginx/sep-ui.js
COPY entrypoint.sh /entrypoint.sh
COPY bootstrap.py /code/bootstrap.py
COPY genpaths.py /code/genpaths.py
COPY sub.html /code/custom_templates/subscription/index.html
COPY sub.html /etc/jinx/sub.html
COPY healthcheck.sh /usr/local/bin/jinx-healthcheck
# strip Windows line endings (safe if files were edited on a phone/PC), then make executable
RUN sed -i "s/\r$//" /entrypoint.sh /usr/local/bin/jinx-healthcheck /code/bootstrap.py /code/genpaths.py /etc/nginx/nginx.conf.template /etc/nginx/ws.inc /etc/nginx/sep-ui.js \
 && chmod +x /entrypoint.sh /opt/pg-node/main /usr/local/bin/xray /usr/local/bin/jinx-healthcheck

ENV PORT=8080 \
    UVICORN_HOST=127.0.0.1 \
    UVICORN_PORT=8000 \
    UVICORN_PROXY_HEADERS=True \
    UVICORN_FORWARDED_ALLOW_IPS=127.0.0.1 \
    SQLALCHEMY_DATABASE_URL=sqlite+aiosqlite:////var/lib/pasarguard/db.sqlite3 \
    CUSTOM_TEMPLATES_DIRECTORY=/code/custom_templates/ \
    SUBSCRIPTION_PAGE_TEMPLATE=subscription/index.html \
    SUBSCRIPTION_PATH=sub \
    XRAY_EXECUTABLE_PATH=/usr/local/bin/xray \
    XRAY_ASSETS_PATH=/usr/local/share/xray

EXPOSE 8080
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s CMD jinx-healthcheck || exit 1
ENTRYPOINT ["/entrypoint.sh"]
