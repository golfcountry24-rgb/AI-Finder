# AI Finder — technical details

A small, fully working catalogue of AI websites built on the public **FreeSerp API**.
You can search, filter, sort and explore AI sites, open a detailed card for any of them,
and follow what went live recently. All data comes live from FreeSerp's sites index
(`index=sites`, `category=ai`). Nothing is hand-written or mocked. The production build is a
static `dist/` folder plus a one-file PHP proxy, so it runs on ordinary FTP hosting.

---

## Project concept

> 🇺🇦 The site plan in Ukrainian: [PLAN.md](../PLAN.md)

**Goal:**
A handy catalogue for finding and exploring AI services by what they actually do,
built on real structured data (AI summary, AI categories, Domain Rating, launch date)
rather than marketing copy.

**Audience:**
People looking for AI tools for work, study, development, content creation and
productivity, plus anyone who wants to keep an eye on new AI launches.

**Pages:**

1. **Explore** (`/`): the main catalogue with search, category filters, sorting and Load more
2. **New AI** (`/new`): the most recently launched AI sites, grouped by launch date
3. **About** (`/about`): the project, the data source and a short description of the FreeSerp API

**Structure:**
Header → Hero / Search → Filters & Sorting → AI Catalogue → Details (modal) → Footer

---

## Features

- **Live data** from the FreeSerp API through a thin service layer, with an in-memory cache, request cancellation (`AbortController`) and error normalisation
- **Search** is server-side full-text search (`q`) over title, AI summary and homepage text. It has a 400 ms debounce, a pending spinner, a Clear button and Esc to clear.
- **Filters** use real `ai_categories` values (Chat, Image, Video, Voice, Audio & Music, Code, Agents, Automation, Writing, Productivity, Search, Design, Data, Education, No-code). Each value was checked against the live API.
- **"AI products only"** toggle uses the API's own `ai_startups=1` flag to hide agencies, directories and similar noise
- **Sorting** options: Best match (when searching), Newest / Oldest (`went_live`), Domain Rating (`dr`), A → Z (`domain`)
- **Load more** pagination (`from` / `size`), respecting the API limit `from + size ≤ 10 000`
- **Detail view** uses a native `<dialog>`, so it has focus trapping, closes on Esc or a backdrop click, and becomes a bottom sheet on mobile
- **New AI** is a timeline sorted by `went_live`, grouped by date, with Domain Rating, first-seen date and builder signal (`ai_source`)
- **URL state**: the Explore search, filter, sort and toggle are kept in the URL (`/?q=&cat=&sort=&ai=1`), so results can be shared and survive a reload
- **Loading / Error / Empty states**: skeletons, an error panel with **Retry** (also for failed "Load more"), and an empty state with "Reset search & filters"
- **Missing data handling**: absent fields (`dr`, summary, dates, `ai_source`, …) are hidden or shown as "n/a" and never invented. The favicon falls back to a monogram.
- **Accessibility**: skip link, visible focus rings, `aria-pressed` filter chips, a keyboard-operable card (stretched button) with a separate Visit link, an `aria-live` result counter and `prefers-reduced-motion` support
- **Motion with Anime.js v4** (`src/motion/`): one calm movement for the whole app, where content slides up from below and fades in (hero and page headers, the toolbar, only the new cards on Load more, New AI rows, About tiles on scroll). Elements are hidden before the first paint, and the motion starts only after the web fonts load, so text never jumps. Only transform and opacity are animated, inline styles are removed afterwards, it is safe under React StrictMode, and it is disabled by `prefers-reduced-motion`. The detail modal opens and closes with synchronised CSS animations of the dialog and its backdrop.
- **Two languages: Ukrainian (UA) and English (EN)**: a UA/EN switch in the header; every interface string, document title, aria-label and error message is translated (`src/i18n/`). Numbers, dates and "N days ago" are localised with `Intl` (`89 230`, `8 вер. 2026 р.`, `24 дні тому`), Ukrainian plural forms come from `Intl.PluralRules`, and known FreeSerp category values are translated for display. The first visit follows the browser language, and the choice is remembered. Content that comes from the API (titles, AI summaries) stays in its original language.
- **Custom select** (`Select.jsx`) instead of the native `<select>`: a styled list that fades and slides in with a short item cascade, follows the ARIA listbox pattern (arrows, Home/End, Enter/Space, Esc, Tab, type-ahead), closes on an outside click and flips upwards when there is no room below.
- **Header** is a floating glass capsule that becomes almost opaque once the page is scrolled.
- **Responsive** layout checked at 1440 / 768 / 375 px. Mobile gets a burger menu, a horizontally scrollable filter row, stacked controls and a bottom-sheet modal.

## Tech stack

- **React 19** + **Vite 8** (JavaScript, ES modules)
- **React Router 7** (BrowserRouter, clean URLs)
- **Anime.js 4**: UI motion
- **CSS Modules** + a small set of global design tokens (no UI kit)
- **@fontsource** self-hosted fonts: Onest (UI & display, Latin + Cyrillic), Geist Mono (data only)

## Design

The design system is documented in **[DESIGN.md](../DESIGN.md)**. It is called "Quiet Index 2": a warm stone canvas,
white paper surfaces, warm near-black ink and **one** ember accent (`#B4471F`) used only for interaction
(the focus ring, active states, the display underline and the toggle). Onest carries the UI and
headings, and Geist Mono is used only for machine data (domains, dates, ratings). Every colour, size, radius,
shadow and duration is a CSS custom property in `src/styles/global.css`, and components use only those
tokens. All text pairs meet WCAG AA, and the contrast ratios are listed in DESIGN.md.

## API

**Endpoint:** `GET https://freeserp.ai/api.php` (free, no key). Docs: <https://freeserp.ai/docs.php>

| Parameter | Used for |
|---|---|
| `index=sites` | FreeSerp Main: homepage profiles of live sites |
| `category=ai` | the AI niche |
| `q` | search |
| `ai_categories` | category filter |
| `ai_startups=1` | "AI products only" |
| `sort` / `order` | `relevance`, `went_live`, `dr`, `domain` |
| `from` / `size` | pagination (24 per page on Explore, 30 on New AI) |

Example request:

```
/api.php?index=sites&category=ai&q=video&ai_categories=Video+Generation&sort=went_live&order=desc&from=0&size=24
```

Response fields used: `domain`, `url`, `title`, `ai_summary`, `ai_categories`, `dr`, `went_live`,
`first_seen`, `fetched_at`, `ai_source`, `tld`, `webserver`, `http_status`, and the top-level `total`.

### Two things found while checking the real API

1. **CORS.** The docs call the API CORS-open, but the server actually sends a duplicated
   `Access-Control-Allow-Origin: *, *` header (also on the `OPTIONS` preflight), and browsers reject
   that. There is no JSONP either, so **a direct browser → freeserp.ai request is impossible**.
   The app therefore never calls freeserp.ai from the browser. It calls a same-origin proxy:

   | Where | What handles `api/freeserp.php` |
   |---|---|
   | ordinary PHP / FTP hosting (default) | `public/api/freeserp.php` → copied to `dist/api/freeserp.php` |
   | `npm run dev` / `npm run preview` | Vite proxy in `vite.config.js` (Node has no PHP) |
   | hosting without PHP (GitHub Pages, Netlify, Vercel…) | `deploy/cloudflare-worker.js` + build with `VITE_API_BASE=<worker URL>` |

   The PHP proxy accepts **GET only**, has a **fixed upstream URL**, forwards **only whitelisted
   parameters** (`q`, `ai_categories`, `ai_startups`, `sort`, `order`, `from`, `size`) and forces
   `index=sites&category=ai`, so it can't be abused as an open proxy. It uses cURL, or falls back to
   `file_get_contents`, and keeps a 60-second file cache. No keys or secrets are involved.
2. **Category names.** The docs list `Chatbot & Assistant`, but the data uses `AI Chatbot & Assistant`
   (the documented value returns 0 results). The filters use the values that actually exist in the data.

## Routing and SEO

The app uses clean URLs: `/`, `/new`, `/about` (React Router's `BrowserRouter`). Filters live in
the query string, e.g. `/?q=video&cat=Video%20Generation&sort=dr`. Old hash links (`/#/new`) are
redirected to the clean ones on load.

At build time `vite.config.js` (plugin `ai-finder-seo`) writes:

- **one HTML file per route** — `index.html`, `new.html`, `about.html`, `404.html` — each with its own
  `<title>`, meta description, canonical URL, Open Graph / Twitter card tags and schema.org JSON-LD
  (`WebSite` with a `SearchAction`, plus `CollectionPage` / `AboutPage`). Crawlers and link
  previews get the right tags without running JavaScript; `404.html` is `noindex`;
- **`sitemap.xml`** and **`robots.txt`** for the public address.

The texts live in `src/seo/config.js` (EN + UK). On client-side navigation and language switches
`src/seo/useSeo.js` keeps `<head>` in sync. The share image is `public/og-image.png` (1200×630).

The server maps `/new` → `new.html` and answers unknown paths with `404.html` and a **real 404 status**;
`/new/`, `/new.html` and `/index.html` redirect (301) to the single clean URL:

- nginx: [`deploy/nginx.conf`](../deploy/nginx.conf) (used on the demo server);
- Apache / shared hosting: `public/.htaccess` (copied into `dist/`).

Build settings (`.env.production`, see `.env.example`):

| Variable | Default | Purpose |
|---|---|---|
| `VITE_SITE_URL` | `https://ws-58.ws.semalt.dev` | public origin for canonical, Open Graph and the sitemap |
| `VITE_BASE` | `/` | base path when the site lives in a sub-folder |
| `VITE_API_BASE` | — | Cloudflare Worker URL for hosting without PHP |

Lighthouse on the demo: SEO 100, Accessibility 100, Best Practices 100, Performance 97–98.

## Quality checks

```bash
npm run lint    # ESLint 10 with React Hooks / React Compiler rules (eslint.config.js)
npm run test    # Vitest unit tests (src/**/*.test.{js,jsx})
npm run check   # lint + test + build
```

Tests cover the API layer (URL building, normalisation, safe links, errors, timeout,
cache), `useSites` (first load, single "Load more", stale-while-refreshing, the 10 000
limit, retry), formatting helpers and i18n (UTC calendar dates, Ukrainian plurals).
The self-review with all findings and fixes is in [REVIEW.md](REVIEW.md).

## Project structure

```
public/
  api/freeserp.php         same-origin PHP proxy to FreeSerp (copied into dist/)
  api/favicon.php          favicon proxy: 204 instead of 404 for sites without an icon (no console noise)
  favicon.svg, og-image.png  site icon and the 1200×630 share image
  .htaccess                Apache: clean URLs, real 404, cache headers
deploy/
  nginx.conf               nginx site config used on the demo server
  cloudflare-worker.js     alternative proxy for hosting without PHP
src/
  services/freeserp.js     API layer: URL building, fetch with timeout, errors, bounded cache, safe normalisation
  i18n/
    index.jsx              I18nProvider, useI18n(): t(), plural forms, Intl number/date/relative formatting
    en.js, uk.js           English and Ukrainian dictionaries (+ category translations)
    NoBreak.jsx            keeps hyphenated compounds on one line in headlines
  hooks/
    useSites.js            paginated list: loading / refreshing / error / retry / guarded load more / abort
    useKeepInView.js       brings the filters back into view when they change deep in a list
    useExploreParams.js    Explore state ⇄ URL query string
    useIndexStats.js       real niche totals for the hero and About page
    useDebounce.js
  utils/
    constants.js           category filters, sort options, labels
    format.js              display name, dates, relative time, builder label
  components/              Header, Footer, Logo, Hero, SearchBar, FilterChips,
                           Toggle, Select, LangSwitch, SiteResults, SiteCard, NewSiteRow, SiteModal, Favicon,
                           DrMeter, CategoryTags, StateViews (skeleton / error / empty / load more)
  pages/                   ExplorePage, NewPage, AboutPage, NotFoundPage
  motion/
    index.js               revealUp(): the single slide-up motion, font-ready gate, reduced-motion check
    hooks.js               useRevealUp, useListReveal, useScrollReveal
  seo/
    config.js              per-route titles/descriptions (EN + UK), JSON-LD, site URL
    head.js                builds the SEO <head> tags (used by the build)
    useSeo.js              keeps <head> in sync on navigation and language switch
  styles/global.css        design tokens, base styles, buttons
.env.example               VITE_SITE_URL, VITE_BASE, VITE_API_BASE
vite.config.js             base, dev/preview proxies, SEO build plugin (HTML per route, sitemap, robots)
```

## Getting started

Requirements: **Node.js 20.19+ or 22.12+** (needed by Vite 8). Node is only needed to build the
site, not on the web server.

```bash
npm install
npm run dev          # development server with hot reload
```

## Production build

```bash
npm run build        # creates dist/
npm run preview      # serves dist/ locally; FreeSerp requests go through the Vite proxy
```

`npm run preview` prints the local address in the terminal. Open it and check the pages.

## Deployment

### Ordinary hosting with PHP (FTP)

1. `npm run build`
2. Upload **the contents of `dist/`** (not the folder itself) to the site root (`public_html/`,
   `www/`, `htdocs/`…) or to any sub-folder:
   ```
   index.html, new.html, about.html, 404.html   ← one HTML per route (SEO tags)
   sitemap.xml, robots.txt, og-image.png, favicon.svg
   .htaccess            ← clean URLs + real 404 on Apache (nginx: deploy/nginx.conf)
   assets/              ← all JS, CSS and font files
   api/freeserp.php     ← the proxy (needs PHP 7.4+ with cURL or allow_url_fopen)
   api/favicon.php      ← favicon proxy (same requirements, caches icons in the temp dir)
   ```
3. Open the site. To check the proxy directly, open
   `https://your-domain/api/freeserp.php?size=1`. It should return JSON with `"ok":true`.

No Node.js is required on the server. On Apache the bundled `.htaccess` handles the clean URLs;
on nginx use `deploy/nginx.conf`.

### Hosting without PHP

1. Deploy `deploy/cloudflare-worker.js` as a Cloudflare Worker (free plan is enough).
2. Build with the worker URL: create `.env.production` with
   `VITE_API_BASE=https://<your-worker>.workers.dev`, then run `npm run build`.
3. Upload `dist/`. You can delete `dist/api/freeserp.php` in this case.

> Opening `dist/index.html` straight from disk (`file://`) won't load data. The site needs to be
> served over HTTP together with its proxy.
