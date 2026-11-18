# Sidequest — cozy hybrid design

Four static desktop concepts for a family savings demo. This delivery contains design artifacts and a lightweight review board, with no SvelteKit application or money-handling implementation.

## Review the designs

Open `index.html` directly in a browser. It has no dependencies, external assets, scripts, analytics, or build step. Click an image to view the full-resolution frame. `contact-sheet-v1.jpg` archives the original contact sheet; use the review board for the current revision.

| Frame | File | State |
| --- | --- | --- |
| 01 · Teen dashboard | [01-teen-dashboard.png](frames/01-teen-dashboard.png) | Month 3, paused |
| 02 · Add to savings | [02-add-to-savings.png](frames/02-add-to-savings.png) | Preview a $50 transfer; not confirmed |
| 03 · Goal reached | [03-goal-reached.png](frames/03-goal-reached.png) | Month 6, purchase ready |
| 04 · Parent dashboard | [04-parent-dashboard.png](frames/04-parent-dashboard.png) | Same Month 3 balances as frame 01 |

Each frame is exported at **1440 × 1200 pixels**. These are flattened raster concepts; the controls pictured inside them are illustrative. The review board rearranges the images on narrow screens, but separate mobile app frames have not been designed.

## Visual system

Working brand: **Sidequest**. Tone: cozy, encouraging, and clear.

| Role | Design color |
| --- | --- |
| Main canvas | Warm ivory `#F5F2E9` |
| Navigation, primary actions | Forest `#233F35` |
| Progress and supporting accents | Sage `#A9BA96` |
| Interest and milestone accents | Muted gold `#D6AD58` |
| Body text | Charcoal `#24312B` |

- Forest navigation and ivory content remain consistent across roles. Use fine borders, softly rounded cards, and generous spacing.
- All H1, H2, and H3 headings use one coherent 8-bit display family, including parent-view and dialog headings. Size and spacing establish the hierarchy. Subtitles, financial values, body copy, navigation, inputs, and buttons use one readable sans-serif family. The raster concepts suggest Pixelify Sans paired with Inter; exact font implementation remains future work.
- Revision 2 uses a taller 1200px canvas with larger card insets, wider gutters, and more separation between headings, values, descriptions, and controls.
- The teen goal contains an original pixel forest scene. An open chest and restrained sparkles mark completion. There are no XP scores, levels, leaderboards, or additional game currencies.
- The parent view keeps the shared brand while using plain financial language, an initials avatar, conventional charts, and direct funding controls. It removes scenery and quest effects.
- Progress is reinforced with values, labels, and checkmarks. Statuses such as Covered and Paused appear in text.

The inspiration was the supplied clean dashboard and Cast n Chill references, plus [Orma](https://orma.games/). Their source artwork and site code are not bundled.

## Example state and accounting

The teen deposits $300 at the start. A separate $125 demo-income top-up remains in their wallet. The parent starts with $1,000 and reserves $300, leaving $700 in the parent wallet. The reserved pool is separate from the teen's savings.

| Month | Interest payment | Goal savings | Interest fund remaining |
| --- | ---: | ---: | ---: |
| Start | — | $300.00 | $300.00 |
| 1 | $30.00 | $330.00 | $270.00 |
| 2 | $33.00 | $363.00 | $237.00 |
| 3 | $36.30 | $399.30 | $200.70 |
| 4 | $39.93 | $439.23 | $160.77 |
| 5 | $43.92 | $483.15 | $116.85 |
| 6 | $48.32 | $531.47 | $68.53 |

Frame 02 is an alternative action preview at Month 3: transferring $50 would leave $75 in the wallet and $449.30 in savings, with a next monthly interest amount of $44.93. That transfer is not applied to the path used for frame 03.

Frame 03 shows the full final interest payment taking savings above the $500 target. Total interest is $231.47. A simulated purchase would deduct $500 and return $31.47 to the wallet, resulting in a $156.47 teen wallet balance. Interest stops at goal completion.

The next payment is only covered when the parent pool can pay the entire rounded amount. An underfunded month is skipped, with no partial payment or back payment. All balances and purchases are simulated.

## Generation and verification

Created with the **built-in image_gen tool**. Revision 2 refines spacing and applies 8-bit headings throughout. All four final frames used the spacious teen dashboard exploration as a shared edit reference. The exact final generation prompts, reference relationship, and tool choice are saved in [prompts.json](prompts.json). No API-key or CLI fallback was used.

The native generated outputs were uniformly exported to the planned 1440 × 1200 canvas. The archived version-1 contact sheet is a browser screenshot of the original review board. It is retained for comparison and does not represent the current revision. No further image generation or contact-sheet rendering was performed after the user asked to stop.

Revision 1 was verified in-browser for image loading and desktop overflow. Revision 2 exports are 1440 × 1200, its review board dimensions are updated, and the example accounting is unchanged. Revision 2 was visually reviewed from generated outputs; no new browser verification was performed after the stop request. Visually reviewed layout, text, role consistency, and the calm parent treatment. Exact font selection, responsive application behavior, keyboard interactions, contrast measurements, and motion remain implementation work.
