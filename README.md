# Claude Skills

Custom skills and slash commands for [Claude Code](https://claude.ai/code).

## Skills

| Skill | Description |
|---|---|
| **ultrathink** | Multi-agent deep-thinking workflow for complex tasks. Coordinates Architect, Research, Coder, and Tester sub-agents. |
| **explain** | Step-by-step technical explainer that traces concrete values through each stage of a process, code flow, or system. |
| **design-flow** | Generates architecture and end-to-end design flow walkthroughs with diagrams and guided reading orders. |
| **worklog** | Logs work tickets to Obsidian with summaries, skills used, challenges, and impact framed for resume use. Requires: Obsidian MCP, Atlassian MCP. |

## Slash Commands

| Command | Description |
|---|---|
| **/notedown** | Saves conversation content to Obsidian as full theory notes with examples, diagrams, and reflections. Requires: Obsidian MCP. |
| **/notedown-plan** | Like `/notedown` but presents a plan for note organization and waits for approval before writing. Requires: Obsidian MCP. |
| **/leetcode** | Updates a LeetCode checklist in Obsidian with problem status, approach, complexity, and attempt history. Requires: Obsidian MCP. |
| **/leetcode-diary** | Appends an honest interview readiness reflection to an Interview Diary note in Obsidian. Requires: Obsidian MCP. |
| **/search-sessions** | Searches past Claude Code session history by metadata or full message content. Requires: [`search-sessions`](/commands/search-sessions.md) CLI tool on PATH. |

## Prerequisites

- **Obsidian MCP** ([mcp-obsidian](https://github.com/MarkusvonStaden/obsidian-mcp)) — required by notedown, notedown-plan, leetcode, leetcode-diary, and worklog
- **Atlassian MCP** ([mcp-atlassian](https://github.com/sooperset/mcp-atlassian)) — required by worklog (Jira ticket fetching)

## Installation

```bash
git clone https://github.com/rynbol/claude-skills.git ~/claude-skills

# Symlink into your Claude config
ln -sf ~/claude-skills/commands/* ~/.claude/commands/
for dir in ~/claude-skills/skills/*/; do
  ln -sf "$dir" ~/.claude/skills/
done
```
