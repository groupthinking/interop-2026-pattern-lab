/**
 * Interop 2026 Pattern Lab
 * Living design-system copilot — browser-safe patterns only.
 * Focus areas: contrast-color(), container style queries, anchor positioning,
 * dialogs/popovers (closedby, :open, popover=hint), scroll-driven animations,
 * scroll snap, view transitions (optional), plus Baseline container queries,
 * OKLCH, logical properties, clamp(), prefers-reduced-motion.
 */

const PATTERNS = {
  button: {
    id: 'button',
    name: 'Button',
    meta: 'contrast-color() · OKLCH · reduced motion',
    icon: '◎',
    controls: [
      { id: 'hue', label: 'Hue', type: 'range', min: 0, max: 360, value: 230 },
      { id: 'size', label: 'Size', type: 'range', min: 80, max: 140, value: 100 },
      { id: 'label', label: 'Label', type: 'text', value: 'Get started' },
    ],
    safeHTML(state) {
      const hue = state.hue ?? 230;
      const size = (state.size ?? 100) / 100;
      const label = escapeHtml(state.label || 'Get started');
      return `<button class="demo-btn" style="--hue:${hue};--size:${size}">${label}</button>`;
    },
    legacyHTML() {
      return `<button class="demo-btn--legacy" type="button">Get started</button>`;
    },
    htmlCode(state) {
      const label = state.label || 'Get started';
      return `<!-- Interop-safe button: OKLCH + contrast-color() -->
<button class="btn-safe" type="button">
  ${escapeHtml(label)}
</button>`;
    },
    cssCode() {
      return `.btn-safe {
  --btn-bg: oklch(0.62 0.18 230);

  appearance: none;
  border: 0;
  cursor: pointer;
  font: inherit;
  font-weight: 600;
  font-size: 0.95rem;
  padding: 0.75rem 1.35rem;
  border-radius: 0.9rem;
  background: var(--btn-bg);

  /* Fallback first, then Interop 2026 contrast-color() */
  color: #fff;
  color: contrast-color(var(--btn-bg));

  box-shadow: 0 10px 24px color-mix(in oklch, var(--btn-bg) 35%, transparent);
  transition: transform 180ms cubic-bezier(0.4, 0, 0.2, 1),
              filter 180ms cubic-bezier(0.4, 0, 0.2, 1);
}

.btn-safe:hover { filter: brightness(1.06); transform: translateY(-1px); }
.btn-safe:active { transform: scale(0.98); }
.btn-safe:focus-visible {
  outline: 2px solid color-mix(in oklch, var(--btn-bg) 70%, white);
  outline-offset: 3px;
}

@media (prefers-reduced-motion: reduce) {
  .btn-safe { transition: none; }
}`;
    },
    reactCode(state) {
      const label = state.label || 'Get started';
      return `export function SafeButton({
  children = "${escapeHtml(label)}",
  hue = 230,
  ...props
}) {
  return (
    <button
      type="button"
      className="btn-safe"
      style={{ ["--btn-bg"]: \`oklch(0.62 0.18 \${hue})\` }}
      {...props}
    >
      {children}
    </button>
  );
}

/* Pair with the CSS above. No JS for contrast or theming. */`;
    },
    rationale: `
      <h4>Why this is Interop-safe</h4>
      <ul>
        <li><code>contrast-color()</code> is an <strong>Interop 2026</strong> focus area — the browser picks guaranteed-contrast text against the background.</li>
        <li><code>oklch()</code> is Baseline — perceptually uniform hue control without manual contrast pairs.</li>
        <li>Solid <code>color: #fff</code> fallback ships safely where <code>contrast-color()</code> is still catching up.</li>
        <li><code>prefers-reduced-motion</code> removes hover lift for users who need less motion.</li>
      </ul>
      <h4>Traditional approach replaced</h4>
      <ul>
        <li>Hard-coded white text on a fixed blue hex (breaks on light variants).</li>
        <li>JS theme tokens or dual class names for light/dark button text.</li>
      </ul>
      ${supportTable([
        ['contrast-color()', 'Interop 2026', 'Yes (with #fff fallback)'],
        ['oklch()', 'Baseline', 'Yes'],
        ['color-mix()', 'Baseline', 'Yes'],
        ['prefers-reduced-motion', 'Baseline', 'Yes'],
      ])}
    `,
  },

  card: {
    id: 'card',
    name: 'Feature card',
    meta: 'Container queries · style queries',
    icon: '▦',
    controls: [
      {
        id: 'theme',
        label: 'Theme',
        type: 'select',
        value: 'accent',
        options: [
          { value: 'accent', label: 'Sky' },
          { value: 'success', label: 'Success' },
          { value: 'violet', label: 'Violet' },
          { value: 'warm', label: 'Warm' },
        ],
      },
      { id: 'price', label: 'Price', type: 'text', value: '29' },
      { id: 'title', label: 'Plan', type: 'text', value: 'Pro Plan' },
    ],
    safeHTML(state) {
      const theme = state.theme || 'accent';
      const price = escapeHtml(state.price || '29');
      const title = escapeHtml(state.title || 'Pro Plan');
      return `
        <div class="demo-card-host" style="--card-theme: ${theme}">
          <article class="demo-card">
            <div class="demo-card__eyebrow">Most popular</div>
            <div>
              <div style="font-weight:600">${title}</div>
              <div class="demo-card__price">$${price}<small>/mo</small></div>
            </div>
            <p class="demo-card__body">Container-aware layout. Theme via style query — no extra class bloat.</p>
            <button class="demo-card__cta" type="button">Choose plan</button>
          </article>
        </div>`;
    },
    legacyHTML() {
      return `
        <div class="demo-card--legacy">
          <div style="font-size:12px;color:#38bdf8;font-weight:600">MOST POPULAR</div>
          <div class="price">$29</div>
          <div style="font-size:13px;color:#94a3b8">Fixed media-query card. Manual theme classes.</div>
          <button type="button">Choose plan</button>
        </div>`;
    },
    htmlCode(state) {
      return `<!-- Container size + style queries (Interop 2026) -->
<div class="card-host" style="--card-theme: ${escapeHtml(state.theme || 'accent')}">
  <article class="card">
    <div class="card__eyebrow">Most popular</div>
    <h3>${escapeHtml(state.title || 'Pro Plan')}</h3>
    <p class="card__price">$${escapeHtml(state.price || '29')}<span>/mo</span></p>
    <p class="card__body">Responsive to its own width, not the viewport.</p>
    <button type="button">Choose plan</button>
  </article>
</div>`;
    },
    cssCode() {
      return `.card-host {
  container-type: inline-size;
  container-name: card;
  --card-theme: accent;
  --card-accent: oklch(0.72 0.14 230);
}

.card {
  background: oklch(0.22 0.02 260);
  border: 1px solid color-mix(in oklch, var(--card-accent) 25%, transparent);
  border-radius: 1.15rem;
  padding: 1.15rem;
  display: grid;
  gap: 0.75rem;
}

/* Size container query (Baseline) */
@container card (min-width: 18rem) {
  .card {
    grid-template-columns: 1fr auto;
    align-items: end;
  }
  .card button { grid-column: 2; grid-row: 1 / span 3; }
}

/* Style container queries (Interop 2026) */
@container card style(--card-theme: success) {
  .card { --card-accent: oklch(0.75 0.16 155); }
}
@container card style(--card-theme: violet) {
  .card { --card-accent: oklch(0.72 0.16 300); }
}

.card button {
  background: var(--card-accent);
  color: #041018;
  color: contrast-color(var(--card-accent));
  border: 0;
  border-radius: 0.75rem;
  padding: 0.55rem 0.95rem;
  font-weight: 600;
  cursor: pointer;
}`;
    },
    reactCode(state) {
      return `export function PricingCard({
  theme = "${escapeHtml(state.theme || 'accent')}",
  title = "${escapeHtml(state.title || 'Pro Plan')}",
  price = "${escapeHtml(state.price || '29')}",
}) {
  return (
    <div className="card-host" style={{ ["--card-theme"]: theme }}>
      <article className="card">
        <div className="card__eyebrow">Most popular</div>
        <h3>{title}</h3>
        <p className="card__price">\${price}<span>/mo</span></p>
        <p className="card__body">
          Theme swaps via CSS style queries — no theme provider.
        </p>
        <button type="button">Choose plan</button>
      </article>
    </div>
  );
}`;
    },
    rationale: `
      <h4>Why this is Interop-safe</h4>
      <ul>
        <li><strong>Container size queries</strong> (Baseline) layout by the card’s width — safe in sidebars, grids, and modals.</li>
        <li><strong>Container style queries</strong> are Interop 2026 — theme from a custom property with <code>@container … style()</code>.</li>
        <li>No JS theme context; change <code>--card-theme</code> and styles recompute.</li>
      </ul>
      <h4>Traditional approach replaced</h4>
      <ul>
        <li><code>@media (min-width: …)</code> that break when the card is narrow inside a wide viewport.</li>
        <li>Multiple BEM modifiers (<code>.card--success</code>) or CSS-in-JS theme objects.</li>
      </ul>
      ${supportTable([
        ['@container size', 'Baseline', 'Yes'],
        ['@container style()', 'Interop 2026', 'Yes (progressive)'],
        ['color-mix() + oklch()', 'Baseline', 'Yes'],
      ])}
    `,
  },

  nav: {
    id: 'nav',
    name: 'Navigation',
    meta: 'Popover · anchor positioning',
    icon: '☰',
    controls: [
      { id: 'brand', label: 'Brand', type: 'text', value: 'Acme' },
    ],
    safeHTML(state) {
      const brand = escapeHtml(state.brand || 'Acme');
      return `
        <nav class="demo-nav" aria-label="Primary">
          <div class="demo-nav__brand">${brand}</div>
          <div class="demo-nav__links" aria-hidden="false">
            <span>Product</span><span>Docs</span><span>Pricing</span>
          </div>
          <button
            class="demo-nav__menu-btn"
            type="button"
            popovertarget="nav-menu-popover"
            style="anchor-name: --nav-menu-btn"
          >Menu</button>
          <div id="nav-menu-popover" class="demo-nav__popover" popover>
            <a href="#patterns-grid">Product</a>
            <a href="#patterns-grid">Docs</a>
            <a href="#patterns-grid">Pricing</a>
            <a href="#paste-section">Contact</a>
          </div>
        </nav>`;
    },
    legacyHTML() {
      return `
        <div class="demo-nav--legacy">
          <strong>Acme</strong>
          <div class="note">Mobile menu usually needs JS state, focus traps, and absolute offsets.</div>
        </div>`;
    },
    htmlCode(state) {
      return `<!-- Zero-JS menu: Popover API + CSS anchor positioning -->
<nav class="nav" aria-label="Primary">
  <a class="nav__brand" href="/">${escapeHtml(state.brand || 'Acme')}</a>

  <button
    type="button"
    class="nav__toggle"
    popovertarget="main-menu"
    style="anchor-name: --nav-toggle"
  >
    Menu
  </button>

  <div id="main-menu" popover class="nav__menu">
    <a href="/product">Product</a>
    <a href="/docs">Docs</a>
    <a href="/pricing">Pricing</a>
  </div>
</nav>`;
    },
    cssCode() {
      return `.nav__toggle {
  anchor-name: --nav-toggle;
}

.nav__menu {
  margin: 0;
  border: 1px solid oklch(0.3 0.015 260);
  border-radius: 0.85rem;
  background: oklch(0.18 0.012 260);
  padding: 0.5rem;
  min-width: 11rem;

  /* Interop: CSS anchor positioning */
  position-anchor: --nav-toggle;
  position: absolute;
  top: anchor(bottom);
  right: anchor(right);
  margin-top: 0.4rem;
}

/* Fallback when anchor is unsupported */
@supports not (anchor-name: --x) {
  .nav__menu {
    position: fixed;
    inset: auto 1rem auto auto;
    top: 4rem;
  }
}

/* Wide layouts: show inline links, hide menu button via container query */
.nav {
  container-type: inline-size;
}
@container (min-width: 40rem) {
  .nav__toggle { display: none; }
}`;
    },
    reactCode(state) {
      return `export function SafeNav({ brand = "${escapeHtml(state.brand || 'Acme')}" }) {
  // No open state. No useEffect. Popover is declarative.
  return (
    <nav className="nav" aria-label="Primary">
      <a className="nav__brand" href="/">{brand}</a>
      <button
        type="button"
        className="nav__toggle"
        popoverTarget="main-menu"
        style={{ anchorName: "--nav-toggle" }}
      >
        Menu
      </button>
      <div id="main-menu" popover="" className="nav__menu">
        <a href="/product">Product</a>
        <a href="/docs">Docs</a>
        <a href="/pricing">Pricing</a>
      </div>
    </nav>
  );
}`;
    },
    rationale: `
      <h4>Why this is Interop-safe</h4>
      <ul>
        <li><strong>Popover API</strong> (Baseline + Interop polish) — light-dismiss, top-layer, no modal JS.</li>
        <li><strong>CSS anchor positioning</strong> (Interop 2025→2026) pins the menu to the button without measuring DOM.</li>
        <li>Container query hides the toggle on wide navs without viewport media queries.</li>
      </ul>
      <h4>Traditional approach replaced</h4>
      <ul>
        <li><code>useState(open)</code> + click-outside listeners + <code>getBoundingClientRect()</code>.</li>
        <li>Focus trap libraries for a simple overflow menu.</li>
      </ul>
      ${supportTable([
        ['Popover API', 'Baseline', 'Yes'],
        ['CSS anchor positioning', 'Interop 2025/2026', 'Yes (+ @supports fallback)'],
        ['Container queries', 'Baseline', 'Yes'],
      ])}
    `,
  },

  hero: {
    id: 'hero',
    name: 'Hero / Landing',
    meta: 'clamp() · cqi · logical props',
    icon: '✦',
    controls: [
      { id: 'title', label: 'Headline', type: 'text', value: 'Build for everyone' },
      { id: 'subtitle', label: 'Subcopy', type: 'text', value: 'Ship responsive UI with patterns browsers already agree on.' },
    ],
    safeHTML(state) {
      return `
        <div class="demo-hero">
          <div class="demo-hero__kicker">Interop 2026</div>
          <h3 class="demo-hero__title">${escapeHtml(state.title || 'Build for everyone')}</h3>
          <p class="demo-hero__text">${escapeHtml(state.subtitle || '')}</p>
          <div class="demo-hero__cta">
            <button class="primary" type="button">Start free</button>
          </div>
        </div>`;
    },
    legacyHTML() {
      return `
        <div class="demo-hero--legacy">
          <h3>Build for everyone</h3>
          <p>Fixed breakpoints and pixel type sizes.</p>
          <button type="button">Start free</button>
        </div>`;
    },
    htmlCode(state) {
      return `<section class="hero-safe">
  <p class="hero-safe__kicker">Interop 2026</p>
  <h1>${escapeHtml(state.title || 'Build for everyone')}</h1>
  <p>${escapeHtml(state.subtitle || 'Ship responsive UI with patterns browsers already agree on.')}</p>
  <button type="button">Start free</button>
</section>`;
    },
    cssCode() {
      return `.hero-safe {
  padding-block: clamp(2rem, 6vw, 5rem);
  padding-inline: clamp(1rem, 4vw, 2rem);
  /* Logical properties: direction-safe */
  border-inline-start: 3px solid oklch(0.72 0.14 230);
}

.hero-safe h1 {
  font-size: clamp(1.75rem, 5vw + 1rem, 3.5rem);
  line-height: 1.05;
  letter-spacing: -0.03em;
  max-inline-size: 16ch;
}

/* Optional: container query units inside a container */
.hero-safe {
  container-type: inline-size;
}
.hero-safe h1 {
  font-size: clamp(1.5rem, 8cqi, 3.5rem);
}

@media (prefers-reduced-motion: reduce) {
  .hero-safe * { transition: none; animation: none; }
}`;
    },
    reactCode(state) {
      return `export function SafeHero({
  title = "${escapeHtml(state.title || 'Build for everyone')}",
  subtitle = "${escapeHtml(state.subtitle || 'Ship responsive UI with patterns browsers already agree on.')}",
}) {
  return (
    <section className="hero-safe">
      <p className="hero-safe__kicker">Interop 2026</p>
      <h1>{title}</h1>
      <p>{subtitle}</p>
      <button type="button">Start free</button>
    </section>
  );
}`;
    },
    rationale: `
      <h4>Why this is Interop-safe</h4>
      <ul>
        <li><code>clamp()</code> + fluid type is Baseline — fewer breakpoints.</li>
        <li><code>cqi</code> units scale type to the component, not only the viewport.</li>
        <li>Logical properties (<code>padding-inline</code>, <code>max-inline-size</code>) work in LTR and RTL.</li>
      </ul>
      <h4>Traditional approach replaced</h4>
      <ul>
        <li>Three media-query font-size steps (mobile/tablet/desktop).</li>
        <li>Physical <code>margin-left</code> / <code>padding-right</code> that break in RTL locales.</li>
      </ul>
      ${supportTable([
        ['clamp()', 'Baseline', 'Yes'],
        ['Container query units (cqi)', 'Baseline', 'Yes'],
        ['Logical properties', 'Baseline', 'Yes'],
      ])}
    `,
  },

  dialog: {
    id: 'dialog',
    name: 'Dialog / Modal',
    meta: '<dialog closedby> · :open',
    icon: '▢',
    controls: [
      { id: 'title', label: 'Title', type: 'text', value: 'Confirm changes' },
    ],
    safeHTML(state) {
      const title = escapeHtml(state.title || 'Confirm changes');
      return `
        <div class="demo-dialog-wrap">
          <button class="demo-dialog-trigger" type="button" data-open-dialog="safe-dialog">
            Open settings
          </button>
          <dialog id="safe-dialog" class="demo-dialog" closedby="any">
            <div class="demo-dialog__body">
              <h3>${title}</h3>
              <p>Native dialog with light-dismiss via <code>closedby="any"</code>. No focus-trap library.</p>
              <div class="demo-dialog__actions">
                <button type="button" data-close-dialog>Cancel</button>
                <button type="button" class="confirm" data-close-dialog>Save</button>
              </div>
            </div>
          </dialog>
        </div>`;
    },
    legacyHTML() {
      return `
        <div class="demo-dialog--legacy-note">
          <strong style="color:var(--text)">Pre-Interop modal stack</strong><br>
          Portal + absolute overlay + body scroll lock + focus trap + Escape key handler + click-outside — often 50–100 lines of JS.
        </div>`;
    },
    htmlCode(state) {
      return `<!-- Interop 2026: closedby + native dialog -->
<button type="button" command="show-modal" commandfor="confirm">
  Open settings
</button>

<!-- Or classic imperative: dialog.showModal() -->
<dialog id="confirm" closedby="any">
  <form method="dialog">
    <h2>${escapeHtml(state.title || 'Confirm changes')}</h2>
    <p>Light-dismiss and Escape are built in when closedby="any".</p>
    <menu>
      <button value="cancel">Cancel</button>
      <button value="confirm">Save</button>
    </menu>
  </form>
</dialog>

<style>
  dialog:open {
    /* :open is Interop 2026 focus area */
    border-radius: 1rem;
    border: 1px solid oklch(0.3 0.015 260);
  }
  dialog::backdrop {
    background: oklch(0.1 0.02 260 / 0.55);
  }
</style>`;
    },
    cssCode() {
      return `dialog {
  border: 1px solid oklch(0.3 0.015 260);
  border-radius: 1.15rem;
  background: oklch(0.18 0.012 260);
  color: oklch(0.92 0.01 260);
  padding: 0;
  max-width: min(22rem, calc(100vw - 2rem));
}

dialog::backdrop {
  background: oklch(0.1 0.02 260 / 0.55);
  backdrop-filter: blur(4px);
}

/* Interop 2026: :open pseudo-class */
dialog:open {
  display: block;
}

@media (prefers-reduced-motion: no-preference) {
  dialog:open {
    animation: dialog-in 180ms ease-out;
  }
}

@keyframes dialog-in {
  from { opacity: 0; transform: translateY(6px) scale(0.98); }
  to   { opacity: 1; transform: none; }
}`;
    },
    reactCode(state) {
      return `import { useRef } from "react";

export function SafeDialog({
  title = "${escapeHtml(state.title || 'Confirm changes')}",
  children,
}) {
  const ref = useRef(null);

  return (
    <>
      <button type="button" onClick={() => ref.current?.showModal()}>
        Open settings
      </button>
      <dialog ref={ref} closedBy="any">
        <form method="dialog">
          <h2>{title}</h2>
          {children}
          <button value="cancel">Cancel</button>
          <button value="ok">Save</button>
        </form>
      </dialog>
    </>
  );
}

/* Prefer closedby / form method="dialog" over custom overlays. */`;
    },
    rationale: `
      <h4>Why this is Interop-safe</h4>
      <ul>
        <li><code>&lt;dialog&gt;</code> is Baseline for modal/non-modal dialogs with top-layer and focus management.</li>
        <li><code>closedby="any"</code> is an <strong>Interop 2026</strong> focus — light-dismiss without custom listeners.</li>
        <li><code>:open</code> styles open dialogs/popovers consistently across engines (Interop 2026).</li>
        <li><code>form method="dialog"</code> closes without JS return handling.</li>
      </ul>
      <h4>Traditional approach replaced</h4>
      <ul>
        <li>Custom modal components with portals, scroll locks, and incomplete a11y.</li>
      </ul>
      ${supportTable([
        ['<dialog> + showModal()', 'Baseline', 'Yes'],
        ['closedby attribute', 'Interop 2026', 'Yes (fallback: Esc still works via UA)'],
        [':open pseudo-class', 'Interop 2026', 'Yes (+ [open] attribute selector)'],
      ])}
    `,
    afterRender(root) {
      const dialog = root.querySelector('dialog');
      const openBtn = root.querySelector('[data-open-dialog]');
      if (!dialog || !openBtn) return;
      openBtn.addEventListener('click', () => {
        if (typeof dialog.showModal === 'function') dialog.showModal();
        else dialog.setAttribute('open', '');
      });
      root.querySelectorAll('[data-close-dialog]').forEach((btn) => {
        btn.addEventListener('click', () => {
          if (typeof dialog.close === 'function') dialog.close();
          else dialog.removeAttribute('open');
        });
      });
    },
  },

  accordion: {
    id: 'accordion',
    name: 'Accordion',
    meta: '<details> · zero JS',
    icon: '≡',
    controls: [],
    safeHTML() {
      return `
        <div class="demo-accordion">
          <details name="faq" open>
            <summary>What is Interop 2026?</summary>
            <p>A cross-vendor effort to make high-priority web features work the same in every major browser engine.</p>
          </details>
          <details name="faq">
            <summary>Do I need JavaScript?</summary>
            <p>Not for expand/collapse. Exclusive accordions use the <code>name</code> attribute on details.</p>
          </details>
          <details name="faq">
            <summary>Is this accessible?</summary>
            <p>Native disclosure widgets expose the right roles and keyboard behavior by default.</p>
          </details>
        </div>`;
    },
    legacyHTML() {
      return `
        <div class="demo-accordion--legacy">
          Classic pattern: map of open IDs in React state, click handlers on each header, aria-expanded wiring by hand, and optional height animation libraries.
        </div>`;
    },
    htmlCode() {
      return `<!-- Exclusive accordion: shared name (Baseline) -->
<div class="accordion">
  <details name="faq" open>
    <summary>What is Interop 2026?</summary>
    <p>…</p>
  </details>
  <details name="faq">
    <summary>Do I need JavaScript?</summary>
    <p>…</p>
  </details>
</div>`;
    },
    cssCode() {
      return `.accordion details {
  border: 1px solid oklch(0.3 0.015 260);
  border-radius: 0.85rem;
  padding-inline: 0.85rem;
  background: oklch(0.18 0.012 260);
}

.accordion summary {
  cursor: pointer;
  font-weight: 600;
  padding-block: 0.7rem;
  list-style: none;
}

.accordion summary::-webkit-details-marker { display: none; }

/* Style open state with :open (Interop 2026) or [open] */
.accordion details:open,
.accordion details[open] {
  border-color: color-mix(in oklch, oklch(0.72 0.14 230) 40%, oklch(0.3 0.015 260));
}`;
    },
    reactCode() {
      return `export function SafeAccordion({ items }) {
  // No open state required for exclusive behavior — use name="…".
  return (
    <div className="accordion">
      {items.map((item, i) => (
        <details key={item.id} name="faq" open={i === 0 || undefined}>
          <summary>{item.title}</summary>
          <p>{item.body}</p>
        </details>
      ))}
    </div>
  );
}`;
    },
    rationale: `
      <h4>Why this is Interop-safe</h4>
      <ul>
        <li><code>&lt;details&gt;</code>/<code>&lt;summary&gt;</code> are Baseline zero-JS disclosures.</li>
        <li>Shared <code>name</code> creates exclusive accordion behavior without scripts.</li>
        <li><code>:open</code> (Interop 2026) styles open state alongside <code>[open]</code>.</li>
      </ul>
      ${supportTable([
        ['details/summary', 'Baseline', 'Yes'],
        ['details name= (exclusive)', 'Baseline', 'Yes'],
        [':open', 'Interop 2026', 'Yes (+ [open] fallback)'],
      ])}
    `,
  },

  tooltip: {
    id: 'tooltip',
    name: 'Tooltip',
    meta: 'popover=hint · anchor',
    icon: '💬',
    controls: [
      { id: 'text', label: 'Tooltip text', type: 'text', value: 'Ships without a tooltip library' },
    ],
    safeHTML(state) {
      const text = escapeHtml(state.text || 'Ships without a tooltip library');
      return `
        <div class="demo-tooltip-wrap">
          <button
            class="demo-tooltip-btn"
            type="button"
            popovertarget="hint-tip"
            popovertargetaction="toggle"
            style="anchor-name: --tip-btn"
          >Hover / focus me</button>
          <div id="hint-tip" class="demo-tooltip" popover="hint">${text}</div>
          <p class="demo-tooltip-hint">
            <code>popover="hint"</code> is Interop 2026 — subordinate tooltips that don’t dismiss auto popovers.
          </p>
        </div>`;
    },
    legacyHTML() {
      return `
        <div class="demo-dialog--legacy-note">
          Typical stack: title attributes (inaccessible timing), or floating-ui + portal + mouseenter delays + collision detection.
        </div>`;
    },
    htmlCode(state) {
      return `<button
  type="button"
  popovertarget="save-tip"
  style="anchor-name: --save-btn"
>
  Save
</button>

<div
  id="save-tip"
  popover="hint"
  class="tooltip"
>
  ${escapeHtml(state.text || 'Ships without a tooltip library')}
</div>`;
    },
    cssCode() {
      return `.tooltip {
  margin: 0;
  padding: 0.45rem 0.7rem;
  border-radius: 0.65rem;
  border: 1px solid oklch(0.35 0.02 260);
  background: oklch(0.28 0.02 260);
  color: oklch(0.95 0.01 260);
  font-size: 0.78rem;
  max-width: 14rem;

  position-anchor: --save-btn;
  position: absolute;
  bottom: anchor(top);
  left: anchor(center);
  translate: -50% -0.4rem;
}

/* Fallback without anchor positioning */
@supports not (anchor-name: --x) {
  .tooltip {
    position: fixed;
    /* place near control with JS only if needed */
  }
}`;
    },
    reactCode(state) {
      return `export function SafeTooltip({
  label = "Save",
  tip = "${escapeHtml(state.text || 'Ships without a tooltip library')}",
}) {
  return (
    <>
      <button
        type="button"
        popoverTarget="save-tip"
        style={{ anchorName: "--save-btn" }}
      >
        {label}
      </button>
      <div id="save-tip" popover="hint" className="tooltip">
        {tip}
      </div>
    </>
  );
}`;
    },
    rationale: `
      <h4>Why this is Interop-safe</h4>
      <ul>
        <li><code>popover="hint"</code> is an <strong>Interop 2026</strong> focus for tooltip-like, non-modal UI.</li>
        <li>Anchor positioning places the tip relative to the control without measuring.</li>
        <li>Top-layer rendering avoids z-index wars.</li>
      </ul>
      ${supportTable([
        ['popover attribute', 'Baseline', 'Yes'],
        ['popover="hint"', 'Interop 2026', 'Falls back to auto/manual popover behavior'],
        ['CSS anchor positioning', 'Interop 2025/2026', 'Yes (+ @supports)'],
      ])}
    `,
  },

  scroll: {
    id: 'scroll',
    name: 'Scroll gallery',
    meta: 'scroll-snap · scroll-driven',
    icon: '↔',
    controls: [],
    safeHTML() {
      const items = ['Launch', 'Iterate', 'Measure', 'Ship'];
      return `
        <div class="demo-scroll">
          <div class="demo-scroll__track" tabindex="0" aria-label="Feature carousel">
            ${items
              .map(
                (label, i) => `
              <div class="demo-scroll__item">
                <strong>${label}</strong>
                <span>Card ${i + 1} · snap + progressive motion</span>
              </div>`
              )
              .join('')}
          </div>
        </div>`;
    },
    legacyHTML() {
      return `
        <div class="demo-scroll--legacy">
          Pre-Interop carousels: Swiper/Slick dependency, transform hacks, IntersectionObserver for “active” slides, and no reduced-motion story.
        </div>`;
    },
    htmlCode() {
      return `<div class="gallery" tabindex="0" aria-label="Feature carousel">
  <article class="gallery__item">Launch</article>
  <article class="gallery__item">Iterate</article>
  <article class="gallery__item">Measure</article>
  <article class="gallery__item">Ship</article>
</div>`;
    },
    cssCode() {
      return `.gallery {
  display: flex;
  gap: 0.65rem;
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scrollbar-width: thin;
}

.gallery__item {
  flex: 0 0 70%;
  scroll-snap-align: center;
  border-radius: 1rem;
  min-height: 8rem;
  padding: 1rem;

  /* Interop 2026: scroll-driven animations (progressive) */
  animation: gallery-in linear both;
  animation-timeline: view(inline);
  animation-range: entry 0% cover 40%;
}

@keyframes gallery-in {
  from { opacity: 0.45; scale: 0.96; }
  to   { opacity: 1; scale: 1; }
}

@media (prefers-reduced-motion: reduce) {
  .gallery__item {
    animation: none;
  }
}`;
    },
    reactCode() {
      return `export function SafeGallery({ items = ["Launch", "Iterate", "Measure", "Ship"] }) {
  return (
    <div className="gallery" tabIndex={0} aria-label="Feature carousel">
      {items.map((label) => (
        <article key={label} className="gallery__item">
          {label}
        </article>
      ))}
    </div>
  );
}

/* Snap works with zero JS. Scroll-driven motion degrades to static cards. */`;
    },
    rationale: `
      <h4>Why this is Interop-safe</h4>
      <ul>
        <li><strong>Scroll snap</strong> is an Interop 2026 reliability focus — consistent snap across engines.</li>
        <li><strong>Scroll-driven animations</strong> are Interop 2026 — timeline tied to scroll/view without rAF loops.</li>
        <li>With reduced motion, animations are disabled; snap still works.</li>
      </ul>
      ${supportTable([
        ['scroll-snap-*', 'Baseline + Interop 2026 polish', 'Yes'],
        ['animation-timeline: view()', 'Interop 2026', 'Progressive enhancement'],
        ['prefers-reduced-motion', 'Baseline', 'Yes'],
      ])}
    `,
  },
};

const PATTERN_ORDER = [
  'button',
  'card',
  'nav',
  'hero',
  'dialog',
  'accordion',
  'tooltip',
  'scroll',
];

/** @type {string | null} */
let currentPatternId = null;
/** @type {Record<string, string | number>} */
let controlState = {};

function escapeHtml(str) {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');
}

function supportTable(rows) {
  return `
    <table class="support-table">
      <thead>
        <tr><th>Feature</th><th>Status</th><th>Ship?</th></tr>
      </thead>
      <tbody>
        ${rows
          .map(
            ([f, s, ship]) =>
              `<tr><td><code>${escapeHtml(f)}</code></td><td>${escapeHtml(s)}</td><td>${escapeHtml(ship)}</td></tr>`
          )
          .join('')}
      </tbody>
    </table>`;
}

function $(sel, root = document) {
  return root.querySelector(sel);
}

function $all(sel, root = document) {
  return [...root.querySelectorAll(sel)];
}

function toast(message) {
  const el = $('#toast');
  if (!el) return;
  el.textContent = message;
  el.classList.add('is-visible');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.remove('is-visible'), 2200);
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    toast('Copied to clipboard');
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    ta.remove();
    toast('Copied to clipboard');
  }
}

function renderPatternCards() {
  const grid = $('#patterns-grid-cards');
  if (!grid) return;
  grid.innerHTML = PATTERN_ORDER.map((id) => {
    const p = PATTERNS[id];
    return `
      <button type="button" class="pattern-card" data-pattern="${id}" aria-pressed="false">
        <div class="pattern-card__preview" aria-hidden="true">${p.safeHTML({
          hue: 230,
          size: 90,
          label: 'Action',
          theme: 'accent',
          price: '29',
          title: 'Pro',
          brand: 'Acme',
          text: 'Tip',
        })}</div>
        <div class="pattern-card__title">${p.icon} ${p.name}</div>
        <div class="pattern-card__meta">${p.meta}</div>
      </button>`;
  }).join('');

  grid.addEventListener('click', (e) => {
    const card = e.target.closest('[data-pattern]');
    if (!card) return;
    loadPattern(card.dataset.pattern);
    $('#live-lab')?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth', block: 'start' });
  });
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function loadPattern(id) {
  const pattern = PATTERNS[id];
  if (!pattern) return;
  currentPatternId = id;

  controlState = {};
  for (const c of pattern.controls) {
    controlState[c.id] = c.value;
  }

  $all('.pattern-card').forEach((card) => {
    const active = card.dataset.pattern === id;
    card.classList.toggle('is-active', active);
    card.setAttribute('aria-pressed', String(active));
  });

  const badge = $('#current-pattern-name');
  if (badge) badge.textContent = pattern.name;

  renderControls(pattern);
  renderPreviews(pattern);
  renderCode(pattern);
}

function renderControls(pattern) {
  const panel = $('#controls-panel');
  const container = $('#controls-container');
  if (!panel || !container) return;

  if (!pattern.controls.length) {
    panel.hidden = true;
    container.innerHTML = '';
    return;
  }

  panel.hidden = false;
  container.innerHTML = pattern.controls
    .map((c) => {
      if (c.type === 'range') {
        return `
          <div class="control">
            <label for="ctrl-${c.id}">${c.label}: <span data-val="${c.id}">${c.value}</span></label>
            <input id="ctrl-${c.id}" type="range" min="${c.min}" max="${c.max}" value="${c.value}" data-control="${c.id}" />
          </div>`;
      }
      if (c.type === 'select') {
        return `
          <div class="control">
            <label for="ctrl-${c.id}">${c.label}</label>
            <select id="ctrl-${c.id}" data-control="${c.id}">
              ${c.options
                .map(
                  (o) =>
                    `<option value="${o.value}" ${o.value === c.value ? 'selected' : ''}>${o.label}</option>`
                )
                .join('')}
            </select>
          </div>`;
      }
      return `
        <div class="control">
          <label for="ctrl-${c.id}">${c.label}</label>
          <input id="ctrl-${c.id}" type="text" value="${escapeHtml(String(c.value))}" data-control="${c.id}" />
        </div>`;
    })
    .join('');

  container.onchange = container.oninput = (e) => {
    const el = e.target;
    if (!el.dataset?.control) return;
    const key = el.dataset.control;
    controlState[key] = el.type === 'range' ? Number(el.value) : el.value;
    const valLabel = container.querySelector(`[data-val="${key}"]`);
    if (valLabel) valLabel.textContent = el.value;
    renderPreviews(pattern);
    renderCode(pattern);
  };
}

function renderPreviews(pattern) {
  const safe = $('#safe-preview');
  const legacy = $('#original-preview');
  if (!safe || !legacy) return;

  safe.innerHTML = pattern.safeHTML(controlState);
  legacy.innerHTML = pattern.legacyHTML(controlState);

  if (typeof pattern.afterRender === 'function') {
    pattern.afterRender(safe);
  }
}

function renderCode(pattern) {
  const html = pattern.htmlCode(controlState);
  const css = pattern.cssCode(controlState);
  const react = pattern.reactCode(controlState);

  const htmlEl = $('#html-code');
  const cssEl = $('#css-code');
  const reactEl = $('#react-code');
  const rationaleEl = $('#rationale-content');

  if (htmlEl) htmlEl.textContent = html;
  if (cssEl) cssEl.textContent = css;
  if (reactEl) reactEl.textContent = react;
  if (rationaleEl) rationaleEl.innerHTML = pattern.rationale;
}

function setupTabs() {
  const tabs = $all('[role="tab"]');
  const panels = $all('[role="tabpanel"]');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      const id = tab.getAttribute('aria-controls');
      tabs.forEach((t) => {
        const selected = t === tab;
        t.setAttribute('aria-selected', String(selected));
        t.tabIndex = selected ? 0 : -1;
      });
      panels.forEach((p) => {
        p.hidden = p.id !== id;
      });
    });
  });
}

function setupTheme() {
  const root = document.documentElement;
  const btn = $('#theme-toggle');
  const icon = $('#theme-icon');

  const saved = localStorage.getItem('interop-lab-theme');
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  const isLight = saved ? saved === 'light' : prefersLight;
  root.classList.toggle('light', isLight);
  if (icon) icon.textContent = isLight ? '☾' : '☀';

  btn?.addEventListener('click', () => {
    const next = !root.classList.contains('light');
    root.classList.toggle('light', next);
    localStorage.setItem('interop-lab-theme', next ? 'light' : 'dark');
    if (icon) icon.textContent = next ? '☾' : '☀';
  });
}

function setupCopyButtons() {
  $all('[data-copy]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.copy;
      const el = document.getElementById(target);
      if (el) copyText(el.textContent || '');
    });
  });

  $('#bookmark-btn')?.addEventListener('click', async () => {
    const url = location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Interop 2026 Pattern Lab', url });
        return;
      } catch {
        /* fall through */
      }
    }
    await copyText(url);
    toast('Lab URL copied — bookmark it');
  });
}

function setupSmoothAnchors() {
  $all('[data-scroll]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.scroll;
      const el = document.getElementById(id);
      el?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    });
  });
}

/* —— Paste copilot —— */
const RULES = [
  {
    test: /position:\s*fixed|z-index:\s*\d{3,}|createPortal|Modal|focus-trap|FocusTrap/i,
    icon: 'warn',
    title: 'Custom modal stack detected',
    body: 'Prefer native <dialog closedby="any"> with form method="dialog". Interop 2026 closes light-dismiss gaps.',
    rebuild: 'dialog',
  },
  {
    test: /tooltip|FloatingUI|@floating-ui|data-tip|title=/i,
    icon: 'info',
    title: 'Tooltip / floating UI',
    body: 'Use popover="hint" + CSS anchor positioning instead of measuring getBoundingClientRect().',
    rebuild: 'tooltip',
  },
  {
    test: /useState\s*\(\s*(false|true)\s*\).*menu|hamburger|mobile-nav|onClick.*setOpen/is,
    icon: 'warn',
    title: 'JS menu state',
    body: 'Declarative Popover API + anchor positioning removes open state and click-outside handlers.',
    rebuild: 'nav',
  },
  {
    test: /@media\s*\(\s*min-width|max-width/i,
    icon: 'info',
    title: 'Viewport media queries',
    body: 'Where layout depends on the component, switch to @container size queries (and style() for themes).',
    rebuild: 'card',
  },
  {
    test: /background(-color)?:\s*#|color:\s*#fff|color:\s*white/i,
    icon: 'ok',
    title: 'Hard-coded contrast pairs',
    body: 'Use oklch() for the surface and contrast-color() for foreground text (with a solid fallback).',
    rebuild: 'button',
  },
  {
    test: /swiper|slick|embla|carousel|translateX|IntersectionObserver/i,
    icon: 'info',
    title: 'Carousel / scroll UI',
    body: 'CSS scroll-snap is enough for many galleries. Add scroll-driven animations as progressive enhancement.',
    rebuild: 'scroll',
  },
  {
    test: /accordion|Collapse|expanded|aria-expanded/i,
    icon: 'ok',
    title: 'Accordion pattern',
    body: 'Native <details name="group"> gives exclusive expand/collapse with zero JS.',
    rebuild: 'accordion',
  },
  {
    test: /framer-motion|animate\.|gsap|AOS|aos-animate/i,
    icon: 'warn',
    title: 'JS animation library',
    body: 'Prefer CSS transitions + @media (prefers-reduced-motion: reduce). Use scroll-driven or view transitions only when needed.',
    rebuild: 'hero',
  },
  {
    test: /<button|btn|Button/i,
    icon: 'ok',
    title: 'Button surface',
    body: 'Theme with OKLCH custom properties; set text via contrast-color() for automatic WCAG-minded contrast.',
    rebuild: 'button',
  },
];

function analyzePaste() {
  const input = $('#paste-input')?.value?.trim() || '';
  const results = $('#paste-results');
  const analysis = $('#analysis-output');
  const rebuilt = $('#rebuilt-code');
  if (!results || !analysis || !rebuilt) return;

  if (!input) {
    toast('Paste some HTML, CSS, or a component first');
    return;
  }

  const hits = RULES.filter((r) => r.test.test(input));
  const findings =
    hits.length > 0
      ? hits
      : [
          {
            icon: 'info',
            title: 'General Interop pass',
            body: 'No high-risk anti-patterns matched. Apply clamp() type, logical properties, reduced-motion guards, and prefer native dialog/popover where UI is overlay-like.',
            rebuild: 'hero',
          },
        ];

  analysis.innerHTML = `
    <ul class="analysis-list">
      ${findings
        .map(
          (f) => `
        <li>
          <span class="icon icon--${f.icon}" aria-hidden="true">${f.icon === 'ok' ? '✓' : f.icon === 'warn' ? '!' : 'i'}</span>
          <div>
            <strong style="color:var(--text)">${escapeHtml(f.title)}</strong><br>
            ${escapeHtml(f.body)}
            ${
              f.rebuild
                ? ` <button type="button" class="btn btn--ghost" style="margin-block-start:0.4rem;padding:0.25rem 0.55rem;font-size:0.75rem" data-load="${f.rebuild}">Open ${escapeHtml(PATTERNS[f.rebuild]?.name || f.rebuild)} pattern</button>`
                : ''
            }
          </div>
        </li>`
        )
        .join('')}
    </ul>`;

  const primary = findings.find((f) => f.rebuild) || findings[0];
  const pattern = PATTERNS[primary.rebuild] || PATTERNS.hero;
  const safeSnippet = `${pattern.htmlCode({})}\n\n/* CSS */\n${pattern.cssCode({})}`;
  rebuilt.textContent = safeSnippet;
  results.hidden = false;

  analysis.onclick = (e) => {
    const btn = e.target.closest('[data-load]');
    if (!btn) return;
    loadPattern(btn.dataset.load);
    $('#live-lab')?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
  };
}

function loadExamplePaste() {
  const sample = `/* Pasted from a typical design-system button + modal */
.btn-primary {
  background-color: #0ea5e9;
  color: #fff;
  padding: 12px 24px;
  border-radius: 8px;
}

@media (min-width: 768px) {
  .card-grid { grid-template-columns: repeat(3, 1fr); }
}

function Modal({ open, onClose, children }) {
  if (!open) return null;
  return createPortal(
    <div className="overlay" onClick={onClose} style={{ position: "fixed", zIndex: 9999 }}>
      <FocusTrap>
        <div className="modal" onClick={(e) => e.stopPropagation()}>
          {children}
        </div>
      </FocusTrap>
    </div>,
    document.body
  );
}

<button className="btn-primary" onClick={() => setOpen(true)}>Get started</button>
<button title="More info">?</button>`;

  const ta = $('#paste-input');
  if (ta) ta.value = sample;
  analyzePaste();
}

function init() {
  renderPatternCards();
  setupTabs();
  setupTheme();
  setupCopyButtons();
  setupSmoothAnchors();

  $('#analyze-btn')?.addEventListener('click', analyzePaste);
  $('#example-btn')?.addEventListener('click', loadExamplePaste);
  $('#copy-rebuilt')?.addEventListener('click', () => {
    const el = $('#rebuilt-code');
    if (el) copyText(el.textContent || '');
  });

  // Default pattern
  loadPattern('button');

  // Cmd/Ctrl+K focuses paste area
  document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      $('#paste-input')?.focus();
      $('#paste-section')?.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
    }
  });
}

document.addEventListener('DOMContentLoaded', init);
