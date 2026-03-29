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
