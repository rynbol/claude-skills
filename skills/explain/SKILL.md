---
name: explain
description: >
  Explain a technical concept, code flow, or system behavior using a detailed
  step-by-step walkthrough with concrete values traced through each stage.
  Use when the user asks "how does X work?", "what happens when Y?",
  "walk me through Z", "explain this flow", or needs to understand a
  process, vulnerability, protocol, or code path in detail.
  Also use when the user invokes /explain.
---

# Detailed Step-by-Step Explainer

Explain `$ARGUMENTS` by tracing concrete values through each step of the process.

## Method

1. **Set the scene** in one sentence: what's happening and who's involved.

2. **Trace each step** with this format:

   **Step N: [What happens]**
   ```
   Input:  <exact data at this point>
   ```
   Code/logic that processes it (include `file:line` references when applicable):
   ```go
   // show the relevant code
   ```
   ```
   Output: <exact result>
   ```

3. **Use concrete values** throughout. Never write "some value" or "the data." Use real examples like `"https://server1.com/mcp"`, `"authorization_code"`, `42`.

4. **Show transformations explicitly:**
   ```
   Input:  ["https://a.com", "https://b.com"]
   Output: "https://a.com https://b.com"
   ```

5. **Compare scenarios** when relevant (e.g., normal vs attack, success vs failure). Use clear headers:
   - "Legitimate flow:" then full trace
   - "Attack flow:" then full trace highlighting where it diverges

6. **End with a summary** — one short paragraph or a comparison table.

## Style

- Numbered steps, not prose paragraphs
- Every step shows concrete data in code blocks
- Include `file:line` references when explaining code
- One thing per step — don't combine multiple operations
- No hand-waving — if a value is unknown, say so explicitly
