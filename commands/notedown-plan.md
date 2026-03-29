Plan the organization of notes, get user approval, then save to Obsidian.

## Input
- `$ARGUMENTS` — what to note down and any details. If empty, note down the latest piece of information from the conversation.

## Steps

1. **Determine content**: If `$ARGUMENTS` is provided, use it as the topic/content to note down. If empty, identify the most recent meaningful piece of information from the conversation.

2. **Search existing notes**: Use subagents in parallel to:
   - List files in the Obsidian vault using `mcp__mcp-obsidian__obsidian_list_files_in_vault` and relevant subdirectories
   - Search for related content using `mcp__mcp-obsidian__obsidian_simple_search` with keywords from the topic

3. **Present a plan to the user** — STOP here and wait for approval before writing anything:
   - Propose which notes to create (one per core concept, not one giant dump)
   - For each note: the title, the directory it would go in, and a brief description of what theory it would cover
   - Mention how notes would link to each other where concepts connect
   - Wait for the user to approve, adjust, or reject the plan

4. **After user approval — decide placement**:
   - Look at the vault's directory structure and figure out which directory each note belongs in based on its topic
   - If an existing note closely matches a topic, **update** it by appending or patching
   - If no existing note matches, **create** a new note in the most appropriate directory

5. **Write the notes**:
   - Write **full theory explanations**, not summaries or condensed bullet points
   - Match the depth and style of the conversation — if a concept was explained with examples, analogies, diagrams, and tradeoffs, the note should contain all of that
   - Use the same conversational, explanatory tone: explain the "why" behind concepts, walk through how things work step by step, and include concrete examples
   - Include code blocks and ASCII diagrams where they help illustrate architecture or data flow
   - Include comparison tables where multiple options were discussed
   - The goal is that someone reading the note **learns the concept fully** from the note alone — it should teach, not just remind
   - For DSA-related topics: include mermaid diagrams with simple examples to illustrate how concepts work, unless the user specifies not to
   - Do NOT repeat the title as an H1 heading (the filename is already the title in Obsidian)
   - **Include reflective sections where relevant**:
     - **What I Learned** — key takeaways, "aha" moments, things that clicked during the process. Frame as personal insights, not textbook definitions.
     - **Misconceptions I Had** — wrong assumptions going in, things that seemed obvious but were wrong, mental models that needed correcting. Explain what the misconception was, why it seemed right, and what the reality turned out to be.
     - **Gotchas & Surprises** — unexpected behaviors, undocumented quirks, things that weren't in the docs or that contradicted expectations.
     - These sections are optional — only include them when the conversation involved debugging, troubleshooting, onboarding, or exploring something new where genuine learnings and misconceptions came up. Don't force them for straightforward theory notes.

6. **Link only when relevant**:
   - Only add `[[wiki links]]` if the linked note is directly related to the content
   - Do NOT link to notes just because they share a parent directory or broad topic
   - Only backlink from other notes if the connection is genuinely useful for navigation

7. **Confirm**: Tell the user what was created/updated and which notes were linked (if any).
