---
name: worklog
description: >
  Log work tickets to the Autodesk work log in Obsidian. Use when the user wants to
  record a completed or in-progress ticket, update an existing entry, or review their
  work log. Also use when the user invokes /worklog.
---

Log work to `autodesk-work-log.md` in the user's Obsidian vault.

## Input
- `$ARGUMENTS` — ticket ID and/or description of the work. If empty, ask the user what to log.

## Steps

1. **Get ticket info**: If a ticket ID is provided (e.g. `ID-63464`), use `mcp__mcp-atlassian__jira_get_issue` to fetch ticket details (summary, status, type, created date). If no ticket ID, ask the user.

2. **Read the existing work log**: Use `mcp__mcp-obsidian__obsidian_get_file_contents` to read `autodesk-work-log.md` and check if the ticket already exists.

3. **Gather details from the user or context**: For each entry, include:
   - **Status** and **Dates** (created, when work was done)
   - **Type** (User Story, Task, Bug, etc.)
   - **Summary** — what was done, written in past tense, action-oriented
   - **Skills & Technologies** — languages, frameworks, tools, platforms used
   - **Challenges & Solutions** — problems encountered and how they were solved
   - **Impact** — positive outcomes, metrics where possible. Frame for resume/presentation use:
     - Quantify where you can (e.g. "reduced X by Y%", "processed N requests")
     - Highlight automation, efficiency gains, reliability improvements
     - Note if you were first to do something or if it's a team-wide improvement
     - Include business context (why this matters)
   - **PRs** — list of PRs with repo and number
   - **Notes** — links to related Obsidian notes if relevant

4. **If ticket already exists**: Ask the user if they want to update the existing entry or leave it. If updating, preserve existing content and add/modify the changed sections.

5. **If new ticket**: Append a new entry under the appropriate team heading using this format:

```markdown
### TICKET-ID: Short title
**Status:** Status | **Dates:** Date range | **Type:** Type

**Summary:** What was done.

**Skills & Technologies:** Tech1, Tech2, Tech3

**Challenges & Solutions:**
- Challenge — how it was solved

**Impact:**
- Quantified outcome or improvement

**PRs:**
- `repo#number` - description (status)

**Notes:** Links to related notes if any.
```

6. **Write the update**: Use `mcp__mcp-obsidian__obsidian_append_content` for new entries or read the full file, edit, and rewrite for updates.

7. **Confirm**: Tell the user what was logged/updated.

## Style
- Write summaries in professional past tense ("Implemented...", "Designed...", "Built...")
- Frame impact for resume/presentation use — quantify, highlight scope, note firsts
- Keep challenges actionable — what went wrong and how it was solved
- Don't over-embellish but do present work in the best light
- Use consistent formatting matching existing entries
