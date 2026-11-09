#!/bin/sh
# Start the Oakstone server fully detached so it survives the shell that
# launched it. Earlier plain `nohup ... &` invocations died with their parent.
cd /var/minis/workspace/lawyer || exit 1

# Kill anything already on 3000 so we never end up with a stale process
# silently serving old code (that bit us twice).
for p in /proc/[0-9]*; do
  c=$(tr '\0' ' ' < "$p/cmdline" 2>/dev/null)
  case "$c" in
    *"lib/server.js"*) kill -9 "${p#/proc/}" 2>/dev/null ;;
  esac
done
sleep 1

setsid node lib/server.js > /tmp/srv.log 2>&1 < /dev/null &
sleep 3

code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 8 http://localhost:3000/home)
echo "server: $code"
tail -3 /tmp/srv.log
