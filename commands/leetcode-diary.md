Update the Interview Diary in Obsidian with a reflection on today's session.

## Input
- `$ARGUMENTS` — optional specific things to include. If empty, infer from the conversation.

## Steps

1. **Gather context**: Look at the conversation to identify:
   - Which problems were worked on today
   - What went well (solved independently, good ideas, good questions)
   - What went poorly (needed hints, bugs, got stuck, edge cases missed)
   - Any patterns in mistakes (off-by-one, syntax issues, missing edge cases, etc.)

2. **Read the current diary**: Fetch `DSA/Interview Diary.md` using `mcp__mcp-obsidian__obsidian_get_file_contents`. Check the most recent entry to compare progress.

3. **Rate honestly**: Give a brutally honest rating out of 10 for interview readiness. Do NOT inflate — the purpose is growth, not comfort. Base it on:
   - Could they solve the problems independently under interview time pressure?
   - How many hints were needed?
   - How clean was the implementation? (bugs, edge cases, off-by-ones)
   - Did they improve from the last diary entry?

4. **Write the entry**: Append a new dated section using `mcp__mcp-obsidian__obsidian_append_content`. Format:

   ```
   ## YYYY-MM-DD

   **Rating: X/10**

   ### What I did well
   - specific observations from today's session

   ### What I struggled with
   - specific mistakes, bugs, concepts that were hard — be detailed and honest

   ### Patterns I'm noticing
   - recurring mistake types across sessions (compare with previous entries)

   ### Problems worked on today
   - NUMBER Problem Name — brief note on how it went (solved independently / needed hints / couldn't solve)
   ```

5. **Be honest, not mean**: The tone should be like a coach who respects you enough to tell the truth. Point out real weaknesses with specific examples, but also acknowledge genuine progress. Never sugarcoat, never be vague ("you did ok" is useless — say exactly what was good or bad and why).

6. **Confirm**: Tell the user the entry was added and highlight one key takeaway.
