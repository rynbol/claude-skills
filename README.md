# Claude Skills

Custom skills and slash commands for [Claude Code](https://claude.ai/code).

## Skills

| Skill | Description | Prerequisites |
|---|---|---|
| **ultrathink** | Multi-agent deep-thinking workflow for complex tasks. Coordinates Architect, Research, Coder, and Tester sub-agents. | None |
| **explain** | Step-by-step technical explainer that traces concrete values through each stage of a process, code flow, or system. | None |
| **design-flow** | Generates architecture and end-to-end design flow walkthroughs with diagrams and guided reading orders. | None |
| **worklog** | Logs work tickets to Obsidian with summaries, skills used, challenges, and impact framed for resume use. | Obsidian MCP, Atlassian MCP |

## Slash Commands

| Command | Description | Prerequisites |
|---|---|---|
| **/notedown** | Saves conversation content to Obsidian as full theory notes with examples, diagrams, and reflections. | Obsidian MCP |
| **/notedown-plan** | Like `/notedown` but presents a plan for note organization and waits for approval before writing. | Obsidian MCP |
| **/leetcode** | Updates a LeetCode checklist in Obsidian with problem status, approach, complexity, and attempt history. | Obsidian MCP |
| **/leetcode-diary** | Appends an honest interview readiness reflection to an Interview Diary note in Obsidian. | Obsidian MCP |
| **/search-sessions** | Searches past Claude Code session history by metadata or full message content. | search-sessions CLI |
| **/handover** | Generates a structured Markdown snapshot of the current task state — modified files, unresolved bugs, environment dependencies, and exact next steps. | None |

## Mods and Status Line

| Mod | Description | Prerequisites |
|---|---|---|
| **cache-timer** | Shows how long the prompt cache stays warm, in a row above the prompt. A small face is awake while the cache is warm, sleepy in the last 10 minutes, and asleep when the cache has expired. When you view a subagent, the row shows that subagent's cache. | python3 |

The mod reads only the local session log under `~/.claude/projects/`. It makes no model calls. It redraws when the shown minute changes and runs its script once per turn.

### Install cache-timer

At the prompt of a Claude Code terminal session:

```
/plugin install cache-timer --marketplace rynbol/claude-skills
```

Answer `y` to add the marketplace, then pick a scope. From a shell:

```bash
claude plugin install cache-timer --marketplace rynbol/claude-skills
```

In the desktop app, `/plugin` does not run. Click **+** next to the prompt box, then **Plugins**, **Add marketplace** with `rynbol/claude-skills`, then **Add plugin**.

### ccstatusline layout

[`statusline/ccstatusline/settings.json`](./statusline/ccstatusline/settings.json) is a three-line [ccstatusline](https://github.com/sirmalloc/ccstatusline) layout:

1. Model, context bar, directory, git status, thinking effort
2. Session usage, reset time, weekly usage, weekly reset time
3. Cache timer (`● cache 41m left`)

The cache timer entry runs `~/.claude/mods/cache-timer/scripts/cache-timer.py --statusline`. `/plugin install` does not put the script at that path, so link it from your clone (Setup, step 1):

```bash
npm install -g ccstatusline
mkdir -p ~/.claude/mods ~/.config/ccstatusline
ln -s ~/claude-skills/mods/cache-timer ~/.claude/mods/cache-timer

# This replaces your ccstatusline layout. Back up your own settings.json first.
cp ~/claude-skills/statusline/ccstatusline/settings.json ~/.config/ccstatusline/settings.json
```

Then add this to `~/.claude/settings.json`:

```json
"statusLine": {
  "type": "command",
  "command": "ccstatusline",
  "refreshInterval": 60
}
```

Use the global `ccstatusline` command, not `npx ccstatusline@latest`. Claude Code runs the command on every refresh.

Tested on macOS with Claude Code 2.1.323 and ccstatusline 2.2.30.

## MCP Servers

Setup instructions for all MCP servers used by these skills (Obsidian, Atlassian, GitHub, Playwright, Canva, NotebookLM, etc.) live in [`mcp/README.md`](./mcp/README.md).

## Setup

### 1. Install skills

```bash
git clone https://github.com/rynbol/claude-skills.git ~/claude-skills

# Symlink into Claude config
mkdir -p ~/.claude/commands ~/.claude/skills
ln -sf ~/claude-skills/commands/* ~/.claude/commands/
for dir in ~/claude-skills/skills/*/; do
  ln -sf "$dir" ~/.claude/skills/
done
```

### 2. Install prerequisites

Only install what you need based on the skills you plan to use.

#### Obsidian MCP

Required by: notedown, notedown-plan, leetcode, leetcode-diary, worklog

1. Install the [Obsidian Local REST API](https://github.com/coddingtonbear/obsidian-local-rest-api) community plugin in Obsidian and enable it
2. Copy the API key from the plugin settings
3. Install and register the MCP server:

```bash
# Requires uv (https://docs.astral.sh/uv/getting-started/installation/)
claude mcp add mcp-obsidian -s user -- uvx mcp-obsidian \
  -e OBSIDIAN_API_KEY=<your-api-key> \
  -e OBSIDIAN_HOST=127.0.0.1 \
  -e OBSIDIAN_PORT=27124
```

#### Atlassian MCP

Required by: worklog

```bash
# Requires uv (https://docs.astral.sh/uv/getting-started/installation/)
claude mcp add mcp-atlassian -s user -- uvx --python=3.12 mcp-atlassian \
  -e JIRA_URL=<your-jira-url> \
  -e JIRA_PERSONAL_TOKEN=<your-jira-pat>
```

See [mcp-atlassian](https://github.com/sooperset/mcp-atlassian) for auth options (PAT, OAuth, Confluence, etc.).

#### search-sessions CLI

Required by: /search-sessions

```bash
brew tap sinzin91/tap
brew install search-sessions
```

See [search-sessions](https://github.com/sinzin91/search-sessions) for non-Homebrew install options.
