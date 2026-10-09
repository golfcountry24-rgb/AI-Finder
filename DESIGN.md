---
name: AI Finder — Quiet Index 2
colors:
  canvas: '#F5F4F0'
  surface: '#FFFFFF'
  surface-sunken: '#EEECE6'
  line: '#E3E0D8'
  line-strong: '#CCC8BE'
  control-border: '#8F8B82'
  ink: '#1A1917'
  ink-2: '#4B4944'
  ink-3: '#686660'
  ink-disabled: '#9C9A93'
  accent: '#B4471F'
  accent-hover: '#9A3C19'
  accent-soft: '#F8E7DF'
  error: '#B42318'
  error-soft: '#FBE9E7'
  success: '#2F6B4F'
  footer-bg: '#1A1917'
  footer-text: '#E9E7E1'
  footer-muted: '#A3A1A8'
typography:
  display:
    fontFamily: Onest
    fontSize: clamp(2.5rem, 1.6rem + 3.6vw, 4.5rem)
    fontWeight: '600'
    lineHeight: '1.02'
    letterSpacing: -0.035em
  page-title:
    fontFamily: Onest
    fontSize: clamp(2.25rem, 1.6rem + 2.6vw, 3.5rem)
    fontWeight: '600'
    lineHeight: '1.05'
    letterSpacing: -0.03em
  heading:
    fontFamily: Onest
    fontSize: 1.75rem
    fontWeight: '600'
    lineHeight: '1.15'
    letterSpacing: -0.02em
  title:
    fontFamily: Onest
    fontSize: 1.125rem
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Onest
    fontSize: 1.125rem
    fontWeight: '400'
    lineHeight: '1.6'
  body:
    fontFamily: Onest
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: '1.6'
  small:
    fontFamily: Onest
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: '1.55'
  caption:
    fontFamily: Onest
    fontSize: 0.8125rem
    fontWeight: '500'
    lineHeight: '1.45'
  data:
    fontFamily: Geist Mono
    fontSize: 0.8125rem
    fontWeight: '450'
    lineHeight: '1.4'
rounded:
  xs: 6px
  sm: 10px
  md: 16px
  lg: 24px
  xl: 32px
  full: 9999px
spacing:
  unit: 4px
  1: 4px
  2: 8px
  3: 12px
  4: 16px
  5: 20px
  6: 24px
  7: 32px
  8: 40px
  9: 56px
  10: 80px
  gutter: clamp(16px, 4vw, 40px)
  container: 1240px
---

# Design System: AI Finder — "Quiet Index 2"

## 1. Visual Theme & Atmosphere

AI Finder is a reading tool, not a launch page. The interface should feel like a well-made
reference book or a calm research desk. It is warm and quiet, precise and generous with air,
and the content (names, summaries, dates, ratings) carries the visual weight. Decoration
only appears where it explains something.

**Taste dials:** Density 5 ("Daily App Balanced"), Variance 5 ("Offset Asymmetric": left-aligned
hero with a side column, never centred), Motion 5 ("Fluid": fast, purposeful, spring-based, never
cinematic).

**Signature:** a warm stone canvas with soft white panels (32px radius, a faint ember glow and dot grid
in the hero), a floating glass navigation capsule, near-black warm ink, one ember accent used only for
interaction, a two-tone display headline ending in an ember full stop, and monospace kept strictly
for machine data.

**Version 2 changes:** larger radii and softer layered shadows instead of hairline boxes; a floating
header; filters in one scrollable track; borderless filled controls (no visible grey outlines); one
unified motion — everything slides up from below.

## 2. Color Palette & Roles

One warm-neutral family (hue ≈ 40–48°) and a single accent. No warm/cool grey mixing, no pure black.
All text pairs meet WCAG AA. The ratios below were computed.

### Primary Foundation
- **Stone Canvas** (`#F5F4F0`): page background.
- **Paper White** (`#FFFFFF`): cards, inputs, modal, header bar.
- **Sunken Stone** (`#EEECE6`): quiet fills such as chips, tags, the hover background of ghost controls and skeleton blocks.
- **Hairline** (`#E3E0D8`): card borders and dividers. Decorative only.
- **Firm Hairline** (`#CCC8BE`): hover borders and table rules.
- **Control Edge** (`#8F8B82`): borders of real form controls. Contrast is 3.4:1 on white, enough for the non-text minimum.

### Typography & Text Hierarchy
- **Warm Ink** (`#1A1917`): headings and primary text (17.6:1 on white).
- **Graphite** (`#4B4944`): body copy and summaries (9.0:1).
- **Ash** (`#686660`): metadata, captions and placeholders (5.7:1 on white, 5.2:1 on canvas).
- **Disabled Ash** (`#9C9A93`): disabled labels only. Never use it for readable content.

### Accent & Interactive
- **Ember** (`#B4471F`, saturation 71%): the only accent. Used for the focus ring, active indicators,
  the display underline, links on hover, the toggle "on" state, the "New" label and the timeline rail.
  White on Ember is 5.4:1.
- **Deep Ember** (`#9A3C19`): pressed and hover state of accent elements and hovered text links.
- **Ember Wash** (`#F8E7DF`): background of the "New" label. Ember text on it is 4.5:1.
- The primary CTA is **Warm Ink** filled with white text, and Ember appears only as its focus ring.
  This keeps the accent rare and therefore meaningful.

### Functional States
- **Alert Red** (`#B42318`) on **Alert Wash** (`#FBE9E7`): API errors and failed "Load more".
- **Moss** (`#2F6B4F`): the "live" status dot only.

## 3. Typography Rules

- **UI and display font:** *Onest* (variable, self-hosted via @fontsource). It is a modern grotesque designed
  for Latin **and Cyrillic**, so the English and Ukrainian versions look identical (the previous face had no
  Cyrillic). Hyphenated compounds in headlines are kept on one line (`NoBreak`).
- **Data font:** *Geist Mono* (variable). Used **only** for domains, numbers, dates, ratings and code.
  Numbers use `font-variant-numeric: tabular-nums`.
- **Banned:** Inter, system-font-only stacks for display, any serif (this is a software UI),
  and uppercase monospace "labels" used as decoration.

### Hierarchy & Weights
| Role | Size | Weight | Line height | Tracking |
|---|---|---|---|---|
| Display (home hero) | clamp(40 → 72px) | 600 | 1.02 | −0.035em |
| Page title (New AI, About) | clamp(36 → 56px) | 600 | 1.05 | −0.03em |
| Section heading | 28px | 600 | 1.15 | −0.02em |
| Card / item title | 18px | 600 | 1.3 | −0.01em |
| Lead | 18px | 400 | 1.6 | 0 |
| Body | 16px | 400 | 1.6 | 0 |
| Small (summaries, controls) | 14px | 400/500 | 1.55 | 0 |
| Caption (meta labels) | 13px | 500 | 1.45 | 0 |
| Data (mono) | 13px | 450 | 1.4 | −0.01em |

- The display headline is two-tone. The first clause is in Warm Ink, the second in Ash, and the full stop
  is in Ember. The hierarchy comes from weight and colour, not from size alone. Tracking is −0.045em.
- Body copy is at most about 65 characters per line (`max-width: 62ch`).
- Small labels use sentence case. Uppercase is not used anywhere.

## 4. Component Stylings

### Buttons
- **Shape:** pill (`9999px`), 44px minimum height (40px for compact toolbar controls), 0 20px padding, 15px / 600.
- **Primary:** Warm Ink fill, white text. On hover it lightens to `#2E2C29`. When pressed it moves down 1px.
- **Secondary (ghost):** a Sunken Stone fill with no border. On hover it changes to the Hairline tone.
- **Icon button:** a 36px borderless circle (40px on touch) in Sunken Stone. On hover it fills with Ember and
  the arrow nudges up and to the right. Every icon button has an accessible name.
- **Disabled / loading:** 50% opacity, `cursor: progress` while loading. The label changes ("Loading…").
- **No** glows, gradients or offset "brutalist" shadows.

### Cards (catalogue items)
- Paper White, an almost invisible edge (`line-soft`, 6% ink), **24px radius**, 24px padding, resting
  shadow `shadow-sm` plus a 1px white inner highlight.
- On hover the card lifts 4px and gets a soft tinted `shadow-md` (400ms ease-out). Keyboard focus draws the
  Ember ring around the whole card.
- **Anatomy, top to bottom:** favicon (40px, 10px radius) next to the name (title) and domain (mono data),
  with a Visit icon button at the top right. Below that come a 3-line summary in Graphite, at most 2 category
  tags, then a footer above a hairline with the Domain Rating meter on the left and the launch date (plus
  "New") on the right.
- Removed noise: the ordinal numbers, the second CTA inside the card and the uppercase labels.

### Tags & chips
- **Category tags** (read-only) use a Sunken Stone fill, no border, 6px radius and 12px / 500 Graphite text.
  A matched tag gets an Ember Wash fill with Deep Ember text.
- **Filter chips** sit in one pill-shaped **track** (Sunken Stone with an inset shadow) that scrolls
  horizontally. Its edges fade where it continues, and round arrow buttons appear only when there is more
  to scroll (hidden on touch screens). Chips are 38px high, 14px / 500 and transparent; on hover they turn
  white. The active chip is Warm Ink with white text. `aria-pressed` reflects the state.

### Inputs & Forms
- **Search:** a 60px **capsule** (54px on mobile, 16px text to avoid iOS zoom) in Paper White with a light
  Hairline edge and `shadow-sm`. On hover the shadow deepens. On focus the edge turns Ember with a soft 4px
  Ember halo at 18% alpha, which is the only focus treatment for this field. Clear is a filled pill, and a
  spinner shows while a debounced query is pending.
- **Select ("Sort by")** is a custom listbox, not the native control. The trigger is a borderless Sunken Stone pill
  with a caption and the value, and its chevron rotates when open. The list is a white 16px-radius panel with
  `shadow-lg` that fades in and slides 6px down while scaling from 97% (260–320ms ease-out). The options follow in
  a 25ms cascade. The active option gets a Sunken Stone fill, and the selected one is semibold with an Ember check.
  It closes with a 200ms fade, flips upwards when space below is short, and supports full keyboard control.
- **Toggle:** a borderless 40×24 track in Firm Hairline with a white knob. When on, the track is Ember.
- **No native outlines:** `outline: 0` is set on every element (buttons, selects, inputs, links, the dialog).
  Keyboard users still get the Ember ring through `:focus-visible`, and mouse clicks show nothing.

### Modal (site details)
- A native `<dialog>` with a **32px radius**, Paper White, `shadow-lg` and a backdrop of Warm Ink at 40% with a 6px blur.
- **Open:** the dialog rises 32px and fades in while the backdrop fades in (460ms, ease-out).
  **Close:** both fade out together while the dialog sinks 24px (320ms, ease-in-out). They are CSS
  animations on the dialog and its `::backdrop`, so the backdrop never disappears abruptly. `Esc` and a
  backdrop click run the same exit.
  Width is min(640px, 100vw − 32px).
- The header has a 56px favicon, the page title and the domain. Sections are labelled with captions in Ash.
  Facts are a two-column definition table with hairline rules.
- **Mobile (< 560px):** it becomes a bottom sheet with a 32px top radius, full width and 92dvh maximum. It slides
  up from the bottom edge and back down on close.

### Tables & data lists
- The fact table in the modal and the field list on About use hairline row rules, labels in Ash on the left
  and values in mono on the right, aligned right. There are no zebra stripes and no vertical borders except
  the single column divider.

### Navigation
- A **floating glass capsule**: sticky, 12px from the top, 60px high, Paper White at 85% with a 16px blur,
  `shadow-sm` and a white inner highlight.
- Links are 44px pills, 15px / 500 Graphite. Hover adds a Sunken Stone fill. The active link is Warm Ink with
  white text. "API docs" is a filled Sunken Stone pill with the live dot.
- **On scroll** the capsule turns almost opaque (96% white) with `shadow-md`, so content no longer shows through.
- **Language switch (UA / EN):** a segmented pill in Sunken Stone. A white thumb slides to the active language.
  It sits at the right end of the bar and stays visible on mobile next to the menu button.
- **Mobile (< 720px):** a round 44px button opens a dropdown card under the capsule (24px radius,
  `shadow-lg`) with 52px rows. The panel slides up into place as it fades in.

### Timeline (New AI)
- The date column is sticky, with a 2px Ember rail that grows when it appears. The date is the title, and the
  relative age and count are a caption. Rows reuse the card surface in a wide horizontal layout.

## 5. Layout Principles

### Grid & Structure
- The container is 1240px max with a fluid gutter `clamp(16px, 4vw, 40px)`.
- The home hero is asymmetric: copy and search take about 8/12, and an index-snapshot column takes 4/12 aligned to
  the bottom. It is never centred.
- The catalogue is a CSS grid `repeat(auto-fill, minmax(min(100%, 320px), 1fr))` with 20px gaps.
- New AI uses a 200px sticky date column and a fluid list. About uses a 3-up text row with column rules (not
  cards) and one framed API panel.

### Whitespace Strategy
- The 4px base scale (4, 8, 12, 16, 20, 24, 32, 40, 56, 80) is used everywhere. No one-off values.
- Section rhythm is 56–80px between major blocks on desktop and 40px on mobile. Card padding is 24px (20px on mobile).

### Radii & Elevation
- **Radius scale:** 6 (tags), 10 (favicons), 16 (stat tiles, code blocks, menu rows), 24 (cards, bento tiles),
  32 (hero/page panels, modal, footer panel), pill (buttons, chips, search, nav, toggles). No other values.
- **Shadows** are tinted with Warm Ink and stay soft:
  - `shadow-xs` `0 1px 2px rgb(26 25 23 / .05)` for the active chip
  - `shadow-sm` `0 1px 2px rgb(26 25 23 / .04), 0 4px 16px -6px rgb(26 25 23 / .08)` for resting cards, panels, the header and search
  - `shadow-md` `0 2px 4px rgb(26 25 23 / .04), 0 20px 40px -18px rgb(26 25 23 / .2)` for hovered cards
  - `inset-highlight` `inset 0 1px 0 rgb(255 255 255 / .8)` for the glassy top edge on raised surfaces
  - `shadow-lg` `0 4px 12px rgb(26 25 23 / .06), 0 32px 64px -24px rgb(26 25 23 / .32)` for the modal and the mobile menu

### Responsive Behavior & Touch
- Breakpoints are **960px** (hero stacks, the stats column becomes a row), **720px** (burger menu, filter chips
  become a single horizontally scrollable row with an edge fade) and **560px** (toolbar stacks, the modal becomes
  a bottom sheet, timeline rows reflow).
- Every interactive element is at least 40px, or 44px on touch-first controls. There is no horizontal page scroll at
  any width (`overflow-x: clip` on the root).
- Type scales with `clamp()`, and body text is never smaller than 14px.

## 6. Motion & Interaction

**One movement for the whole product: content slides up from below and fades in.**

- **Fonts:** both families, including their Cyrillic subsets, are loaded before the motion starts.
- **Parameters:** 24px of travel (20px for list items, 12px inside the modal), 800ms, `outQuart`, a 70ms stagger
  in DOM order with the total cascade capped at 560ms.
- **No flash and no jitter:** elements are hidden before the first paint (`useLayoutEffect`), and motion starts
  only after both font families have loaded (capped at 700ms), so text never reflows mid-animation. The
  inline styles are removed when the motion ends. It is safe under React StrictMode: a cancelled run restores
  the element at once.
- **Where:** the hero and page headers on load; the toolbar; only the *new* cards on Load more; date groups and
  rows on New AI; the About tiles as they scroll into view (IntersectionObserver); and the error and empty panels.
- **Removed on purpose:** per-word headline animation, the drawing underline, number count-ups, text scrambles,
  spring "bounces" and the page-level fade. These caused the jitter.
- **Hover and press** use CSS only: 120ms for colour, 180–400ms for lift and shadow, and `scale(.97)` on chip press.
- **The modal** uses CSS keyframes on the dialog and the backdrop (see Modal above).
- **The only perpetual loop** is the soft "live" ripple on the green status dot.
- **Rules:** animate only `transform` and `opacity`. `prefers-reduced-motion` turns everything off.

## 7. States

| State | Treatment |
|---|---|
| Hover | Card lift −4px with a deeper shadow, white fill (chips), Hairline fill (filled controls), Ember fill (icon buttons) |
| Active / pressed | `translateY(1px)`, Deep Ember / ink-darkening, chip spring |
| Focus-visible | A 2px canvas gap plus a 2px Ember ring (`--focus-ring`), keyboard only. Native `outline` is 0 everywhere |
| Disabled | 50% opacity, `cursor: not-allowed` (or `progress` while loading) |
| Loading | Skeleton blocks sized like the real content with a slow shimmer, plus "Searching the index…" in the counter. No full-page spinner |
| Error | An Alert Wash panel with a red glyph, a plain-language title, the API message and a primary **Retry**. Failed "Load more" shows an inline message and "Try again" |
| Empty | A neutral panel with a glyph, the exact query in the title, one hint and a "Reset search & filters" button |

## 8. Anti-Patterns (Banned)

- No purple/blue neon, gradients on text, glowing buttons or glassmorphism stacks
- No pure black `#000000`, and no mixing of warm and cool greys
- No second accent colour (the lime marker and the moss data colour are retired)
- No offset "brutalist" shadows or heavy drop shadows
- No visible native focus outlines or default grey control borders
- No per-letter or per-word text animation, count-ups or scrambles (they read as jitter)
- No uppercase monospace decoration, `LABEL // VALUE` or fake terminal strings
- No Inter, no generic serif, no emojis
- No centred hero, no "3 equal feature cards" marketing row, no scroll-arrow fillers
- No invented numbers. Every statistic on screen is the API's own `total`
- No hidden-until-animated content, and no animation of layout properties
- No more than one primary CTA per view

## 9. Design System Notes for Generation

- **Language:** "quiet, warm, editorial reference tool", "stone canvas, white paper cards, warm ink",
  "one ember accent for interaction only", "two-tone headline with a thin ember underline".
- **Component prompt examples:**
  - *"A catalogue card on white paper with a 20px radius and a hairline border: a 40px favicon tile, a semibold
    18px name with a mono domain under it, a circular arrow button top-right, three lines of graphite summary,
    two soft stone tags and a hairline-separated footer with a thin domain-rating bar and a mono date."*
  - *"A sticky translucent white header with a wordmark, quiet pill navigation where the active item has an
    ember dot, and a small external 'API docs' link."*
- **Iteration:** change one dimension at a time (spacing, then type, then colour). Keep the accent rare.
