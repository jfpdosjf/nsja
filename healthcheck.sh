#!/usr/bin/env bash
# Super JinX health check: nginx edge + panel API must both answer.
curl -fsS -o /dev/null --max-time 4 http://127.0.0.1:8080/healthz || exit 1
code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 4 http://127.0.0.1:8000/api/system)
[ "$code" = "200" ] || [ "$code" = "401" ] || exit 1
exit 0
