#!/bin/sh
FAILED=0

check() {
  name="$1"
  shift
  if "$@" >/dev/null 2>&1; then
    echo "$name PASSED"
  else
    echo "$name FAILED"
    FAILED=1
  fi
}

backend() {
  docker compose exec -T backend wget -q -T 15 -O - http://127.0.0.1:5000/api/health
}

frontend() {
  docker compose exec -T frontend wget -q -T 15 -O - http://127.0.0.1/login
}

mysql_healthy() {
  status=$(docker inspect -f '{{.State.Health.Status}}' "$(docker compose ps -q db)")
  [ "$status" = "healthy" ]
}

database() {
  docker compose exec -T frontend wget -q -T 15 -O - http://127.0.0.1/api/health | grep -q '"database":"up"'
}

check BACKEND backend
check FRONTEND frontend
check MYSQL mysql_healthy
check DATABASE database

if [ "$FAILED" -eq 0 ]; then
  echo "RESULT: SUCCESS"
else
  echo "RESULT: FAILURE"
fi
exit $FAILED
