# Interop 2026 Pattern Lab

A **living design-system copilot** for shipping 2026 web UI with features that are safe under **[Interop 2026](https://wpt.fyi/interop-2026)**.

Paste a landing page, app screen, or component → see an Interop-safe rebuild side-by-side with the traditional approach → copy HTML, CSS, and React with browser-support rationale for every decision.

## Features

- **8 production patterns**: Button, Feature card, Navigation, Hero, Dialog, Accordion, Tooltip, Scroll gallery
- **Side-by-side diff**: Interop-safe vs traditional / pre-Interop
- **Code tabs**: HTML · CSS · React · Rationale & support tables
- **Paste copilot**: Heuristic analysis of pasted HTML/CSS/React with suggested rebuilds
- **Progressive enhancement**: Solid fallbacks for `contrast-color()`, anchor positioning, scroll-driven animation, `popover="hint"`, etc.
- **Zero-JS first**: `<dialog>`, Popover API, `<details>`, CSS-only snap carousels

## Interop 2026 focus areas used

| Area | Lab usage |
|------|-----------|
| `contrast-color()` | Buttons, CTAs, themed card actions |
| Container style queries | Card theming via `--card-theme` |
| CSS anchor positioning | Nav menu, tooltips |
| Dialogs & popovers | `closedby`, `:open`, `popover="hint"` |
| Scroll-driven animations | Gallery cards (progressive) |
| Scroll snap | Gallery track |
| Plus Baseline | Container size queries, OKLCH, `clamp()`, logical properties, `prefers-reduced-motion` |

Sources: [web.dev Interop 2026](https://web.dev/blog/interop-2026), [interop README](https://github.com/web-platform-tests/interop/blob/main/2026/README.md).

## Local development

```bash
npm run dev
# → http://localhost:3456
```

Or open `public/index.html` directly in a modern browser.

## Deploy (Vercel)

```bash
npx vercel --prod
```

Project is static: `public/` is the site root (`vercel.json` + zero build required if Output Directory is `public`).

## Project layout

```
public/
  index.html   # App shell
  styles.css   # Lab UI + pattern demos
  app.js       # Patterns, controls, paste analyzer
```

## Philosophy

1. **Ship fallbacks first** — every Interop 2026 feature has a Baseline path.
2. **Native before libraries** — dialog, popover, details, snap before portals and carousels.
3. **Component-aware layout** — `@container` over viewport-only media queries when the component is the context.
4. **Motion is optional** — always respect `prefers-reduced-motion`.

## License

MIT — use freely in product design systems.
