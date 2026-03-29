Update the Leetcode checklist in Obsidian.

## Input
- `$ARGUMENTS` — what to update (e.g. "787 solved", "add 121 Best Time to Buy and Sell Stock", "973 in progress", "add 200 to todo"). If empty, infer from the conversation what changed.

## Steps

1. **Determine what changed**: If `$ARGUMENTS` is provided, use it. If empty, look at the conversation context to figure out which LeetCode problem was being discussed and what progress was made (e.g. solved, stuck, learned a new approach).

2. **Decide which section**:
   - If the user says "to do", "retry", "in progress", or "not started" → add/update under `## To Do`
   - If the user says "done", "solved", or "completed" → add/move to `## Done`
   - If nothing is specified or context is unclear → default to `## Done`

3. **Read the current note**: Fetch the contents of `DSA/Leetcode.md` using `mcp__mcp-obsidian__obsidian_get_file_contents`.

4. **Apply the update**:

   **For the `## To Do` section:**
   - Entry format:
     ```
     - [ ] [NUMBER. Problem Name](https://leetcode.com/problems/problem-slug/)

     > [!CALLOUT_TYPE]- Status Label
     > **Approach:** ...
     >
     > **Time:** O(...) — detailed explanation of why (e.g. "O(V + E) — we visit every node once and iterate all edges via adjacency list")
     >
     > **Space:** O(...) — detailed explanation of why (e.g. "O(V + E) — adjacency list stores all edges, visited set/queue hold up to V nodes")
     >
     > **Attempts:**
     > - <mark style="background: #228be6; color: white; padding: 2px 6px; border-radius: 3px;">YYYY-MM-DD</mark> Short note about attempt
     ```
   - Callout types by status:
     - Retry: `[!danger]- Retry`
     - In progress: `[!warning]- In progress`
     - Not started: `[!abstract]- Not started`
   - Checkbox: `- [ ]` (unchecked)
   - Time/Space/Attempts are optional — only include if known from context

   **For the `## Done` section:**
   - Entry format:
     ```
     - [x] [NUMBER. Problem Name](https://leetcode.com/problems/problem-slug/)

     > [!success]- More
     > **Approach:** ...
     >
     > **Time:** O(...) — detailed explanation of why
     >
     > **Space:** O(...) — detailed explanation of why
     >
     > **Attempts:**
     > - <mark style="background: #228be6; color: white; padding: 2px 6px; border-radius: 3px;">YYYY-MM-DD</mark> Short note about attempt
     ```
   - Always uses `[!success]- More` (NO status label inside, just the approach/complexities/attempts)
   - Checkbox: `- [x]` (checked)

   **Common operations:**
   - **Add new problem**: Append entry to the appropriate section. Link to leetcode URL. Leave a blank line between the checkbox line and the callout.
   - **Update approach**: Modify the Approach line inside the callout.
   - **Add attempt**: Add a new line under Attempts with today's date as a blue badge and a short note. Date badge: `<mark style="background: #228be6; color: white; padding: 2px 6px; border-radius: 3px;">YYYY-MM-DD</mark>`. Most recent attempt on top.
   - **Move to Done**: Remove the entry from `## To Do` and add it to `## Done` (change callout to `[!success]- More`, change `- [ ]` to `- [x]`).
   - **Move to To Do**: Remove from `## Done` and add to `## To Do` with appropriate status callout.

5. **Write the update**: Use `mcp__mcp-obsidian__obsidian_patch_content` to replace the relevant heading's content. Preserve the Progress Tracker link at the top of To Do and all other entries unchanged.

6. **Confirm**: Tell the user what was updated in one line.
