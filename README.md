# Referral Dashboard (rebuilt from live demo)

Rebuilt from `https://referral-slider-demo-y.ydang.chatgpt.site/` — a Codex-preview
build (Vite + React Server Components) whose source repo isn't accessible from here
and whose deployed JS has no sourcemaps. This is a **clean, equivalent rebuild**,
not a decompiled copy: exact HTML structure, exact CSS (`src/styles.css` is the
real stylesheet pulled from the live site, byte-for-byte), exact fonts (Be Vietnam
Pro, pulled from the live site into `public/fonts/`), and exact icon set (lucide,
matched one-for-one to the `lucide-*` classes in the reference markup).

## What's exact vs. approximated

**Exact** (pulled directly from the live deployment, in `_reference/`):
- `_reference/index.html` — full server-rendered markup of the Home screen
- `_reference/styles.css` → copied verbatim to `src/styles.css`
- `public/fonts/*.ttf` — the actual Be Vietnam Pro font files
- Every visible class name, color token (`--color-primary` etc.), and layout value

**Approximated** (the deployed JS is minified with no sourcemap, so exact internal
logic isn't recoverable — these are reasonable stand-ins, flagged so the next pass
can tighten them):
- The "Activities / day" counts scale proportionally with the goal slider from the
  reference baseline (30M / 12mo → 5/3/3/2). The original formula relating goal
  amount + timeline to the daily-action mix is unknown.
- "Check in" and "Recent Activities" open a placeholder detail panel on click —
  the reference only exposes `chevron-down` affordance + CSS for `.daily-task` /
  `.daily-progress` (a fuller check-in/streak screen exists in the CSS but its
  exact markup wasn't present in the captured HTML).
- The info-bubble copy (points / goal explanations) and the "guide" video-dialog
  content (mock tutorial steps) are original placeholder copy — the reference CSS
  defines the `.bubble` / `.video-dialog` / `.mock-stage` structure precisely, but
  the actual English/Vietnamese copy inside them wasn't in the captured HTML.
- Bottom-nav tabs other than **Home** (Network / Plan / Points) just switch the
  `selected` state — their screens exist as CSS rules (`.network-*`, `.explore-*`,
  `.reminder-*`, `.edit-goal-sheet` …) but not as captured markup, so they aren't
  built yet. Good next step: build these out one at a time, styled by the already-
  present CSS classes.

## Run it

```bash
npm install
npm run dev
```

## Structure

```
src/
  App.jsx        — the whole Home screen + interactions (state, slider math, dialogs)
  styles.css     — exact stylesheet from the live site
  main.jsx       — React entry point
public/fonts/    — Be Vietnam Pro (400/500/600/700), pulled from the live site
_reference/      — the raw HTML/CSS pulled from the live site, kept for comparison
```
