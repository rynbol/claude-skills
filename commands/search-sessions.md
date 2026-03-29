---
description: "Search across all past Claude Code sessions by metadata or full message content"
usage: '/search-sessions "query" [--deep] [--limit N] [--project FILTER] [--since DATE] [--date DATE]'
---

# Search Sessions

Search across all past Claude Code session history.

**Modes:**
- **Index search (default)**: Searches session metadata (summary, firstPrompt, projectPath, gitBranch). Near-instant.
- **Deep search (`--deep`)**: Searches actual message text via ripgrep. Sub-second.

**Options:**
- `--deep` — Search full message content
- `--limit N` — Maximum results (default: 20)
- `--project FILTER` — Filter to projects matching substring
- `--since DATE` — Filter from date (e.g. "today", "yesterday", "3 days ago", "last week", "2026-02-20")
- `--until DATE` — Filter until date
- `--date DATE` — Shorthand for a single day

**Examples:**
```
/search-sessions "kubernetes RBAC"
/search-sessions "auth flow" --deep
/search-sessions "billing" --project myapp
/search-sessions "fix" --since "last week"
```

!/opt/homebrew/bin/search-sessions $ARGUMENTS

Present the results to the user. If index search returned no results, automatically retry with `--deep` before responding — do not ask the user first.
