# OAOA Design System — Brutalist Light

Portable design brief for agents building new OAOA websites and product UIs.

Aligned with [oaoa.dev](https://oaoa.dev). Extracted and unified from **L0 Agent** and **RIASAP** portal patterns.

Use this file as the single source of truth for look, layout, and chrome. Match these patterns; do not invent a parallel aesthetic.

---

## How to use this file

1. Load fonts + paste the CSS starter (or equivalent tokens).
2. Pick a **surface type**: marketing / login, app shell, or full-height editor.
3. Compose with the layout patterns and components below.
4. Run the checklist before shipping.

---

## Design principles

1. **Light, high-contrast** — white paper, black ink and borders. No dark-mode product chrome.
2. **Brutalist / industrial** — square corners, 1px black borders, hard offset shadows on interaction. No soft glow, glass, or pill-everything.
3. **Typography does the branding** — Inter at 900 weight, uppercase, tight tracking. Brand marks are **italic + uppercase**.
4. **Labels are micro-caps** — tiny uppercase labels with wide letter-spacing.
5. **Code stays dark** — editors, consoles, and `<pre>` use a near-black surface only.
6. **Full width for apps** — no centered max-width shell for product UIs; marketing / login may use `max-w-6xl`.
7. **One title only** — page title lives once (layout *or* page), never duplicated.
8. **Cards sparingly** — prefer bordered sections; cards mainly for nav tiles / interactive containers.

**Avoid:** purple-on-white / indigo gradients, cream + terracotta “AI brochure”, glow/neon, `rounded-full` pills as default, multi-layer soft shadows, dense broadsheet columns, decorative emoji in chrome.

---

## Stack

| Piece | Choice |
|-------|--------|
| Font (UI / display) | **Inter** — 400 / 600 / 700 / **900** |
| Font (mono) | **IBM Plex Mono** — 400 / 500 (fallback: `ui-monospace`) |
| Utility CSS | Tailwind (or equivalent) + small companion sheet |
| Body | `antialiased`, light mode only |
| Radius | **0** everywhere |

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500&family=Inter:wght@400;600;700;900&display=swap"
  rel="stylesheet"
/>
```

---

## CSS variables (tokens)

```css
:root {
  /* Surfaces */
  --bg: #ffffff;
  --bg-elevated: #ffffff;
  --bg-hover: #fcfcfc;
  --bg-wash: #fafafa;          /* zebra, subtle panel wash */
  --bg-wash-strong: #f3f4f6;   /* hover rows, low badges */
  --bg-code: #0c0f14;          /* dark surface for code only */

  /* Borders */
  --border: #000000;
  --border-light: #eeeeee;     /* section dividers, soft row rules */
  --border-strong: #000000;

  /* Text */
  --text: #000000;
  --text-soft: #1a1a1a;        /* long-form body prose */
  --text-muted: #6b7280;       /* labels, meta */
  --text-dim: #9ca3af;         /* disabled / waiting */

  /* Accent = black (not blue/purple) */
  --accent: #000000;
  --accent-dim: #333333;       /* primary hover fill */

  /* Semantic — use sparingly */
  --success: #15803d;          /* usable outcome / completed finding */
  --info: #0369a1;             /* running / in progress (+ optional pulse) */
  --warning: #ca8a04;          /* caution only — never “finding” colour */
  --danger: #b91c1c;           /* failure / error only */
  --purple: #7c3aed;           /* rare draft/status only */

  /* Shape & motion */
  --radius: 0;
  --shadow: 4px 4px 0 #000000;
  --shadow-sm: 2px 2px 0 #000000;
  --shadow-focus: 3px 3px 0 #000000;

  /* Type */
  --font: 'Inter', system-ui, sans-serif;
  --mono: 'IBM Plex Mono', ui-monospace, monospace;
}
```

### Colour usage rules

| Role | Rule |
|------|------|
| Background | Always white (`#fff`). Soft hover: `#fcfcfc`. Washes: `#fafafa` / `#f5f5f5`. |
| Borders | Black for interactive/structure; `#eee` / gray-100 for light separators. |
| Primary action | Black fill, white text; hover `#333` + lift shadow. |
| Secondary / ghost | White/transparent, black border; hover `#fcfcfc` + lift. |
| Danger | White fill, red border + red text — not filled red washes. |
| Status | Prefer outlined (border + matching text). Filled black pill only for “on” / critical severity. |
| Links (chrome) | Black, underlined; hover `#333`. |
| Links (prose) | Underline; hover may invert to black bg / white text. |
| Semantic | **Red = failure. Green = usable outcome (including findings).** Do not use amber as a finding colour. Blue = in progress. |

---

## Typography scale

| Element | Size | Weight | Transform | Letter-spacing | Notes |
|---------|------|--------|-----------|----------------|-------|
| Brand / logo | `1.35rem`–`2rem` (`text-2xl`) | 900 | uppercase | tighter / `-0.04em` | **italic** |
| Page hero (`h1`) | `text-4xl md:text-6xl` (login: `text-5xl md:text-7xl`) | 900 | uppercase | tighter | leading `0.9`; often ends with a period (`Prospects.`) |
| Page title (`h2`) | `clamp(1.75rem, 4vw, 2.5rem)` | 900 | uppercase | `-0.04em` | line-height ~`0.95` |
| Section lead | `text-xl md:text-2xl` | 500 | — | — | `max-w-2xl`, black, tight leading |
| Stat / hero number | `2rem`–`text-3xl` | 900 | — | `-0.04em` | |
| Eyebrow / section index | `11px` | 700 | uppercase | widest | muted; pattern `01 // Console` |
| Card micro eyebrow | `9px` | 700 | uppercase | widest | dim (`gray-400`) |
| Nav / tabs | `10px` | 700 | uppercase | widest | |
| Form labels | `9px`–`10px` | 700 | uppercase | `0.12em`–`0.3em` | muted; denser forms prefer `0.3em` |
| Buttons | `10px`–`11px` | 700 | uppercase | `0.12em`–`0.2em` | large CTAs: wider tracking |
| Body | `0.9rem`–`1rem` | 400 | — | — | line-height `1.4`–`1.5` |
| Table headers | `9px`–`10px` | 700 | uppercase | widest | muted |
| Badges / pills | `0.6rem`–`10px` | 700–900 | uppercase | `0.08em` | |
| Brand tagline | `0.65rem` | 700 | uppercase | `0.12em` | muted |
| Mono meta | `10px`–`xs` | 400–500 | — | — | IDs, paths, timestamps, scores |
| System / status line | `9px` | 700 | uppercase | `0.25em`–`0.3em` | dim |

### Tailwind shorthand (common blocks)

```
/* Brand */
font-black text-2xl tracking-tighter uppercase italic

/* Page hero */
text-4xl md:text-6xl font-black uppercase leading-[0.9] tracking-tighter

/* Eyebrow */
text-[11px] font-bold text-gray-500 uppercase tracking-widest

/* Nav / chrome */
text-[10px] font-bold uppercase tracking-widest
```

---

## Spacing & layout shell

| Rule | Value |
|------|-------|
| Marketing / login max | `max-w-6xl mx-auto px-6` |
| App content | full width; `px-4 md:px-8` or consistent `1.5rem` |
| Section header pad | `pt-8`–`pt-10` / `pb-8`–`pb-12` |
| Dense chrome | `px-3 py-2` / `px-4 py-2` |
| Primary CTA pad | `px-6 py-3` → `px-8 py-4` (marketing: `px-10 py-5`) |
| Content bottom | `pb-24` on long scroll pages |
| Stack gap | `1rem` |
| Card / section pad | `1.15rem 1.25rem` → `16px 20px` header / `20px` body |
| Form group mb | `1rem` |

### Content width philosophy

- **App / portal:** full-bleed panels, no `max-width` centering on chrome.
- **Marketing / login:** constrained `max-w-6xl`.

---

## Layout patterns

### App shell (portal / dashboard)

```
┌─────────────────────────────────────────────┐
│ Brand (italic UPPER)          actions/user  │  ← full width, border-b black
├─────────────────────────────────────────────┤
│ TAB  TAB  TAB  TAB                          │  ← micro-caps
├─────────────────────────────────────────────┤
│ PAGE TITLE (huge UPPER)                     │  ← optional; omit on editors
├─────────────────────────────────────────────┤
│  scrollable content (full width)            │
└─────────────────────────────────────────────┘
```

- Shell: `height: 100dvh`, column flex, `overflow: hidden`.
- Content: `flex: 1; min-height: 0; overflow: auto`.
- Top nav: white, `border-b border-black`; wordmark left; user/actions right.
- **Tabs — bordered style (portal):** active `border border-black text-black`; idle `border-transparent text-gray-500`, hover black border.
- **Tabs — underline style (section):** `border-b border-black`; active `border-b-2 border-black -mb-px`; idle muted.

### Page header block

```html
<header class="pt-8 pb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
  <div>
    <span class="text-[11px] font-bold text-gray-500 uppercase tracking-widest block mb-4">02 // Section</span>
    <h1 class="text-4xl md:text-6xl font-black uppercase leading-[0.9] tracking-tighter">Title.</h1>
    <p class="text-xl font-medium max-w-2xl text-black leading-tight mt-6">One supporting sentence.</p>
  </div>
  <button class="btn-black px-8 py-4 text-xs font-bold uppercase tracking-[0.2em]">Primary action</button>
</header>
```

Rules: layout title *or* page header title — not both. Action toolbar right-aligned on list pages.

### Stat strip / service grid (hairline)

Black 1px gutters via `gap-px bg-black border border-black`:

```html
<div class="grid grid-cols-2 md:grid-cols-4 gap-px bg-black border border-black">
  <div class="bg-white p-5">
    <div class="text-[9px] font-bold uppercase tracking-widest text-gray-400">Label</div>
    <div class="text-3xl font-black mt-1">42</div>
  </div>
</div>
```

### Nav cards (same gap-px grid)

```html
<button class="nav-card bg-white p-8 md:p-10 text-left hover:bg-gray-50 transition-colors">
  <span class="text-[9px] font-bold text-gray-400 uppercase tracking-widest block mb-4">02 // Targets</span>
  <h2 class="text-xl font-black uppercase tracking-tight mb-3">Prospects</h2>
  <p class="text-sm text-gray-600 leading-relaxed">Short description.</p>
</button>
```

### List pages

1. Single title source.
2. Optional filter bar above the table (bordered; filters left, primary action right).
3. Full-width bordered table.

### Detail / editor (full-height)

- Drop the layout page title.
- No content padding; `overflow: hidden`; fill remaining height.
- Toolbar strip + main pane (+ optional right sidebar).
- Only for true full-height UIs (editors, ticket workspace). Tall forms stay in normal scrollable content.

### Marketing / landing (oaoa.dev)

- Nav: brand left, micro-caps links, outline CTA.
- Hero: huge uppercase display, tight leading (`0.9`), one short supporting sentence, black + outline CTA pair.
- First viewport budget: brand, one headline, one sentence, one CTA group, one dominant visual — no stats/schedules/promo clutter in the hero.
- Service grid: hairline `gap-px` black grid with white cells.
- Section divider: top border `#eeeeee`.

---

## Components

### Buttons

```css
.btn, .btn-outline {
  border: 1px solid var(--border);
  border-radius: 0;
  padding: 0.55rem 1rem;
  font-weight: 700;
  font-size: 0.6875rem;
  text-transform: uppercase;
  letter-spacing: 0.12em;
  background: var(--bg);
  color: var(--text);
  cursor: pointer;
  transition: transform 0.1s, box-shadow 0.1s, background 0.1s;
}
.btn:hover:not(:disabled),
.btn-outline:hover:not(:disabled) {
  background: var(--bg-hover);
  transform: translate(-2px, -2px);
  box-shadow: var(--shadow);
}
.btn-black, .btn-primary {
  background: #000;
  color: #fff;
  border-color: #000;
}
.btn-black:hover:not(:disabled),
.btn-primary:hover:not(:disabled) {
  background: #333;
  transform: translate(-2px, -2px);
  box-shadow: var(--shadow);
}
.btn-ghost { background: transparent; }
.btn-danger {
  color: var(--danger);
  border-color: var(--danger);
  background: #fff;
}
.btn-sm { padding: 0.35rem 0.7rem; font-size: 0.625rem; }
```

Typical utility pairing:

```
btn-black px-6 py-3 text-[10px] font-bold uppercase tracking-widest
btn-black px-8 py-4 text-xs font-bold uppercase tracking-[0.2em]
```

### Forms

- Label: micro-caps, muted, above field (`.field-label`).
- Control: full width, white bg, **1px black** border, square, padding ~`10px 14px`.
- Focus: hard offset shadow (`3px 3px 0 #000`) — **never** a blue/blur ring. Optional light `translate(-1px, -1px)`.
- Textareas for code: mono font.

```css
.field-label {
  font-size: 9px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.3em;
  color: var(--text-muted);
  display: block;
  margin-bottom: 6px;
}
.field-input {
  width: 100%;
  border: 1px solid #000;
  border-radius: 0;
  padding: 10px 14px;
  font-size: 0.875rem;
  background: #fff;
  outline: none;
}
.field-input:focus {
  box-shadow: var(--shadow-focus);
}
```

### Section cards

```
.section-card   → border: 1px solid #000
.section-header → padding 16px 20px; border-bottom 1px solid #000; flex space-between
.section-body   → padding 20px
```

White, square, **no soft drop shadow**. Prefer flat bordered regions over nested card stacks.

### Tables

- Wrapper: `border border-black overflow-x-auto`.
- Header: micro-caps muted; optional black-fill / white text for wiki-style docs.
- Rows: light bottom borders; zebra `#fafafa`; hover `#f3f4f6` or `#fcfcfc`.
- Clickable rows: cursor pointer.

### Badges / status

- Square, uppercase micro type, 1px border.
- **Default:** outlined (border + matching text), white fill.
- **On / critical:** black fill, white text (`.status-pill-on`).
- **Severity:** Critical/High = black fill; Medium = white; Low/Info = `#f3f4f6`.
- Semantic mapping: pending/warning, active/success, failed/danger, running/info, draft/purple (rare).

### Filter bar

Bordered strip above lists (`border border-black`, optional `bg-gray-50`). Filters left, primary action right.

### Progress

```
.progress-track → height 4px; bg #eee; border 1px solid #000
.progress-bar   → bg #000; width transition 0.25s
```

### Modal / dialog

```css
dialog.modal-panel {
  border: 1px solid #000;
  background: #fff;
  padding: 0;
  width: min(440px, 92vw);
  border-radius: 0;
}
dialog.modal-panel::backdrop {
  background: rgba(0, 0, 0, 0.45);
}
```

### Message / callout

Left rule, no coloured alert boxes:

```
text-sm font-semibold border-l-4 border-black pl-3
```

Intro callouts (login): `border-l-4 border-black pl-6`.

Error box: white bg, red border, red text — no pink fill wash.

### Code / console

- Background `--bg-code` (`#0c0f14`), light text (`#e8eef6`).
- Outer frame: black border, square.
- Editors: dark theme (`vs-dark`), framed by black border.

---

## Interaction motion

| Interaction | Behaviour |
|-------------|-----------|
| Button / outline hover | `translate(-2px, -2px)` + `box-shadow: 4px 4px 0 #000` |
| Input focus | Hard `3px 3px 0 #000` shadow (optional light translate) |
| Links in prose | Underline; hover invert black/white |
| Running status | Opacity pulse ~1.2s |
| Duration | `0.1s`–`0.12s` ease; progress `0.25s` |
| Disabled | `opacity: 0.45`, no transform |
| View switching | `.hidden { display: none !important; }` wins over utilities |

Keep motion sparse — presence, not decoration. Ship 2–3 intentional motions on visually led pages.

---

## Copy / voice in UI

- Short labels; uppercase where structural.
- Numbered eyebrows: `01 // Console`, `02 // Targets`.
- Hero titles often end with a period: `Catalogue.`
- Primary verbs: Save, New …, Run, Analyse, Sign out.
- Empty states: plain muted sentence (“No tickets”), centered in table cell.
- No emoji in chrome.
- Mono for IDs, paths, timestamps, scores.

---

## Do / don’t

### Do

- White paper, black ink, 1px borders, `--radius: 0`
- Uppercase micro-labels with wide tracking
- Massive compressed display titles; brand italic uppercase
- Numbered eyebrows (`01 // …`)
- Hard offset shadows on interactive chrome
- Outlined status by default; dark surface only for code
- Full-width app chrome; constrained marketing/login

### Don’t

- Purple / indigo gradient themes or cream + terracotta brochure looks
- Soft neumorphism, glass, or multi-layer blur shadows
- `rounded-full` status chips as the default
- Dense newspaper / broadsheet column layouts
- Decorative emoji in chrome
- Cards for everything
- Duplicate page titles
- Amber/orange as a “finding” colour

---

## Minimal CSS starter

Paste into a new project (pair with Tailwind utilities as needed):

```css
:root {
  --bg: #ffffff;
  --bg-hover: #fcfcfc;
  --bg-code: #0c0f14;
  --border: #000000;
  --border-light: #eeeeee;
  --text: #000000;
  --text-muted: #6b7280;
  --accent-dim: #333333;
  --success: #15803d;
  --info: #0369a1;
  --warning: #ca8a04;
  --danger: #b91c1c;
  --radius: 0;
  --font: 'Inter', system-ui, sans-serif;
  --mono: 'IBM Plex Mono', ui-monospace, monospace;
  --shadow: 4px 4px 0 #000000;
  --shadow-sm: 2px 2px 0 #000000;
  --shadow-focus: 3px 3px 0 #000000;
}

body {
  margin: 0;
  font-family: var(--font);
  background: var(--bg);
  color: var(--text);
  line-height: 1.5;
  -webkit-font-smoothing: antialiased;
}

h1, .brand {
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: -0.04em;
  font-style: italic;
}

h2.page-title {
  font-size: clamp(1.75rem, 4vw, 2.5rem);
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: -0.04em;
  line-height: 0.95;
}

.label, .tab, .btn, th, .badge, .field-label {
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

.btn, .btn-outline {
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 0.55rem 1rem;
  font-size: 0.6875rem;
  background: #fff;
  color: #000;
  cursor: pointer;
  transition: transform 0.1s, box-shadow 0.1s, background 0.1s;
}
.btn:hover:not(:disabled),
.btn-outline:hover:not(:disabled) {
  background: var(--bg-hover);
  transform: translate(-2px, -2px);
  box-shadow: var(--shadow);
}
.btn-black, .btn-primary { background: #000; color: #fff; }
.btn-black:hover:not(:disabled),
.btn-primary:hover:not(:disabled) {
  background: #333;
  transform: translate(-2px, -2px);
  box-shadow: var(--shadow);
}

.field-label {
  font-size: 9px;
  letter-spacing: 0.3em;
  color: var(--text-muted);
  display: block;
  margin-bottom: 6px;
}
.field-input, .input, .select, .textarea {
  width: 100%;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 10px 14px;
  background: #fff;
  outline: none;
  font-family: inherit;
}
.field-input:focus, .input:focus, .select:focus, .textarea:focus {
  box-shadow: var(--shadow-focus);
}

.section-card, .card, .table-wrap, .panel {
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: #fff;
}
.section-header {
  padding: 16px 20px;
  border-bottom: 1px solid #000;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.section-body { padding: 20px; }

.status-pill {
  font-size: 0.6rem;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding: 2px 8px;
  border: 1px solid #000;
  display: inline-block;
  background: #fff;
}
.status-pill-on { background: #000; color: #fff; }

.pre, .console {
  background: var(--bg-code);
  color: #e8eef6;
  border: 1px solid var(--border);
  font-family: var(--mono);
}

.hidden { display: none !important; }
```

---

## Checklist for a new UI

- [ ] Inter + IBM Plex Mono loaded
- [ ] White bg, black text/borders, `--radius: 0`
- [ ] Offset black shadow on button hover (`4px 4px 0`)
- [ ] Hard focus shadow on inputs (no blue ring)
- [ ] Micro-caps labels / tabs / table headers
- [ ] Huge uppercase page titles (900 weight); brand italic uppercase
- [ ] Numbered eyebrows where sections need index (`01 // …`)
- [ ] Outlined status badges by default (not soft pills)
- [ ] Dark surface only for code
- [ ] No purple gradient / cream-serif / glow defaults
- [ ] Full-width app chrome (unless marketing / login)
- [ ] Single page title (no duplicate headings)
- [ ] Hairline `gap-px` grids for stats / nav tiles when used
- [ ] Red = failure; green = usable finding; no amber findings

---

*Merged from L0 Agent `styles.md` + RIASAP `styles.md` (portal CSS / Tailwind patterns + oaoa.dev).*
