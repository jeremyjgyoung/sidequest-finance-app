# Student Prompt Guide: Building a Web App

A prompt is an instruction you give an AI assistant. Use prompts to explain the goal, define requirements, request changes, and check results. Review the app yourself as you work.

The examples below are adapted from the Sidequest finance demo project.

## 1. Start with the problem

Describe the users, their goal, the technology, and the limits of the first version.

```text
Help me plan a finance demo using SvelteKit.

The users are a teenager and a parent. The teenager saves toward a purchase.
The parent sets aside money to pay compound interest on the savings.

Use simulated money and save progress in the browser. Each user needs a
different dashboard. Ask questions until the scope is clear. Do not build yet.
```

Relevant context, specific requirements, and examples help the assistant understand the task. See [GitHub’s prompt engineering guidance](https://docs.github.com/en/copilot/concepts/prompting-and-context/prompt-engineering).

## 2. Define the rules before implementation

Clarify decisions that change how the app behaves. For Sidequest, these included who chooses the goal, when interest is paid, and what happens when the parent fund is insufficient.

Give a numerical example when a requirement involves calculations.

```text
Interest is 10% per simulated month, rounded to the nearest cent.

With $100 in savings and enough parent funding, the balance should become
$110 after one month and $121 after two months, with no additional deposits.

If the parent fund cannot cover a full payment, skip that payment.
Do not create debt or make back payments.
```

Ask the assistant to summarize the agreed rules before it starts coding.

## 3. Review the design before building

Attach screenshots or links and explain what each reference contributes. Identify the screens you want to review and set a limit on image generation.

```text
Design the teen dashboard, parent dashboard, and goal-completion screen.
Do not implement the app yet. Generate at most three design images.

Use the dashboard reference for layout and the game reference for the art style.
Use an 8-bit font for all H1, H2, and H3 headings. Use a readable sans-serif
font for descriptions, controls, and financial values.

Treat the images as guidelines. During implementation, use CSS to improve
spacing, hierarchy, and consistency.
```

## 4. Make revision requests precise

Name the component, the new behavior, and any default values.

| Area | Example instruction |
| --- | --- |
| Playback | Offer 0.5s, 1s, 2s, and 10s per simulated period. Default to 2s. |
| Contributions | Show teen deposits and parent-paid interest separately near the goal balance. |
| Parent controls | Allow a whole-number rate from 1% to 30%. Default to 10%. Offer daily, weekly, and monthly payments. Default to monthly. |
| Setup | Skip wallet entry. Start with a $500 teen wallet and a $10,000 parent budget. Reserve $300 from that budget. |
| Celebration | Show falling pixel coins when the teen reaches the goal. Respect reduced-motion settings. |

State how new defaults affect saved data. For example: “Apply these balances to new demos. Preserve existing saved progress.”

## 5. Build in focused increments

Group related changes into one request. Review the result before adding unrelated features.

```text
Implement the parent interest controls using the agreed design.

Changing the rate or frequency should affect future payments. Preserve the
amounts and settings recorded for earlier payments.

Run the checks relevant to this change. Add focused tests for the new
calculation rules. Summarize the changes and report any incomplete work.
```

Match verification to the change. A spacing adjustment needs a visual check. A financial calculation needs tests with known expected values.

## 6. Report problems with evidence

Include the page, the steps, the expected result, and the actual result. Attach a screenshot or the exact error message when useful.

```text
On the parent dashboard, I set interest to 20% weekly and saved the settings.
The teen dashboard still displays 10% monthly.

Update the display and payment preview to use the saved parent settings.
Keep earlier transaction records unchanged.
```

Ask for an explanation when a label or rule is unclear:

```text
Explain what “reserve for interest” means using the balances on this screen.
Do not change the app yet.
```

## 7. Specify delivery and completion

Define success with observable results. This supports meaningful evaluation, as described in [Anthropic’s prompting overview](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/overview).

```text
The change is complete when the controls work, the relevant checks pass,
and existing saved progress still loads.

Commit the change with a clear message and push to [branch name].
Use main only if this is the branch approved for this project.

Check the deployed site once it is available. Confirm the changed behavior
and a direct page reload. Report anything you could not verify.
```

A Git push and a successful deployment are separate results. Check the deployment status before sharing the app.

## Reusable prompt template

```text
Goal: [What should the user be able to do?]
Context: [Current app, relevant files, screenshots, or error messages.]
Task: [The specific change to make.]
Requirements: [Rules, limits, ranges, and defaults.]
Preserve: [Existing behavior or data that must remain intact.]
Done when: [Observable results that define success.]
Checks: [Verification appropriate to this change.]
Delivery: [File, commit, branch, or deployment required.]

Inspect the existing project first. Ask about important missing requirements.
When finished, summarize what changed and what you verified.
```

Before submitting your work, use the app yourself, inspect the changes, and explain the main behavior in your own words.
