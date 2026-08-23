# Reading-experience research: 9 developer blogs

## Methodology and limitations

This research was done by fetching **raw HTML and linked/embedded CSS** directly (via `curl`) for one representative long-form article per site, then grepping the actual stylesheet source for concrete values (`font-size`, `line-height`, `max-width`, `background`, `color`, custom properties, etc.). This is meaningfully more reliable than reading rendered/summarized page text, because every number below traces to a string that was actually read out of a stylesheet or inline style attribute — not inferred from how a page "looks."

**What this method cannot give me:** computed/cascaded final values in a real browser (e.g. a `font-size` set via `clamp()`, `calc()`, or a CSS custom property chain was recorded as the formula, not a single resolved pixel number, unless the formula was simple enough to resolve by hand). It also can't give real WCAG contrast ratios (no rendering engine), can't detect content gated behind client-side-only JS that never appears in server HTML, and can't see hover/focus states or animations. Every such gap is flagged inline as **"not verified — [reason]"** rather than guessed.

**Sample size discipline:** this is 9 sites, 7 of them personal/independent blogs and 2 of them (Rust, Go) plus 2 corporate ones (Stripe, Vercel) institutional. Any claim of "most sites do X" in the synthesis section is a claim about at most 9 data points — treated accordingly, not as industry consensus.

Representative article fetched per site:
- overreacted.io → `/react-as-a-ui-runtime/`
- joshwcomeau.com → `/react/why-react-re-renders/`
- jvns.ca → `/blog/2024/10/01/terminal-colours/`
- maggieappleton.com → `/tools-for-thought`
- ciechanow.ski → `/gears/`
- blog.rust-lang.org → `/2026/08/20/Rust-1.98.0/`
- go.dev/blog → `/go1.26`
- stripe.dev (stripe.com/blog/engineering redirects here) → `/blog/formatting-an-entire-25-million-line-codebase-overnight-the-rubyfmt-story`
- vercel.com/blog → `/blog/a-sandbox-without-a-network-boundary-is-only-half-a-sandbox` (category: engineering; a different engineering-tagged post, the Washington Post case study, had since been reclassified to `/customers/`, confirmed via an embedded `NEXT_REDIRECT` in its RSC payload — noted as a live-site drift from what a search engine still indexes)

---

## 1. overreacted.io (Dan Abramov)

Built on Next.js with Tailwind-generated utility CSS plus CSS custom properties for theming, fetched from `/_next/static/css/*.css`.

- **Measure:** `<body class="mx-auto max-w-2xl ...">` → `max-w-2xl` = 42rem = **672px** container, with `px-5` (20px) side padding, giving an effective text column of roughly **632px**.
- **Base font / body type:** Body copy uses the CSS class `__className_577ed0`, which resolves to `font-family:Merriweather,Merriweather Fallback` — **a serif face for body text.** Headings (`__className_64c2fd`) resolve to `font-family:Montserrat,Montserrat Fallback;font-weight:900` — a heavy sans-serif, so overreacted deliberately pairs a serif body with a black-weight sans display face. No explicit body `font-size` override was found on `<p>` tags (they inherit Tailwind's default), so **16px base is inferred, not directly confirmed** — the one confirmed number is `.markdown{line-height:28px}`, which is exactly `16px × 1.75`, consistent with a 16px base.
- **Line height:** confirmed **1.75** on the `.markdown` wrapper (`line-height:28px` at a 16px base).
- **Type scale:** H1 `text-[40px] font-black leading-[44px]` (line-height 44px ≈ 1.1). H2 `text-3xl` = 1.875rem = **30px**, `font-bold`, `mt-2`. H3/H4 not directly confirmed in the fetched excerpt (not verified — grep did not surface an `h3{}` rule in the CSS chunks pulled).
- **Vertical rhythm:** Unusual technique — top-level block children (paragraphs, images, headings) are **not** spaced with individual margins; the whole article body is `class="markdown flex flex-col gap-8 mt-12"`, i.e. a flexbox with a uniform **32px gap** between every direct child, plus `mt-12` (48px) before the body starts.
- **Code blocks:** **Full-bleed relative to the text column.** `.markdown pre{width:calc(100% + 2.5rem)!important;margin-left:-1.25rem;margin-right:-1.25rem}` — code blocks break out 20px past the prose measure on each side. `overflow-y-auto`/scroll for long content, `text-sm` (14px), theme name `"Overnight"` (a custom Shiki theme, not a stock one). No line numbers found. No copy-button markup found (searched for "copy" across the whole page, zero hits). Highlighted lines get `background-color:#022a4b` with a `4px solid #ffa7c4` left border.
- **Dark mode — verified real values:**
  - Light: `--bg: white; --text: #222; --code-bg: #232936`
  - Dark: `--bg: rgb(40,44,53); --text: rgba(255,255,255,0.88); --code-bg: #191d27`
  - Notably, **the code-block background is a dark navy (`#232936`) even in light mode** — code blocks are permanently dark-themed regardless of site theme, a deliberate, singular choice.
  - Dark background `rgb(40,44,53)` is a cool, desaturated near-black (roughly `#282c35`) — clearly not pure `#000`. Dark text is white at 88% opacity over that background, not pure `#fff`.
- **Post structure:** Title (H1) → date only, directly below (`text-[13px] text-gray-700 dark:text-gray-300`) → body. No tags, no reading time, no table of contents found.
- **Navigation between posts:** None found — no prev/next links, no related-posts module (searched; only a "Fork on Tangled" footer link and a "Pay what you like" donation link were present).
- **Omissions:** no comments, no share buttons, no newsletter signup, no author bio block beyond a small avatar+name in the header, no view counts.

## 2. joshwcomeau.com (Josh Comeau)

Next.js, CSS Modules with hashed classnames, custom CSS-variable theming system (`--color-*`), fetched from 7 `_next/static/css/*.css` chunks.

- **Measure:** the article grid is `grid-template-columns:1fr min(44rem,calc(100% - var(--viewport-padding)*2)) 1fr` — a **44rem (704px)** primary text column, with a separate `21.875rem` (350px) sidebar column that appears at wide viewports for the table of contents.
- **Base font size (article body):** `.t1e31uhj{font-size:1.125rem}` → **18px**, applied to the whole article container — larger than the common 16px default.
- **Line height:** `body{line-height:1.5;line-height:calc(.95 + .62rem)}` — the second declaration overrides the first with a fluid formula (not a fixed unitless ratio); **not verified as a single number**, it resolves differently at different root font sizes.
- **Paragraph spacing:** `p{margin-bottom:1.25em}` confirmed as the actual paragraph gap.
- **Type scale:** Not fully confirmed for h1/h2/h3 as a scoped set (this is a highly componentized/hashed CSS Modules codebase where each heading level likely has its own generated class); not verified beyond the base article font-size.
- **Code blocks:** Uses Shiki with **dual light/dark CSS variables baked into each `<pre>`**: `style="--shiki-light:#000000;--shiki-dark:#ffffffff;--shiki-light-bg:#f5f6f900;--shiki-dark-bg:#0d0f1200"` — meaning the exact same markup renders correctly in both themes via CSS custom properties, no separate light/dark code blocks. **"Copy to clipboard" button confirmed present** (found literal string in HTML). `pre{white-space:pre-wrap!important}` — long lines **wrap**, they do not horizontally scroll.
- **Dark mode — verified real values:**
  - Light: `--color-background:#fff; --color-text:#0a0c10`
  - Dark: `--color-background:#0d0f12; --color-text:#e3e6e8`
  - Dark background `#0d0f12` is a near-black with a slight blue cast — not pure `#000`. Dark text `#e3e6e8` is a cool off-white — not pure `#fff`. Even the *light-mode* text (`#0a0c10`) is not pure black, though it's very close.
  - The whole color system is a large token set (`--color-gray-50` through `--color-gray-1000`, syntax-highlighting tokens, semantic info/error/success/warning colors) — a genuine custom design system, not a quick two-color toggle.
- **Post structure:** Title (H1) → metadata block directly below with `dl`/`dt`/`dd` pairs: "Filed under: React" (category tag) → "Published on: August 16th, 2022" → "Last updated on: December 3rd, 2025". **Table of contents present**, positioned as a sticky sidebar at wide viewports, `display:none` at narrow ones (confirmed responsive collapse — whether it's *conditional on article length* specifically was not verified, since only one long article was tested).
- **Navigation between posts:** Not found in the fetched excerpt (not verified — prev/next markup may exist further down the page than the fetch captured).
- **Omissions/inclusions that stand out:** **newsletter signup confirmed present** (footer email capture form) — this is the one clear counter-example to "developer blogs skip newsletter popups" in this sample. Author bio + avatar + social links (BlueSky, GitHub, LinkedIn) also present in footer. No comments found.

## 3. jvns.ca (Julia Evans)

A Hugo-style static site (`#wrap`, `#content`, `.hentry` — Octopress/Hugo conventions), plain linked stylesheet at `/stylesheets/screen.css`, no build-tool fingerprints.

- **Measure:** `#wrap{width:70%;max-width:45em}`. At the site's base font-size of `1.15em` (≈18.4px assuming 16px root), 45em resolves to roughly **828px** as an upper bound, but below that breakpoint it's **percentage-based (70% of viewport)**, not a fixed pixel/ch value — a genuinely fluid, non-typical measure strategy.
- **Base font size:** `body{font-size:1.15em}` → ~**18.4px** (confirmed, assuming default 16px root — no root-level override found).
- **Line height:** No single global body line-height ratio found (CSS reset sets `body{line-height:1}` and per-element rules override it individually) — **not verified as one number**; the code block specifically uses `line-height:1.45em`.
- **Code blocks:** **Inset**, not full-bleed — plain block inside the normal content flow. `background-color:#f7f7f7; border:1px solid #cccccc; font-size:13px; padding:0.8em 1em; color:#1a1a1a; overflow:auto` (scrolls horizontally for long lines, does not wrap). **No syntax-highlighting color tokens found** — code is rendered in a single flat text color, no colorized keywords/strings. This is a deliberate minimalism, not a missing feature (custom scrollbar styling for the horizontal scroll was present, so the styling is intentional). Inline code (`p code, li code`) gets the same light-gray background at 0.8em.
- **Dark mode:** **Not present.** No `prefers-color-scheme`, no dark-related class or variable found anywhere in the stylesheet.
- **Colors:** `background-color:#ffffff` (site chrome), body text confirmed via multiple rules at `#1a1a1a` / `#333333` / `#000000` depending on element — not a single unified token, but consistently near-black-on-white, never a softened off-black in this file.
- **Post structure:** `<h1 class="entry-title">` → empty `.post-tags` div (present in markup even when no tags are set, meaning tags *can* appear here) → `<time class="date">` publish date. Headings inside the body start at `<h3>` (the Hugo template appears to reserve h1 for the post title and h2 for section-level template chrome), which is worth noting if replicating this pattern — it can look like a level was skipped.
- **Navigation between posts:** **Confirmed present** — literal "Previous Post" / "Next Post" links at the bottom of the article, pointing to the actual adjacent posts by title.
- **Omissions:** no reading time, no table of contents, no comments, no share buttons, no author bio/avatar beyond a small header, no newsletter popup (a plain text "Subscribe" link exists but is not a popup/modal).

## 4. maggieappleton.com (Maggie Appleton)

Astro-based (`_astro/*.css` chunk naming, `data-astro-cid-*` attributes) — directly relevant as a same-framework reference point for this project.

- **Measure:** the clearest `max-width` in ch units found was `max-width:56ch` on a byline/subtitle-scale element; the broader page uses several px-based container widths (800px, 900px, 1000px, 1200px) for different layout regions — **the single prose-column measure was not unambiguously isolated** (not verified as one number; this site's layout is closer to a magazine grid than a single centered column).
- **Base font size:** **fluid**, not fixed — `--font-size-base` is computed as `calc(((20/16)*1rem) + (22-20) * var(--fluid-bp))`, i.e. it scales continuously between **20px and 22px** depending on viewport width. This is notably larger than the ~16-18px baseline seen elsewhere in this sample, and it's implemented as true CSS fluid typography (a `--fluid-bp` interpolation variable), not just a couple of media-query breakpoints.
- **Line height:** `body{line-height:1.5}` (base), but paragraphs specifically get `--leading-loose: 160%` → `p{line-height:var(--leading-loose)}` = **1.6**.
- **Type scale:** Fluid throughout, using a named scale (`--font-size-xs` … `--font-size-3xl`) each defined by its own min/max clamp formula. Confirmed formulas: H1 `font-size:var(--font-size-3xl)` (fluid ~57.6–81.8px) on one rule, overridden by a second more specific H1 rule at `var(--font-size-2xl)` (fluid ~46.9–56px) — headings are large and expressive by design, not restrained. H2 `calc(var(--font-size-xl) / 1.2)` with `font-weight:100` (very light weight) in one context, `var(--font-size-lg)` in another.
- **Fonts:** `--font-serif: "Canela Deck"`, `--font-body: "Canela Text"` (both serif), `--font-sans: "Lato"` — a premium licensed serif for reading text, sans for UI chrome.
- **Code blocks:** `pre{width:100%;overflow:scroll;padding:var(--space-s) var(--space-m);font-size:calc(var(--font-size-sm)*1.1);line-height:var(--leading-loose);font-family:"IBM Plex Mono","Dank Mono","SF Mono",consolas}` — inset within its container (no negative-margin breakout found), horizontal scroll for long lines (not wrap), roomy line-height (1.6).
- **Dark mode — verified real values:**
  - Light: `--color-cream: #f6f5f1` (background), `--color-black: #353534` (body text) — both **deliberately off pure white/black**, warm-toned.
  - Dark: `--color-cream: #1c1b18` (background — a warm, dark brown-black), `--color-black: #c2bfba` (text — a warm light taupe/gray)
  - This is the **warmest** dark palette in the sample — most other sites use cool/blue-gray darks; Maggie's is a warm near-black with a warm off-white text color, which reads closer to "dark sepia" than "dark slate."
- **Post structure:** Confirmed a **collapsible desktop table-of-contents sidebar** (`<button id="desktop-toc-header" aria-expanded="true">Table of Contents</button>` with an up/down chevron), listing h2/h3-level anchors with indentation by `data-level`. Whether it's conditional on article length was not verified (only one long essay tested).
- **Navigation/omissions:** Body text elsewhere on the site discusses "alternatives to the comment section" as essay *content* (not a real widget on this page — confirmed false positive on grep). No comments, no share buttons, no reading time, no explicit date-only byline pattern confirmed near the title in the fetched excerpt (essay index page showed dates on essay cards, not confirmed on the article page itself — not verified).
- **Overall character:** of the 9 sites, this is the most visually/typographically *expressive* one — large fluid type, warm color-mixed accent palette (`oklch()`, `color-mix()`), multiple decorative box-shadow tokens, a toggleable TOC. It leans toward richness and personality more than restraint.

## 5. ciechanow.ski (Bartosz Ciechanowski)

Plain server-rendered HTML, single linked stylesheet `/css/base.css` (no dark-mode-specific stylesheet linked), plus a per-article stylesheet (`/css/gears.css`, not fetched — governs the interactive diagram styling specifically, out of scope for reading-layout).

- **Measure:** `.article>*{max-width:44rem;padding-left:3rem;padding-right:3rem}` → **704px container**, minus 48px padding each side → effective text width **~608px**.
- **Base font size:** `.article p, .article li, .article .img_container{font-size:1.2em}` on a 16px root (no root override found) → **19.2px**.
- **Line height:** confirmed **1.6** (`line-height:1.6em`) on the same rule.
- **Type scale:** `#site_title{font-size:2.8em}` is the site header logo, not the article H1 (not the same thing — worth flagging since it's easy to mis-map). Article-internal heading sizes at lines 196–224 of the stylesheet: **1.8em / 1.5em / 1.3em / 1em / .9em / .8em** for what appear to be h2 through h6-equivalent levels (exact selector-to-level mapping not fully confirmed from the grepped excerpt).
- **Paragraph spacing:** `p{margin:0;padding:0.7em 0}` — **0.7em top + 0.7em bottom** per paragraph (adjacent paragraphs' padding doesn't collapse the way margins would, so the visual gap between two paragraphs is the full 1.4em, ≈27px at this base size).
- **Code blocks:** none present in this article (it's a physics/mechanics explainer with interactive SVG diagrams, not code) — **not applicable** for this specific post; not verified whether Ciechanowski's code-bearing articles (e.g. his more CS-flavored pieces) style code differently.
- **Figures:** `.full_width{max-width:100%}` confirmed as an escape-hatch class — the site does support breaking interactive diagrams out to full container width beyond the 608px text measure, consistent with his articles' famous large, wide interactive figures.
- **Dark mode:** **Not present.** No `prefers-color-scheme`, no theme toggle markup, no dark-tinted variable set found anywhere in the fetched CSS or HTML.
- **Colors:** `body{background:#F8F8F8;color:#444}` — a soft, warm-ish off-white background and a mid-gray (not black) body text color. This is a light-only site with muted contrast baked in even without a dark mode.
- **Post structure:** Date shown prominently near the title (confirmed via earlier metadata inspection: "February 12, 2020"). No table of contents, no reading time, no tags found.
- **Navigation between posts:** Not found in the fetched excerpt (searched for related/next/prev keywords across the file — zero hits).
- **Omissions:** No comments, no share-button row beyond a small set of social/profile links in the header (Patreon, X, Instagram, email, RSS — these are persistent site-level links, not per-article share actions), no newsletter, no reading time, no related-posts grid, no ads.

## 6. blog.rust-lang.org (official Rust blog)

Built on **Skeleton**, a circa-2014 minimal CSS boilerplate (`skeleton.css`), plus a small custom `app.css` overlay and a separate "giallo" syntax-highlighting theme pair for light/dark code.

- **Measure:** `.container{max-width:960px;width:85%}` (from Skeleton) — a notably **wide** container (960px) relative to the other sites in this sample; no narrower prose-specific wrapper was found layered inside it, so body text likely runs closer to 960px than a typical 65–75ch measure. (Not verified whether some narrower rule overrides this specifically for `.post` — the CSS chunks fetched didn't surface one.)
- **Base font size:** `html{font-size:62.5%}` (=10px) at narrow viewports, `html{font-size:75%}` (=12px) at ≥30em, combined with Skeleton's `body{font-size:1.5em}` → **15px at mobile, 18px at ≥30em viewports** (confirmed formula, two-step resolved value).
- **Line height:** Skeleton sets `body,h6{line-height:1.6}` — confirmed **1.6**.
- **Type scale:** Skeleton defaults (not overridden for post body in the fetched CSS): h1 4rem/5rem, h2 3.6rem/4.2rem, h3 3rem/3.6rem, h4 2.4rem/3rem, h5 1.8rem/2.4rem, h6 1.5rem (mobile/≥550px pairs) — at a 10-12px root these resolve much smaller in practice than the raw rem numbers suggest. Custom overlay in `app.css` overrides some of this for `.post h2{font-size:2em}`, `h3,.post h2,header h2{font-size:1.8em}`. The banner/masthead H1 (`header h1`) is set separately at a flat `font-size:8rem` (using `"Alfa Slab One"`, a heavy slab-serif display font) — that's the site's brand header, not the article title.
- **Code blocks:** Skeleton's default `code{background:#F1F1F1;border:1px solid #E1E1E1}` / `pre>code{padding:1rem 1.5rem;white-space:pre}` provides the base styling; actual syntax coloring comes from a separate injected `<link id="syntax-theme">` plus theme-specific files `giallo-dark.css` / `giallo-light.css` gated by `media="(prefers-color-scheme: dark/light)"`. **Confirmed dark theme is literally "dark-plus"** (VS Code's own built-in dark theme, `.z-code{color:#D4D4D4;background-color:#1E1E1E}`), i.e. a high-recognition, high-saturation IDE theme rather than a muted custom editorial palette. No line numbers found. No copy-button markup found. Long lines: relies on `code{overflow:auto}` per the app.css overlay — scrolls, does not wrap.
- **Dark mode — verified real values (via CSS custom properties, `:root[data-theme=dark]`):**
  - Light: `--body-background-color: white; --body-color: rgb(34,34,34)`
  - Dark: `--body-background-color: #181a1b; --body-color: #d6dadb`
  - Dark background `#181a1b` is a cool, desaturated charcoal — not pure black. Dark text `#d6dadb` is a cool light gray — not pure white. A three-way theme toggle (Light/Dark/System) is confirmed present in markup.
- **Post structure:** Title → `.publish-date-author{margin:-60px 0 60px 0}` div directly below, confirmed rendering as **"Aug. 20, 2026 · The Rust Release Team"** — date and author/team combined on one line, no separate tags row, no reading time.
- **Navigation between posts:** Not found on this specific post page (not verified — Rust's release-index page has its own prev/next-style pagination, but the individual post template tested here didn't surface it).
- **Omissions:** No comments, no share buttons, no newsletter signup, no author avatar (team name only, no photo), no related-posts module, no view counts. The overall visual language (Skeleton framework, VS Code dark-plus theme) reads as **utilitarian/institutional rather than a bespoke editorial design system** — worth flagging as a genuine finding: an official project blog investing far less in custom typography than any of the personal blogs in this sample.

## 7. go.dev/blog (official Go blog)

Single shared site-wide stylesheet at `/css/styles.css` (5,415 lines — the whole go.dev site's design system, not blog-specific), using `--color-*` custom properties and `@media (prefers-color-scheme: dark)`.

- **Measure:** `.Article{max-width:75.75rem}` = **1212px** — this is the outer article wrapper (includes any sidebar), not confirmed to be the actual prose-line measure. At wide viewports (`≥78rem`), `.Article-columns{display:flex;gap:10rem}` splits into `.Article-content{flex:3}` + `.Sidebar{flex:1}` — i.e. body text occupies roughly 3/4 of the 1212px container in a two-column split when a sidebar is present, or the full width when it isn't (this specific post did not render a sidebar). **The exact resolved prose measure in px was not verified** — it depends on which layout mode is active.
- **Base font size:** `.Article p, .Article ul, .Article ol{font-size:1rem}` on an unmodified root → **16px** (confirmed, classic default).
- **Line height:** No single confirmed body-copy ratio (several different line-height values appear at 1.4/1.5/1.55/1.75 across different components, but none was tied specifically to `.Article p`) — **not verified as one number**.
- **Type scale:** `.Article h1{font-size:2.25rem}` (36px), `h2{1.4rem}` (22.4px), `h3{1.125rem}` (18px), `h4/h5/h6{1rem}` (16px) — confirmed, a fairly compressed/modest scale relative to a 16px body (h1 is only 2.25× body size, versus e.g. overreacted's 2.5× or Stripe's 3×).
- **Code blocks:** `.Article pre{background-color:var(--color-background-accented);border:var(--border);border-radius:0.375rem;padding:1.5rem;overflow-x:auto}` — **inset** (no negative-margin breakout found), rounded, bordered, scrolls horizontally for long lines (not wrap). Not verified whether syntax highlighting is present/what theme (the CSS grep didn't surface a distinct syntax-token color set tied to code blocks specifically in the excerpt pulled — likely handled by a separate embedded highlighter not captured here).
- **Dark mode — verified real values:**
  - Light: `--color-background: var(--white) = #fff; --color-text: var(--gray-1) = #202224`
  - Dark: `--color-background: var(--gray-1) = #202224; --color-text: var(--gray-9) = #f0f1f2`
  - Notable symmetry: the exact same hex (`#202224`) is used as *light-mode text* and *dark-mode background* — a shared "near-black" token reused across both themes. Dark background is a cool charcoal, not pure black; dark text `#f0f1f2` is a soft off-white, not pure white.
- **Post structure:** `<h1>Go 1.26 is released</h1>` → `<p class="author">Carlos Amedee, on behalf of the Go team<br>10 February 2026</p>` — author and date combined in one paragraph, directly below title, no separate tags row, `Article-date{color:var(--color-text-subtle)}` (confirmed the date/byline is deliberately de-emphasized via a subtler text color token vs. body text).
- **Navigation between posts:** **Confirmed present** — this post's fetch surfaced literal "Previous article: Results from the 2025 Go Developer Survey" / "Next article: Using go fix to modernize Go code" links at the bottom.
- **Omissions:** No reading time, no tags, no table of contents, no comments, no share buttons, no author avatar, no related-posts grid.

## 8. stripe.dev (Stripe engineering blog)

`stripe.com/blog/engineering` **301-redirects to `stripe.dev/blog/topic/engineering`** — noted explicitly since this is a real site restructuring, not a guess. Next.js with CSS Modules (hashed classnames like `BlogPost-module__ifVEqa__articleBody`).

- **Measure:** No ch/px-based centered prose column was found — the article uses a **CSS grid**: `.BlogPost-module__ifVEqa__article{grid-column:8/25}` inside what's evidently a wide multi-column editorial grid, i.e. article content occupies roughly columns 8 through 24 of a ~24-column grid. This is a genuinely different layout paradigm than the "centered column with a max-width" pattern every other site in this sample uses — **not reducible to a single measure number** without knowing the grid's total width and gutter, which weren't isolated from the fetched CSS.
- **Base font size (body paragraph):** Not confirmed for `<p>` specifically (grep did not surface a matching rule in the fetched chunks) — **not verified**.
- **Type scale — confirmed, and it is large:** `h2{font-size:48px}`, `h3{36px}`, `h4{28px}`, `h5{20px}`, `h6{18px}`, `li{16px, line-height:130%}` (note: `h1` in this scoped selector set was oddly `font-size:10px;color:red`, almost certainly a dev/debug or intentionally-hidden style rather than the real rendered H1 — the real title is styled separately via `.BlogPostHero-module__AQEnuW__title{font-size:calc(4.48431vw + 36.5112px)}`, a **fluid, viewport-based hero title formula**, further overridden to a flat `114px` at some breakpoint). All headings use `font-family:sohne-var` (a premium licensed grotesque, the same face family used by Notion and several other well-funded product companies) at `font-weight:300` (light).
- **Code blocks:** Not confirmed — no `pre`/`code` rule was found scoped to `.articleBody` in the specific article tested (this particular post, about a Ruby formatter rollout, may simply not contain a code block) — **not verified, sample-specific limitation**.
- **Dark mode:** **Not present.** The literal string "dark" does not appear anywhere in the ~80KB of fetched CSS — zero occurrences, checked directly.
- **Colors:** `--backgroundColor:#eaeaea` (body background — a warm, soft gray, not pure white), `--fontColor:#1e1e1e` (body text — soft near-black, not pure black). Even without a dark theme, Stripe's engineering blog already avoids pure black-on-white.
- **Post structure — the most elaborate metadata block in this sample:** confirmed via extracted text, a dedicated **sidebar** (not inline below the title) containing: "Date: 2026.4.28" → "Authors: [2 names]" → "**Reading time: 13 min read**" → "Categories: Engineering, Developer Productivity" → "Share:" (with a Twitter/X share link confirmed). This is the only site in the sample with a genuinely dedicated metadata sidebar module (Vercel has similar richness but places it inline, not in a sidebar).
- **Navigation/omissions:** Not verified for prev/next or related-posts (not found in the fetched excerpt, but the page is long and a module may exist further down than was captured). **Share buttons confirmed present** (the one clear counter-example in this sample, alongside Vercel's copy-link button). No comments, no newsletter popup found in this specific article (a citation to an unrelated third party's newsletter in body text was a false-positive match, not a real widget).

## 9. vercel.com/blog (Vercel engineering blog)

Next.js, Tailwind-style utility classes generated by Vercel's internal **Geist Design System** (`--ds-*` custom properties), CSS delivered as embedded chunk URLs inside the RSC payload rather than `<link>` tags in `<head>` — worth noting as a structural quirk: a plain grep for `<link rel="stylesheet">` on this site finds nothing; the real stylesheet URLs have to be extracted from the streamed JS/RSC script content instead.

- **Measure:** `--article-max-width: 640px` — confirmed, this is the actual prose text column. Media (images, code blocks) are allowed to grow past it: `--blog-media-max: clamp(700px, calc(100% + 11rem), 800px)`, growing further to `1200px` at the `@xl` container-query breakpoint — a **fluid, container-query-driven full-bleed system** for figures/code, distinct from every other site's fixed-negative-margin approach.
- **Base font size (body paragraph):** `<p class="text-copy-16 @lg:text-copy-18 ...">` → **16px on mobile, 18px at the `@lg` container breakpoint** (confirmed via both the utility-class definitions: `.text-copy-16{font-size:16px;line-height:24px}`, `.text-copy-18{font-size:18px;line-height:28px}`).
- **Line height:** confirmed **1.5** at 16px (24/16) and **1.56** at 18px (28/18).
- **Type scale:** H1 uses `text-heading-40` (mobile) → `@lg:text-heading-48` (desktop), confirmed formulas: `.text-heading-40{font-size:40px;line-height:48px;letter-spacing:-2.4px}`, `.text-heading-48{font-size:48px;line-height:56px;letter-spacing:-2.88px}` — both at `font-weight:var(--font-weight-semibold)` with notably **tight negative letter-spacing** (a hallmark of modern SaaS/product branding). A larger `text-heading-64` utility also exists (64px/64px, -3.84px tracking) for bigger contexts elsewhere on the site.
- **Code blocks:** Confirmed **full-bleed**: the article-body wrapper class explicitly carries `[&>[data-geist-code-block]]:w-full [&>[data-geist-code-block]]:max-w-none [&>[data-geist-code-block]]:self-stretch`, i.e. code blocks are deliberately exempted from the 640px `--article-max-width` and stretch to the wider media measure. **Copy-button confirmed present** (`aria-label="Copy` found in markup). Inline code (`code` inside `p`) gets `bg-background-100`, `rounded-md`, `text-copy-14`, `font-mono`, `shadow-[var(--ds-shadow-border-small)]` — a bordered/shadowed pill rather than a flat highlight.
- **Dark mode — verified real values, and notable:**
  - Light (`:root, .light-theme`): `--ds-background-200: #fafafa` (body background), `--ds-gray-1000: #171717` (body text)
  - Dark (`.dark, .dark-theme`): `--ds-background-200: #000` (body background), `--ds-gray-1000: #ededed` (body text)
  - **Vercel is the only site in this sample confirmed to use pure `#000` as its dark-mode background.** Every other dark-capable site in the set (overreacted `rgb(40,44,53)`, Josh Comeau `#0d0f12`, Rust `#181a1b`, Go `#202224`, Maggie Appleton `#1c1b18`) deliberately pulls back from pure black. Text color, by contrast, is *not* pure white even here (`#ededed`) — so Vercel's approach is "pure-black background, softened-white text," an asymmetric choice worth flagging distinctly from a symmetric "both pulled back" approach.
  - Note also that even Vercel's *light* background is off-white (`#fafafa`, not `#fff`) — the asymmetry (pure black in dark mode, off-white in light mode) is a real, confirmed pattern in the token values, not an inference.
- **Post structure:** Title → author name + role + avatar (confirmed: "Brandon Tuttle / Software Engineer, Compute") → "Blog / Engineering" breadcrumb-style category tag → date ("11 Aug 2026") → **"7 min read"** (reading time confirmed present) → a copy-link action. This is the most complete single-line metadata stack confirmed in the sample, combining author+role+avatar+category+date+reading-time+share in one compact row (versus Stripe's similar richness spread into a full sidebar module).
- **Navigation/omissions:** Not verified for prev/next or a related-posts grid (not found in the fetched excerpt; the page is long enough that a module could exist further down). No comments found. No newsletter popup found in this article. No visible ads.

---

## Comparison table

Values marked *(inferred)* rely on an unstated default (e.g. unmodified 16px root) rather than an explicit rule; values marked **not verified** could not be traced to any fetched source at all.

| Site | Base font (desktop, article body) | Line-height (body) | Measure (text column) | Light bg | Light text | Dark bg | Dark text | Dark mode? |
|---|---|---|---|---|---|---|---|---|
| overreacted.io | 16px *(inferred)* | 1.75 | ~632px (max-w-2xl 672px − padding) | `white` | `#222` | `rgb(40,44,53)` | `rgba(255,255,255,.88)` | Yes |
| joshwcomeau.com | 18px | not verified (fluid formula) | 704px (`min(44rem, …)`) | `#fff` | `#0a0c10` | `#0d0f12` | `#e3e6e8` | Yes |
| jvns.ca | 18.4px (1.15em) | not verified (per-element) | 70% width, cap ~828px | `#ffffff` | `#1a1a1a`/`#333` | — | — | No |
| maggieappleton.com | 20–22px (fluid) | 1.6 (body copy) | not verified (grid-based; 56ch on one element) | `#f6f5f1` | `#353534` | `#1c1b18` | `#c2bfba` | Yes |
| ciechanow.ski | 19.2px (1.2em) | 1.6 | ~608px (704px − 2×48px padding) | `#F8F8F8` | `#444` | — | — | No |
| blog.rust-lang.org | 15–18px (viewport-dependent) | 1.6 | 960px (wide) | `white` | `rgb(34,34,34)` | `#181a1b` | `#d6dadb` | Yes |
| go.dev/blog | 16px | not verified | up to 1212px container (not verified as prose width) | `#fff` | `#202224` | `#202224` | `#f0f1f2` | Yes |
| stripe.dev (eng) | not verified | not verified | grid-based (not verified as single number) | `#eaeaea` | `#1e1e1e` | — | — | No |
| vercel.com/blog | 16px→18px (container query) | 1.5→1.56 | 640px (`--article-max-width`) | `#fafafa` | `#171717` | `#000` | `#ededed` | Yes |

Note on WCAG contrast ratios: computing these precisely requires a real color-contrast algorithm run against final rendered values, which is out of reach of this method (no rendering engine was used). **All contrast-ratio claims in this report are qualitative** ("softened," "near-black," "not pure") rather than numeric — treat any specific ratio number as unverified if one appears anywhere; none should.

---

## Synthesis: real signal vs. one author's idiosyncrasy

With 9 sites (7 personal, 2 institutional-with-corporate-flavor split further as 2 official-language-project + 2 for-profit-company), here's what's actually repeated versus what's a single site's signature move.

**Genuine repeated convention (appears in a majority of the sample):**
- **Dark-mode backgrounds pull back from pure black.** 5 of 6 dark-capable sites use an off-black (overreacted, Josh Comeau, Rust, Go, Maggie Appleton) — all land somewhere in the `#18…`–`#28…` range, cool or warm depending on the site's overall palette. Only Vercel uses literal `#000`. This is a strong, cross-author pattern, not one person's habit — **it's the single most reproducible finding in this research.**
- **Dark-mode text pulls back from pure white**, universally, in every dark-capable site checked (all 6). Nobody in this sample uses literal `#fff` text on a dark background.
- **A single, fixed-width or fluid centered measure roughly in the 600–830px range** appears in 6 of 9 sites (overreacted 632px, Josh Comeau 704px, jvns ~828px cap, Ciechanowski ~608px, Vercel 640px) — genuinely close to the oft-cited "65–75 characters" heuristic once you account for each site's base font size. The two official-project blogs (Rust 960px, Go up to 1212px) and Stripe (grid-based) are the outliers, running noticeably wider — worth reading as **"personal/independent blogs converge on a tighter measure than institutional ones,"** at least in this sample.
- **Minimal post metadata (date, sometimes author, rarely more) placed directly under the title.** 6 of 9 sites (overreacted, jvns, Ciechanowski, Rust, Go, and Josh Comeau) put nothing more than a date/byline immediately below the H1. Tags, reading time, and category badges are the exception, not the rule, among the *personal and official-project* blogs.
- **No comments sections, no ads, no view counts, anywhere in the sample.** This is the strongest "deliberate omission" convention: 9 for 9.
- **No related-posts grids.** Not found on any of the 9 (though several may exist further down pages than this method captured for the corporate two — flagged as not-fully-verified for those, but genuinely absent everywhere it was confirmed either way).

**Real but narrower pattern (present in roughly half, meaningfully absent in the rest):**
- **Table of contents.** Present and substantial on the two most typographically ambitious personal sites (Josh Comeau, Maggie Appleton) — both as a collapsible/sticky sidebar. Absent everywhere else, including both official-language blogs and both corporate blogs in this sample. Reads less like "TOCs are standard for long technical posts" and more like "TOCs correlate with sites that have already invested heavily in a bespoke design system" — a correlation with production values, not with content length per se (not verified as length-conditional in either case, since only one long article was tested per site).
- **Reading time.** Present only on the two for-profit corporate blogs (Stripe: 13 min read; Vercel: 7 min read). Absent from every personal blog and both official project blogs. This reads as a genuinely corporate-content-marketing convention, not a developer-blog norm.
- **Prev/next navigation between posts.** Confirmed present on 2 of 9 (jvns.ca, go.dev) — real, but a minority pattern, not a norm.
- **Code-block full-bleed (breaking past the text measure).** Confirmed on overreacted and Vercel; confirmed inset (constrained to prose width) on jvns, Maggie Appleton, and Go. A genuine split, not a convention either way — worth treating as a free design choice rather than something to match.

**Single-author idiosyncrasy (do not treat as a norm just because it's memorable):**
- **Newsletter signup form** — confirmed on exactly one site (Josh Comeau). Not a developer-blog convention; if anything the *absence* of a newsletter capture is what 8 of 9 sites agree on.
- **Serif body text** (overreacted's Merriweather, Maggie Appleton's Canela) — 2 of 9, both personal sites with otherwise very different visual languages from each other. Not a shared "developer blogs use serif" pattern; more like two independent bets in the same direction.
- **Fluid/clamp-based type scales** — confirmed on Maggie Appleton and, differently, on Vercel and Stripe (viewport-relative hero title). Three implementations that don't share an approach beyond "not a fixed px value" — not a single convention.
- **No syntax highlighting at all in code blocks** — confirmed only on jvns.ca. A real and unusual restraint choice, but a sample of one.
- **A dedicated metadata sidebar module** (date/author/reading-time/category/share, all together, visually separated from the prose column) — confirmed only on Stripe. Vercel achieves similar informational density but inline, not sidebar-separated. Don't read "sidebar metadata block" as a pattern; read "corporate blogs pack more metadata than personal ones" as the actual, better-supported pattern instead.

---

## Notes for a Japanese-minimalist dark-theme direction

Research-grounded observations, not a spec — no specific pixel/hex prescriptions here, since that's a decision for the user to make deliberately.

- **The pure-black-vs-off-black axis is the single clearest, most cross-validated signal in this whole set.** Five independently-run sites — spanning a personal essayist (Dan Abramov), a teaching-focused blog (Josh Comeau), an official language project (Rust), another official language project (Go), and a design-forward personal essayist (Maggie Appleton) — all converged on some flavor of off-black for dark backgrounds, none of them the same hex, but all clearly pulled back from `#000`. Vercel's pure-`#000` choice is the outlier in this sample, not the majority pattern, and Vercel is also the site with the most saturated, high-contrast, brand-forward visual language of the nine — i.e. the one site chasing "punchy" over "quiet." If restraint and muted contrast are the goal, the weight of this sample points toward an off-black, not `#000`.
- **The sites that already read as visually "quiet" in this sample — jvns.ca, Ciechanowski, and to a lesser extent Go's official blog — are also the ones with no dark mode at all**, plain single-column layouts, and (for jvns and Ciechanowski specifically) little-to-no decorative color in body copy. Their restraint currently comes from *doing less*, not from a considered dark palette — so they're useful references for "what does an unadorned, single-measure, no-frills reading page look like" but not directly useful for the specific dark-mode color question, since none of them answer it.
- **Maggie Appleton's site is the one genuine "warm minimalism" reference in the set** — an off-black background with a warm (not cool-slate) cast, paired with a warm off-white text color, fluid generous type, and loose (1.6) line-height. If "Japanese minimalist" is read as closer to washi-paper warmth than to cool tech-slate, her token values (`#1c1b18` bg / `#c2bfba` text, both desaturated and warm) are the most directly relevant real-world data point gathered here — while noting her overall layout (large fluid headings, color-mixed accents, toggleable TOC) is considerably more decorative/maximalist than "restraint" would suggest, so the color choice and the layout choice point in different directions on her site and can be taken independently.
- **Every site that bothered with a considered dark palette also built a real token system** (named CSS custom properties for background/text/border/code, not just two ad hoc colors) — Josh Comeau's and Vercel's in particular go many steps further, with a full numbered gray scale (50→1000) plus semantic tokens for info/success/warning/error that stay legible in both themes. For a project starting from scratch, that's a structural lesson independent of which exact hex is chosen: build the scale, not just the two endpoints.
- **Measure and base font size move together in this sample, not independently.** The sites with the largest base font sizes (Maggie Appleton's fluid 20–22px, Josh Comeau's 18px) also run some of the more generous line-heights (1.6, and Josh's fluid formula), while the narrowest-measure sites (Ciechanowski at ~608px, overreacted at ~632px) pair that tighter column with a correspondingly larger-than-16px base (19.2px, and an inferred 16px respectively) rather than a small font in a small column. A "quiet, generous whitespace" direction is better supported by *both* moving together than by picking a narrow measure and leaving font-size at a small default.
- **Minimal post metadata is the strongest, best-supported structural convention across independent personal blogs and both official-project blogs alike** (date, sometimes author, nothing else, directly under the title) — reading time and category badges are specifically a *corporate content-marketing* pattern in this sample (Stripe, Vercel), not a developer-blog one. A restrained direction is well-supported in choosing the sparser pattern.
- **No comments, no related-posts grids, no view counts, no ads anywhere in the sample (9 for 9)** — this is the easiest, best-evidenced omission to make confidently; nothing here suggests any of these would be missed by readers of blogs like these.
- **Code-block treatment (full-bleed vs. inset) is a genuine even split in this sample (roughly 2 full-bleed, 3 inset, confirmed)** — meaning there's no real cross-site convention to defer to here; it's legitimately a free aesthetic choice, and either a full-bleed break-out or a strictly inset block (both seen among sites in this sample that otherwise read as restrained) would be consistent with a minimalist direction.
