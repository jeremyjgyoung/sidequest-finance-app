# Sidequest

A cozy, browser-only family savings demo built with SvelteKit, Svelte, and TypeScript. The teenager saves toward a goal; a separate parent-funded pool pays 10% compound interest each simulated month. All balances and purchases are simulated.

## Run locally

Use Node.js **24.x** and **pnpm 12.4.2** (pinned in `package.json`).

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open the URL printed by Vite. Complete the three-step setup or choose **Explore the example demo** to jump to Alex’s Month 3 PS5 goal.

```sh
pnpm check           # Svelte, TypeScript, and compiler accessibility checks
pnpm test            # Financial domain and clock tests
pnpm format:check    # Source formatting
pnpm build           # Static production build
pnpm preview         # Preview the production build
```

## Try the demo

- Switch between Teen and Parent views; both use the same local family state.
- Deposit, withdraw, add demo income, or fund the parent’s interest pool.
- Play at 5, 10, or 30 seconds per month, or use **Next month** while paused.
- Inspect **Activity** for the full transaction history and **How it works** for the rules.
- Complete a quest, make a simulated purchase, and start another goal.
- **Load example** and **Reset demo** require confirmation before replacing existing progress.

The populated example starts with $399.30 in savings, a $125 teen wallet, a $700 parent wallet, and $200.70 reserved for interest. Advancing three more months reaches $531.47. Buying the $500 item returns $31.47 to the teen wallet, leaving $156.47 available for another quest.

## Money and time rules

Money is stored as integer cents. A monthly payment is 10% of the current savings balance, rounded to the nearest cent. Previously paid interest compounds. A payment transfers money from the parent fund into savings; it does not create money.

If the fund cannot cover the entire payment, the month is skipped. There are no partial payments, debt, or back payments. Deposits and withdrawals affect the next month’s calculation. Only the explicit demo-income action creates simulated money.

A full final payment can exceed the target. Reaching a goal pauses playback and stops interest and savings transfers for that goal. A purchase deducts the target and returns excess savings to the teen wallet. New goals start at zero savings and retain both wallets, unused funding, and prior activity.

The clock pauses on reload, hidden tabs, financial dialogs, and goal completion. Pausing and speed changes preserve progress within the current month during the session. Reloading starts the current month’s countdown again, with no offline catch-up. Playback uses a single shared controller across pages and roles. Storage changes from another tab pause playback and refresh the displayed state; simultaneous editing across multiple tabs is outside the demo’s scope.

## Persistence

The versioned state is stored under `sidequest.demo.v1` in the current browser’s local storage. Each visitor and browser has independent data. No accounts, bank connections, server database, or cross-device synchronization are involved.

Invalid saved data offers a fresh setup or example replacement with confirmation. If storage is unavailable, a visible session-only notice explains that progress will not survive closing the tab. Clearing browser data or resetting the demo removes saved progress.

## Deploy on Vercel

Import **jeremyjgyoung/sidequest-finance-app** from GitHub:

- Root directory: repository root.
- Framework preset: **SvelteKit**.
- Node.js: **24.x**, also specified in `package.json`.
- Build command: **pnpm build**.
- Install command: the repository’s `vercel.json` pins pnpm and uses the frozen lockfile.
- Leave the output directory override **disabled**. The static adapter detects Vercel and writes the Build Output API format automatically.
- No environment variables, database, or API keys are required.

Locally, the static adapter writes `build/`. On Vercel it writes `.vercel/output/static/` plus its generated routing configuration. All three routes are prerendered with trailing slashes, so direct visits and reloads are supported.

The project owner creates the Vercel project and GitHub connection. After the initial deployment, pushes to the connected production branch trigger deployments. The public URL is not hardcoded in the app. Live-host verification requires that deployment URL.

## Implementation notes

- `src/lib/demo/domain.ts`: pure, immutable financial commands, example state, validation, and saved-state decoding.
- `src/lib/demo/controller.svelte.ts`: client-initialized reactive state, local persistence, notices, and the shared clock.
- `src/lib/demo/clock.ts`: playback progress and month-boundary control, independently tested.
- `src/lib/components/`: shared dashboard, dialogs, setup, chart, activity, and simulation controls.
- `src/lib/styles.css`: CSS tokens and responsive layouts; Pixelify Sans headings paired with Inter utility text and tabular amounts.
- `design/`: the original design exploration and exact image-generation prompts, retained as reference.
- `static/art/`: cropped decorative scenes from the existing design frames. No additional image generation was used to build the app.

The design is desktop focused, with basic small-screen stacking, collapsed navigation, viewport-safe native dialogs, keyboard focus management, and reduced-motion support. The role switcher is for demonstrating both perspectives and does not enforce authentication or authorization.
