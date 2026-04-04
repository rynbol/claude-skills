Save information to Obsidian notes.

## Input
- `$ARGUMENTS` — what to note down and any details. If empty, note down the latest piece of information from the conversation.

## Steps

1. **Determine content**: If `$ARGUMENTS` is provided, use it as the topic/content to note down. If empty, identify the most recent meaningful piece of information from the conversation.

___

2. **Search existing notes**: Use subagents in parallel to:
   - List files in the Obsidian vault using `mcp__mcp-obsidian__obsidian_list_files_in_vault` and relevant subdirectories
   - Search for related content using `mcp__mcp-obsidian__obsidian_simple_search` with keywords from the topic

___

3. **Decide where to place the note**:
   - Look at the vault's directory structure and figure out which directory the note belongs in based on its topic (e.g. a distributed systems note goes in `4051/Notes/`, not the vault root)
   - If an existing note closely matches the topic, **update** it by appending or patching
   - If no existing note matches, **create** a new note in the most appropriate directory

___

4. **Write the note**:
   - Write **full theory explanations**, not summaries or condensed bullet points
   - Match the depth and style of the conversation — if a concept was explained with examples, analogies, diagrams, and tradeoffs, the note should contain all of that
   - Use the same conversational, explanatory tone: explain the "why" behind concepts, walk through how things work step by step, and include concrete examples (e.g. the profile pic replication lag example, the `NOW()` problem with statement-based replication)
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

___

5. **Link only when relevant**:
   - Only add `[[wiki links]]` if the linked note is directly related to the content
   - Do NOT link to notes just because they share a parent directory or broad topic
   - Only backlink from other notes if the connection is genuinely useful for navigation

___

6. **Confirm**: Tell the user what was created/updated and which notes were linked (if any).
