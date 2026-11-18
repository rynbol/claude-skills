#!/usr/bin/env -S python3 -S
"""Prompt-cache timer for the main conversation of a Claude Code session.

The cache lifetime counts from the start of the last request that read or
wrote the cache, so the anchor is that request's api-request entry, not the
time the reply finished.

  cache-timer.py <transcript.jsonl>   prints {"anchor_ms", "ttl_s", "tokens"} or {}
  cache-timer.py --session <id>       the same, for the session log named <id>.jsonl
  cache-timer.py --session <id> --agent <agent-id>   the same, for one helper (subagent) of that session
  cache-timer.py --statusline         reads Claude Code's status JSON on stdin, prints one line
"""
import glob
import json
import os
import sys
import time
from datetime import datetime

TAIL_BYTES = (2 << 20, 16 << 20)
TTL_S = {"1h": 3600, "5m": 300}


def read_tail(path, size):
    with open(path, "rb") as f:
        f.seek(0, os.SEEK_END)
        end = f.tell()
        f.seek(max(0, end - size))
        data = f.read()
    lines = data.split(b"\n")
    return lines[1:] if end > size else lines


def iso_ms(ts):
    return int(datetime.fromisoformat(ts.replace("Z", "+00:00")).timestamp() * 1000)


def find(lines, is_helper):
    requests = {}
    last = None
    for raw in lines:
        if b'"api-request"' not in raw and b'"usage"' not in raw:
            continue
        try:
            o = json.loads(raw)
        except ValueError:
            continue
        if o.get("type") == "api-request":
            requests[o.get("id")] = o.get("timestamp")
            continue
        if o.get("type") != "assistant" or (o.get("isSidechain") and not is_helper):
            continue
        u = (o.get("message") or {}).get("usage") or {}
        if u.get("cache_read_input_tokens", 0) + u.get("cache_creation_input_tokens", 0) > 0:
            last = o
    if last is None:
        return None
    u = last["message"]["usage"]
    ttl = last.get("promptCacheRequested")
    if ttl not in TTL_S:
        ttl = "1h" if (u.get("cache_creation") or {}).get("ephemeral_1h_input_tokens") else "5m"
    started = requests.get(last.get("requestRef")) or last["timestamp"]
    tokens = sum(u.get(k, 0) for k in ("input_tokens", "cache_read_input_tokens", "cache_creation_input_tokens", "output_tokens"))
    return {"anchor_ms": iso_ms(started), "ttl_s": TTL_S[ttl], "tokens": tokens}


def timer(path, is_helper=False):
    for size in TAIL_BYTES:
        found = find(read_tail(path, size), is_helper)
        if found:
            return found
    return None


def statusline():
    try:
        path = json.load(sys.stdin).get("transcript_path") or ""
        t = timer(path) if os.path.isfile(path) else None
    except (OSError, ValueError):
        t = None
    if not t:
        return
    left_s = (t["anchor_ms"] + t["ttl_s"] * 1000 - time.time() * 1000) / 1000
    if left_s <= 0:
        sys.stdout.write("\033[31m○ cache expired\033[0m")
        return
    color = "32" if left_s >= 600 else "33"
    left = "<1m" if left_s < 60 else f"{int(left_s // 60)}m"
    sys.stdout.write(f"\033[{color}m● cache {left} left\033[0m")


if __name__ == "__main__":
    if sys.argv[1:] == ["--statusline"]:
        statusline()
    elif sys.argv[1:2] == ["--session"] and (len(sys.argv) == 3 or (len(sys.argv) == 5 and sys.argv[3] == "--agent")):
        session = glob.escape(sys.argv[2])
        is_helper = len(sys.argv) == 5
        name = f"{session}/subagents/agent-{glob.escape(sys.argv[4])}" if is_helper else session
        logs = glob.glob(os.path.expanduser(f"~/.claude/projects/*/{name}.jsonl"))
        print(json.dumps(timer(max(logs, key=os.path.getmtime), is_helper) if logs else {}))
    elif len(sys.argv) == 2:
        print(json.dumps(timer(sys.argv[1]) or {}))
    else:
        sys.exit(__doc__)
