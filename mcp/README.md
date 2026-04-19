# MCP Servers

Setup instructions for the [Model Context Protocol](https://modelcontextprotocol.io) servers used alongside these skills.

Replace every `<PLACEHOLDER>` with your own value. Never commit real tokens.

## Scope

Each `claude mcp add` command below uses `-s user` (available in all projects) or `-s local` (private to the current project). Pick whichever matches how broadly you want the server available.

## Servers

| Server | Type | Auth | Used by |
|---|---|---|---|
| [pdf-navigator](#pdf-navigator) | stdio | none | ad-hoc PDF tasks |
| [playwright](#playwright) | stdio | none | browser automation |
| [notebooklm](#notebooklm) | stdio | browser login | NotebookLM notebooks |
| [atlassian](#atlassian-official-remote) | http | OAuth | Jira/Confluence (cloud) |
| [canva](#canva) | http | OAuth | Canva designs |
| [mcp-atlassian](#mcp-atlassian-self-hosted) | stdio | PAT | Jira/Confluence (self-hosted), `worklog` skill |
| [github](#github) | stdio | PAT | GitHub / GitHub Enterprise |
| [mcp-obsidian](#mcp-obsidian) | stdio | API key | `notedown`, `leetcode`, `worklog`, etc. |
| [shortlist](#shortlist) | http | OAuth | Shortlist.jobs |

## No-auth servers

### pdf-navigator

PDF reading and form-filling.

```bash
# Install binary first — see https://github.com/joonamo/pdf-navigator-mcp
claude mcp add pdf-navigator -s user -- /path/to/pdf-navigator-mcp
```

### playwright

Headless/headed browser automation.

```bash
npm install -g @playwright/mcp
claude mcp add playwright -s user -- playwright-mcp
```

See [microsoft/playwright-mcp](https://github.com/microsoft/playwright-mcp).

### notebooklm

Google NotebookLM integration. Auth is handled inside the server via a browser flow on first use.

```bash
claude mcp add notebooklm -s local -- npx notebooklm-mcp@latest
```

## OAuth (browser) servers

These register as HTTP servers. Claude Code opens a browser window to complete the OAuth handshake the first time a tool is invoked.

### atlassian (official remote)

Official Atlassian Cloud MCP. Works for Jira Cloud and Confluence Cloud.

```bash
claude mcp add atlassian -s user --transport http https://mcp.atlassian.com/v1/mcp
```

### canva

```bash
claude mcp add canva -s local --transport http https://mcp.canva.com/mcp
```

### shortlist

```bash
claude mcp add shortlist -s local --transport http https://shortlist.jobs/mcp
```

After adding, run `claude mcp list` — the server will show `Needs authentication` until you trigger a tool call and complete the browser flow.

## Token-auth servers

### mcp-atlassian (self-hosted)

For Atlassian **Server/Data Center** (self-hosted Jira/Confluence). For Cloud, prefer the [official `atlassian` server](#atlassian-official-remote).

1. Create a Jira Personal Access Token: **Profile → Personal Access Tokens → Create token**.
2. Register the server:

```bash
# Requires uv — https://docs.astral.sh/uv/getting-started/installation/
claude mcp add mcp-atlassian -s user \
  -e JIRA_URL=<YOUR_JIRA_URL> \
  -e JIRA_PERSONAL_TOKEN=<YOUR_JIRA_PAT> \
  -- uvx --python=3.12 mcp-atlassian
```

See [sooperset/mcp-atlassian](https://github.com/sooperset/mcp-atlassian) for Confluence, OAuth, and other auth variants.

### github

Works against github.com or GitHub Enterprise. Omit `GITHUB_HOST` for github.com.

1. Create a PAT at <https://github.com/settings/tokens> (or `https://<your-ghe-host>/settings/tokens`). Scopes: at minimum `repo`, `read:org`, `workflow`.
2. Install the server binary from [github/github-mcp-server](https://github.com/github/github-mcp-server).
3. Register:

```bash
# github.com
claude mcp add github -s user \
  -e GITHUB_PERSONAL_ACCESS_TOKEN=<YOUR_GITHUB_PAT> \
  -- /path/to/github-mcp-server stdio

# GitHub Enterprise
claude mcp add github -s user \
  -e GITHUB_PERSONAL_ACCESS_TOKEN=<YOUR_GHE_PAT> \
  -e GITHUB_HOST=https://<your-ghe-host> \
  -- /path/to/github-mcp-server stdio
```

### mcp-obsidian

Required by `notedown`, `notedown-plan`, `leetcode`, `leetcode-diary`, `worklog`.

1. Install the [Obsidian Local REST API](https://github.com/coddingtonbear/obsidian-local-rest-api) plugin and enable it.
2. Copy the API key from plugin settings. Note the host/port (defaults: `127.0.0.1:27124`).
3. Register:

```bash
# Requires uv
claude mcp add mcp-obsidian -s user \
  -e OBSIDIAN_API_KEY=<YOUR_OBSIDIAN_API_KEY> \
  -e OBSIDIAN_HOST=127.0.0.1 \
  -e OBSIDIAN_PORT=27124 \
  -- uvx mcp-obsidian
```

## Verifying

```bash
claude mcp list        # shows all registered servers and connection status
claude mcp get <name>  # shows config for one server
```

## Removing

```bash
claude mcp remove <name> -s user    # or -s local, matching the scope used at add time
```
