#!/bin/sh
# (Re)start the production server on :3100 for QA scripts. Kills whatever holds the port first.
lsof -ti:3100 | xargs kill 2>/dev/null
sleep 1
npx next start -p 3100 > /dev/null 2>&1 &
for i in $(seq 1 40); do
  curl -s -o /dev/null -w "%{http_code}" localhost:3100 | grep -q 200 && exit 0
  sleep 0.5
done
echo "server did not start" >&2
exit 1
