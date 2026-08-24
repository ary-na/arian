# Hero & Typography Research: Spare Developer Portfolios

Research pass for rebuilding arii.dev's hero section and heading/type system (target: simpler, fluid `clamp()`-based scale). Read-only research — no code changed.

**Method.** Homepages fetched as raw HTML via `curl` (not a browser render), then linked CSS bundles (`_next/static/css/*`, `_astro/*`, static.linear.app modules) were downloaded and grepped directly for `font-size`, `clamp()`, `letter-spacing`, `line-height`, and font-weight. This gets real shipped values, but two limitations apply everywhere below:

- **Code-split CSS.** Sites like Linear (60+ hashed per-component CSS files) and Josh Comeau (Next.js route-split bundles) only had a subset of their CSS fetched. A value not found may simply live in an unfetched chunk — marked **unverified**, never assumed to be absent.
- **Tailwind noise.** Compiled Tailwind CSS ships the _entire_ utility scale (e.g. all nine `font-weight` steps) whether or not a page uses them. Where this matters, actual usage was cross-checked against the class names present in the HTML itself, not just the CSS bundle's contents.

Anything not directly confirmed is labeled **estimated** or **unverified** inline.

---

## 1. Hero inventory (per site)

### Rauno Freiberg — rauno.me

1. Name ("Rauno Freiberg", present as an `h1`, likely visually-hidden/SEO-only — not confirmed as the visible headline)
2. One intro sentence with two bolded inline links
3. In-page nav row (Devouring Details, Craft, History of Software Design, Projects, Field Notes)
4. Social/meta row (Twitter, 2023, 2022, GitHub) + Email (click-to-copy)
5. A giant kinetic-typography module: "Make it fast. / Make it beautiful. / Make it consistent. / Make it carefully. / Make it timeless. / Make it soulful. / Make it."

First line (verbatim): **"Rauno Freiberg is an Estonian interaction designer working with Vercel and Devouring Details"**

Largest text: CSS shows a `.index_frame` component with `h3{font-size:720px}` and sibling rules at `75px`/`85px` — an oversized, horizontally-tiled marquee (`left:1240px`, `left:2480px`, `left:3720px` repeats of the same block), i.e. type used _as_ the graphic. The 720px value's exact rendered role is **unverified** (could be a clipped/overflow glyph); the reliably-legible large text is the 75–85px tier. Bold inline links in the bio sentence are set to `font-size:24px;font-weight:500;line-height:28px` — call this the largest _conventional_ text. Base body size not resolved from fetched CSS (root not overridden → likely 16px, **estimated**). Ratio ≈ 24px/16px = **1.5x** for the bold links; the marquee text is a different category entirely (not proportioned against body text).

Photo/avatar/illustration: **none.** The visual role is filled entirely by oversized, animated typography — no image asset detected anywhere in the hero markup.

Links in hero/fold area: nav (5) + social/meta (4) + email = **~10**, though nav and hero are not visually separated in what was fetched.

Conspicuously absent: no photo, no CTA button, no "view my work" affordance — the entire hero is text and typographic motion.

---

### Paco Coursey — paco.me

1. Name ("Paco Coursey", `h1`)
2. Multi-sentence bio with 2 inline links (Linear, Vercel)
3. Second bio paragraph ("In the past I've developed the Vercel design system...")
4. Section list below the fold: Building / Craft / Projects / Writing / Now / Connect

First line (verbatim): **"Paco Coursey"**, immediately followed by _"Crafting interfaces. Building polished software and web experiences. Experimenting with magical details in user interfaces. Webmaster at Linear."_

Type scale (from CSS custom properties in the shipped bundle):

```
--text-xxs: 10px
--text-xs:  12px
--text-s:   14px
--text:     16px   (base)
--text-l:   20px
--text-xl:  24px
--text-2xl: 30px
```

Consecutive ratios: 1.20 / 1.17 / 1.14 / 1.25 / 1.20 / 1.25 — a hand-tuned scale hovering around 1.2, not a single mathematical ratio. Separately, `font-size:64px` (≈4rem) with `line-height:84px` and `letter-spacing:-.05em` was found in the bundle — plausibly the large name/heading treatment, but the exact selector-to-element mapping is **unverified**. If so: 64px vs 16px body = **4x**.

`html{font-size:16px}` confirmed explicitly. No `clamp()` found in any of the 3 fetched CSS chunks — **fixed px scale**, not fluid.

Photo/avatar/illustration: **none** found in hero markup.

Links in hero: 2 (Linear, Vercel), inline in the bio prose.

---

### Emil Kowalski — emilkowal.ski

1. Name ("Emil Kowalski")
2. Role label ("Design Engineer")
3. "Today" bio paragraph (current role at Linear)
4. "Previously" line (Vercel)
5. A dismissable course-launch banner ("aiforui.dev... Early access has closed.")
6. Projects list, Writing list, Newsletter signup, social links — all fetched but likely below the true fold

First line (verbatim, banner aside): **"Emil Kowalski"**

Site is a Next.js App Router page whose content streams as a serialized RSC payload rather than plain server-rendered tags, so `<h1>`/`<h2>` could not be located directly — sizes for the name/role text are **unverified**. What is confirmed from the CSS bundle: 6 distinct font-weights actually shipped (300, 400, 500, **550**, **575**, 600) — the 550/575 values are non-standard, variable-font fine-tuning, more granular than any other site sampled. `letter-spacing:-.025em` found (direction: tighter than default). No `clamp()` found.

Photo/avatar/illustration: **none** detected in the fetched markup.

Links in hero proper (name/role/bio, before Projects): effectively 0–1 (the banner link, if it counts as "hero"). Total links on the page including Projects/Writing/social run well into double digits, but that content reads as page body, not a compact fold.

Conspicuously absent: no photo despite being a "design engineer" personal brand; no visible CTA.

---

### Josh W. Comeau — joshwcomeau.com

The homepage is **not a bio hero at all** — it's a blog index. There is no name/tagline/bio block on the first screen.

1. Nav (categories / courses / goodies / About)
2. A likely visually-hidden `<h1>Josh W Comeau homepage</h1>` (accessibility-only, not a visible headline — **unverified** whether it's visually hidden vs. just small)
3. "Articles and Tutorials" `<h2>`
4. First blog-post card ("Getting Started with Anchor Positioning") with a lead paragraph
5. Second blog-post card ("CSS vs. JavaScript")

First line of actual visible content: **"Articles and Tutorials"** (the personal name is not a headline anywhere on the fold).

A personal photo does exist on the site (`/images/josh/josh-happy-dark.png` and a light-mode variant), but it appears **further down the page**, not in the primary hero — confirming the homepage deliberately isn't structured as a personal-intro hero. His actual bio/photo hero lives on `/about-josh/`, a separate page.

CSS: no `clamp()` found in the 3 fetched bundles or the one inline `<style>` block present in the HTML. One incidental value worth noting: `font-size:calc(17 / 16 * 1rem)` — sizing expressed as an explicit ratio against the 1rem baseline, suggesting a deliberate ratio-based approach even where not implemented as `clamp()`. `letter-spacing:-.0625rem` also found (context/selector unconfirmed). His public reputation for fluid/clamp-based type could not be verified from this fetch — the homepage simply doesn't surface the relevant CSS.

Photo/avatar/illustration in hero: **absent from the hero specifically** (present elsewhere on the site).

---

### Maggie Appleton — maggieappleton.com

1. Nav (12 items: Home / Garden / Essays / Notes / Patterns / Smidgeons / Talks / Podcasts / Library / Antilibrary / Now / About)
2. `h1.title1`: "Maggie makes visual essays about programming, design, and anthropology."
3. Role line: "Designer, anthropologist, and mediocre developer"
4. Current-work line: "Currently exploring AI & software engineering at GitHub Next"
5. "The Garden" section intro, "Essays" section intro (likely below fold)

First line (verbatim): **"Maggie makes visual essays about programming, design, and anthropology."**

`h1.title1` CSS (confirmed, inline in page `<style>`):

```css
.title1 {
  font-size: var(--font-size-3xl);
  font-family: var(--font-serif);
  line-height: var(--leading-tighter);
  font-weight: 400;
  margin-bottom: var(--space-s);
  max-width: 1200px;
}
@media (max-width: 768px) {
  .title1 {
    font-size: var(--font-size-2xl);
    max-width: 100%;
    margin-bottom: var(--space-xs);
  }
}
```

This is a **discrete breakpoint step-down** (3xl → 2xl at 768px), not a fluid curve. The actual px values behind `--font-size-3xl`/`--font-size-2xl`/`--leading-tighter`/`--space-s` are defined in a global stylesheet that wasn't in the fetched bundle — **unverified** as exact numbers, though the token names confirm a deliberate design-token system exists. Notably, the h1 is set in a **serif** font while the rest of the site is presumably sans — a real font-family contrast used for heading hierarchy, distinct from every other site sampled here.

Photo/avatar/illustration: **none** in the hero — pure text.

Links in hero: 1 (GitHub Next, inline).

Conspicuously present (unlike every other site here): a large, content-dense nav — this is the opposite of "spare" in IA terms even though the hero text itself is plain.

---

### Linear — linear.app (marketing site, for contrast)

1. Animated word-by-word H1: "The product development system for teams" (each word blurs/translates in on load)
2. Subhead / CTA row (not captured in text extraction, presence inferred from component list)
3. Animated hero illustration (`NewHeroIllustration` component)
4. Below fold: Logos (partner integrations), Benefits, Carousel, Customer quotes, Pricing/Plan, Changelog

First line (verbatim): **"The product development system for teams"**

Confirmed mobile override: `.QI8oKG_title{max-width:360px;font-size:38px!important}` at ≤640px. The desktop base size was **not found** in the fetched CSS subset (Linear ships 60+ hashed per-component files; only a sample was pulled) — treat any assumption about a large desktop number as **unverified**, not fact.

Sitewide in-app UI scale (separately confirmed, likely product-UI not marketing-page): `micro .6875rem(11px) / mini .75rem(12px) / small .8125rem(13px) / regular .9375rem(15px) / large .1.125rem(18px) / title2 1.5rem(24px) / title1 2.25rem(36px)`. Step ratios widen going up: 1.09, 1.08, 1.15, 1.2, 1.33, 1.5 — tight at the body end, loose at the heading end.

Letter-spacing is **size-dependent, not fixed**: distinct values found at `-.022em, -.015em, -.013em, -.012em, -.011em, -.01em, -.00667em` — i.e. a per-step negative-tracking function where bigger text gets proportionally more negative tracking, rather than one blanket `letter-spacing` value.

Photo/avatar: none — illustration fills the role. Logo wall and testimonials **confirmed present** (partner logos: BigCommerce, Contentful, Optimizely, Salesforce, Shopify, Sitecore, WPP; a dedicated `CustomerQuotes` component).

---

### Vercel — vercel.com (marketing site, for contrast)

1. H1: "Agentic Infrastructure"
2. A decorative "scrambling text" subheading effect (aria-hidden spans that visually scramble between "To ship apps and agents" / "For coding agents")
3. CTA button row
4. Below fold: partner logo wall, benefits, pricing, customer quotes

First line (verbatim): **"Agentic Infrastructure"**

H1 classes: `text-heading-48 @sm:text-heading-64 font-normal!`. Both confirmed in CSS:

```css
.text-heading-48 {
  font-size: 48px;
  line-height: 56px;
  font-weight: 600;
  letter-spacing: -2.88px;
}
.text-heading-64 {
  font-size: 64px;
  line-height: 64px;
  font-weight: 600;
  letter-spacing: -3.84px;
}
```

Both letter-spacing values equal exactly **-6%** of their font-size (-2.88/48 and -3.84/64), so tracking scales proportionally even though it's expressed in px. Critically: **the hero H1 itself uses a discrete breakpoint jump (48px→64px at a container-query `@sm`), not `clamp()`** — despite Vercel's own CSS elsewhere defining genuinely fluid, named utilities:

```css
--text-fluid-14-16: clamp(.875rem, .6607rem + .3571vi, 1rem);
--text-fluid-14-20: clamp(.875rem, .2321rem + 1.0714vi, 1.25rem);
--text-fluid-14-24: clamp(.875rem, -.1964rem + 1.7857vi, 1.5rem);
/* elsewhere in the same bundle: */
clamp(1.25rem, -5.1786rem + 10.7143vi, 5rem)   /* 20px → 80px, likely a large campaign headline */
clamp(1rem, -.2857rem + 2.1429vi, 1.75rem)
clamp(1.5rem, .6429rem + 1.4286vi, 2rem)
```

These use the modern `vi` (viewport-inline) unit, not legacy `vw`. A third, unrelated static Tailwind v4 default scale (`--text-base:1rem`, `--text-2xl:1.5rem`, `--text-5xl:3rem`, `--text-7xl:4.5rem`, `--text-8xl:6rem`) also coexists in the same bundle — **three parallel sizing systems layered in one CSS bundle** (fixed breakpoint tokens for the flagship H1, named fluid-clamp utilities for body-adjacent text elsewhere, and untouched Tailwind defaults for everything else).

Photo/avatar: none — kinetic type + illustration fill the role. Logo wall confirmed (same partner-logo pattern as Linear).

---

### Brian Lovin — brianlovin.com

1. Avatar photo (60×60px, circular)
2. Name: `<h1 id="home-title" class="text-2xl font-semibold">Brian Lovin</h1>`
3. One-line bio: "I'm a software designer living in San Francisco, currently making AI products at Notion."
4. Icon-only social row (GitHub icon confirmed via inline SVG path; likely 1–2 more)

First line (verbatim): **"Brian Lovin"**

Largest text: **24px** (`text-2xl`), weight 600. Assuming an unmodified Tailwind body size of 16px (not overridden in the fetched CSS — **estimated**), ratio = 24/16 = **1.5x** — the flattest name-to-body ratio found in this entire survey. Below the fold, "Writing" and "Projects" section headers are styled with a _muted color_ (`text-quaternary`) rather than a smaller size — color, not size, does the differentiation work there.

Photo: **present** — a genuine small headshot avatar, one of only two personal sites in this set with an actual photo in the hero (the other being Samuel Kraft).

Links in hero: name/bio have none; the icon row below adds ~2. Total hero element count: **4** (avatar, name, bio line, social row) — one of the shortest inventories found.

---

### Samuel Kraft — samuelkraft.com

1. Avatar photo (source 90×90, rendered at 32×32px via `w-8 h-8 rounded-full`)
2. Name: `<h1 class="animate-in">Samuel Kraft</h1>`
3. (Meta only, not necessarily on-page) role line — `og:title` is "Samuel Kraft - Design engineer", `og:description` "I design & build interfaces"
4. Projects section, Posts section (below fold)

First line (verbatim): **"Samuel Kraft"**

Notable gotcha: `html{font-size:14px}` — **root font-size is overridden to 14px**, not the browser default 16px. This means every `rem`-based Tailwind utility on the site computes ~12.5% smaller than its nominal value (e.g. a `gap-16` = 4rem = **56px** here, not 64px). No custom `--text-*` design tokens found — the site appears to use plain Tailwind utility classes directly rather than named type-scale variables. The h1's own font-size wasn't resolved from the fetched CSS (`animate-in` is an entrance-animation class, not a sizing one) — **unverified**.

Photo: present (small avatar, per above).

Layout: content constrained to a `max-width:640px` column, `gap-16`/`gap-24` between blocks — i.e. spacing does the hierarchy work more than type size does.

---

### Lee Robinson — leerob.com

1. Handle heading: `<h1 class="site-title">@leerob</h1>`
2. Bio toggle (Default / Long) controlling paragraph length
3. Multi-paragraph bio (life bio: career, family, hobbies)
4. Notes list (9 items), Blogs list (with dates) — below fold

First line (verbatim): **"@leerob"**

`.site-title` CSS (two rules merge, confirmed in fetched CSS):

```css
.site-title {
  color: var(--text-heading);
  font-family: var(--font-reading);
  letter-spacing: -0.02em;
  text-wrap: balance;
  font-weight: 600;
  line-height: 1.4;
}
.site-title {
  margin: 0 0 0.95em;
  font-size: clamp(2.2rem, 3.5vw, 2.65rem);
  line-height: 1.15;
}
```

**This is a genuinely fluid, `clamp()`-based hero heading** — 35.2px at small viewports up to 42.4px, driven by plain `vw` (not a container query, not `vi`). Two more `clamp()` values found elsewhere in the same bundle (`clamp(1.25rem,3.4vw,3.25rem)`, `clamp(2rem,3.6vw,3.75rem)`) — likely other page-level headings — confirming this is a **sitewide fluid-type approach**, not a one-off. A conventional Tailwind default scale (`text-2xl:1.5rem`, `text-3xl:1.875rem`, `text-4xl:2.25rem`, `text-lg:1.125rem`) sits underneath for body-level text — fluid clamp is reserved for headline-tier elements only, on this evidence.

Letter-spacing values found: `-.02em` (site-title), `-.005em`, `.01em`, and **`.12em`** (a wide positive tracking, almost certainly an all-caps micro-label/kicker — consistent with the common pattern of loosening tracking only at small caption sizes while tightening it at display sizes).

Photo/illustration: a decorative hand-painted skyline illustration exists site-wide (alt text confirms "San Francisco skyline into the Des Moines skyline"), but its position relative to the very first screen is **unverified** — it did not appear ahead of the bio text in the fetched order.

Links in hero: the bio prose contains 2–3 inline links (Cursor, Vercel, "angel invest").

---

### Delba Oliveira — delba.dev

The most minimal hero in the entire set — no name, no photo, no design flourish of any kind on the fold.

1. `<h1 class="font-medium">Portfolio</h1>` — the literal word "Portfolio," not the person's name
2. Bio paragraph: "I'm looking for my next role in developer education or technical video production. If you're hiring:"
3. One CTA button: "Let's talk" (→ LinkedIn)
4. Immediately below: `<h2 id="work">Work</h2>` and a bulleted project list — no scroll transition, no section padding distinguishing "hero" from "content"

First line (verbatim): **"Portfolio"**

The h1 has **no explicit font-size utility at all** — `font-medium` sets weight only; size is inherited from the surrounding `prose prose-stone` Tailwind Typography wrapper, meaning the whole page (including this "hero") is laid out as a plain long-form document, not a designed landing section. Exact computed px is **unverified** (governed by the Typography plugin's relative `em`-based h1 scale, not an independent value).

Photo: **exists on the site** (a 400×400 headshot, `alt="Delba"`) but is placed deep in an "About me" section far below the fold — i.e., the photo was deliberately kept out of the hero, not simply absent from the site.

Links in hero: 1 (the "Let's talk" CTA).

Conspicuously absent: literally everything decorative — no name as a headline, no photo, no tagline, no visual differentiation between "hero" and "body." This is the strongest data point for "hero as plain sentence" in the survey.

---

### Guillermo Rauch — rauchg.com

1. Name: "Guillermo Rauch"
2. Nav: "About," "Follow me"
3. Chronological post list, each showing a title and a raw public view-count (2025 / "The AI Cloud" / 49,809 · 2021 / "Making the web. Faster." / 106,796 · 2020 / "Next for Vercel" / 61,973 · etc.)

First line (verbatim): **"Guillermo Rauch"**

Like Josh Comeau's and Lee Robinson's homepages, this is structurally a **blog index**, not a bio hero — no tagline, no bio sentence, no photo appear before the post list starts. The one distinctive touch: publicly displayed view-counts next to each post, an unusual bit of transparency not seen on any other site sampled.

`font-bold` is the only weight class confirmed actually used in the HTML (the CSS bundle carries the full unused Tailwind 100–900 scale, which is noise). `letter-spacing:.05em` found — positive/loose tracking, likely on the year labels, matching the "loosen tracking only on small caption-like text" pattern seen elsewhere.

Photo/avatar/illustration: **none** detected on the homepage.

---

## 2. Type hierarchy and titles

| Site                                                         | Confirmed type scale (sitewide, where found)                                                                       | Step ratio pattern               |
| ------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------ | -------------------------------- |
| paco.me                                                      | 10 / 12 / 14 / 16 / 20 / 24 / 30px                                                                                 | ~1.14–1.25, hand-tuned           |
| Linear (in-app UI)                                           | 11 / 12 / 13 / 15 / 18 / 24 / 36px                                                                                 | widens toward top: 1.08→1.5      |
| Vercel                                                       | 16 / 24 / 30 / 48 / 72 / 96px (Tailwind default) **+** separate fluid clamp tier **+** custom 48/64px heading tier | three systems coexist            |
| brianlovin.com, samuelkraft.com\*, leerob.com, delba.dev     | Tailwind v4 defaults: 16 / 18 / 24 / 30 / 36 / 72px                                                                | Tailwind's fixed 1.125–1.5 steps |
| rauno.me, emilkowal.ski, joshwcomeau.com, maggieappleton.com | Not fully resolvable from fetched CSS                                                                              | unverified                       |

\*samuelkraft.com's root `font-size:14px` override means its nominal Tailwind rem values compute ~12.5% smaller than the table above in practice.

**Font weights actually used** (verified against HTML class usage, not raw CSS which includes unused Tailwind noise):

- brianlovin.com: 3 (`font-bold`, `font-medium`, `font-semibold`)
- samuelkraft.com: 1 (`font-medium`) — plus whatever the unstyled body default is
- delba.dev: 1 (`font-medium`)
- rauchg.com: 1 (`font-bold`)
- leerob.com: no utility weight classes found on hero elements (weight set via component CSS instead: 600 on `.site-title`)
- emilkowal.ski: 6 distinct weights confirmed in CSS (300/400/500/**550**/**575**/600) — notably more granular than anywhere else, consistent with a variable font being fine-tuned rather than snapped to standard steps
- Vercel/Linear (marketing sites): far more weights in the shipped CSS (9–11), but that's compiled Tailwind noise, not evidence of real per-page usage

**How h1/h2/h3 differ:**

- **brianlovin.com** separates the h1 (24px/600, default color) from h2 section headers (no larger — same or smaller — but muted via `text-quaternary` color) — i.e. **color, not size, carries the hierarchy** below the name.
- **maggieappleton.com** shifts font-_family_ between levels: h1 is serif (`var(--font-serif)`), implying body/nav is a different (presumably sans) family — a hierarchy signal beyond size/weight not seen elsewhere in this set.
- **Linear** ties letter-spacing to size on a sliding scale (more negative tracking as size increases) rather than a single fixed tracking value for all headings.
- **paco.me**'s scale is close to but not exactly geometric — evidence of hand-tuning rather than a formula.

**Blog post title treatment, index vs. individual page:** Not independently confirmed for most sites in this set — none of the fetched homepages were blog-post-listing pages with enough markup depth to compare index-vs-detail title sizes directly. leerob.com's Blogs list on the homepage shows titles without a distinct size class visible in the fetched fragment (**unverified**). This sub-question would need a dedicated fetch of each site's `/blog` and `/blog/[slug]` pages to answer with real numbers — out of scope for what was fetched here, flagged rather than guessed.

**Letter-spacing/line-height deviating from defaults:**

- Tighter-than-default (negative tracking) on display/heading text: paco.me (-.05em), emilkowal.ski (-.025em), Linear (-.01em to -.022em, scaling with size), Vercel (-.06em consistently, i.e. -2.88px/48px and -3.84px/64px), leerob.com (-.02em on the name).
- Looser-than-default (positive tracking), always on small/caption text: leerob.com (.12em, likely a kicker label), rauchg.com (.05em, likely year labels).
- Line-height tightened below 1: paco.me has `line-height:.8` somewhere in its bundle (**unverified exact selector**, but confirms sub-1 line-height is in use, an aggressive display-type choice); Vercel's `--text-5xl`/`--text-7xl`/`--text-8xl` tokens all set `line-height:1` (Tailwind's convention for very large display sizes).

---

## 3. Fluid vs fixed type

| Site                                                                                                                          | Fluid heading type?   | Evidence                                                                                                                                                                        |
| ----------------------------------------------------------------------------------------------------------------------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| leerob.com                                                                                                                    | **Yes**               | `clamp(2.2rem,3.5vw,2.65rem)` on the h1, plus 2 more clamp() headings sitewide                                                                                                  |
| vercel.com                                                                                                                    | **Partial**           | Named fluid utilities exist (`clamp(.875rem,.6607rem+.3571vi,1rem)` etc., using modern `vi` units) but the actual homepage H1 uses a fixed 48px→64px breakpoint jump, not clamp |
| linear.app                                                                                                                    | **No (for the hero)** | Only a fixed `!important` mobile override (38px) found; two clamp() found elsewhere are for border/hairline widths, not type                                                    |
| paco.me, rauno.me, emilkowal.ski, maggieappleton.com, joshwcomeau.com, brianlovin.com, samuelkraft.com, delba.dev, rauchg.com | **No clamp() found**  | Fixed px/rem values, some with discrete `@media` breakpoint step-downs (e.g. maggieappleton.com's h1 drops one full token at 768px)                                             |

Where fluid type is used, it applies to **headline-tier text only** — no site in this sample was found applying `clamp()` to plain body/paragraph copy. Vercel's family of `--text-fluid-14-*` tokens tops out around 24px, suggesting even there fluid sizing is reserved for sub-heading/lead-text scale, not display headlines (which instead get the fixed 48/64px treatment) or true body copy.

**Fluid spacing:** no site in this sample showed `clamp()` or viewport units applied to margin/padding/gap in the CSS that was actually fetched. This is a genuine gap in the data (could easily exist in unfetched, code-split CSS chunks — especially for Linear and Vercel) rather than confirmed absence — flagged as **unverified rather than "no site does this."**

---

## 4. Cross-site comparison table

| Site               | Hero element count                                            | First line type              | Largest text                                | Photo?                                                    | Links in hero           | Fluid type?                          |
| ------------------ | ------------------------------------------------------------- | ---------------------------- | ------------------------------------------- | --------------------------------------------------------- | ----------------------- | ------------------------------------ |
| rauno.me           | ~5 (name, bio sentence, nav row, social row, kinetic tagline) | one-sentence bio/claim       | 75–85px (720px outlier, unverified purpose) | No — kinetic type instead                                 | ~10                     | No                                   |
| paco.me            | 4 (name, bio, second bio para, section list)                  | name → tagline               | ~64px (unverified selector)                 | No                                                        | 2                       | No                                   |
| emilkowal.ski      | 5 (name, role, bio, "previously," banner)                     | name                         | unverified                                  | No                                                        | 0–1                     | No                                   |
| joshwcomeau.com    | N/A — homepage is a blog index, not a hero                    | section heading              | unverified                                  | No (photo exists, but not in hero)                        | several (article links) | No confirmed                         |
| maggieappleton.com | 3 (h1 claim, role line, current-work line)                    | one-sentence claim           | unverified (`--font-size-3xl` token)        | No                                                        | 1                       | No (discrete breakpoint step)        |
| linear.app         | 2–3 (H1, illustration, CTA)                                   | product claim                | unverified (38px confirmed mobile only)     | No — illustration                                         | unverified              | No (for hero); yes elsewhere on site |
| vercel.com         | 2–3 (H1, scramble subtext, CTA)                               | product claim                | 48px→64px (fixed breakpoint jump)           | No — kinetic type + illustration                          | unverified              | No (hero); yes elsewhere on site     |
| brianlovin.com     | 4 (avatar, name, bio, social row)                             | name                         | 24px                                        | **Yes** (60×60 avatar)                                    | ~2 (icons)              | No                                   |
| samuelkraft.com    | 3–4 (avatar, name, meta role)                                 | name                         | unverified                                  | **Yes** (32×32 avatar)                                    | 0 visible in fold       | No                                   |
| leerob.com         | 3 (handle, bio toggle, bio paragraph)                         | handle ("@leerob")           | 35.2–42.4px (fluid)                         | Illustration exists sitewide, position in hero unverified | 2–3 (inline in bio)     | **Yes**                              |
| delba.dev          | 3 (h1 "Portfolio," bio, CTA)                                  | generic page label, not name | unverified (Typography-plugin default)      | No (photo exists, deliberately placed below fold)         | 1                       | No                                   |
| rauchg.com         | 3 (name, nav, post list)                                      | name                         | unverified                                  | No                                                        | 2 (nav)                 | No                                   |

---

## 5. What's absent

| Section                  | Present on                                                                                                                                | Absent on                                                                                                                     |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------- |
| Skills / tech-stack grid | _(none in this sample)_                                                                                                                   | rauno, paco, emil, josh, maggie, brianlovin, samuelkraft, leerob, delba, rauchg — **all 10 personal sites**                   |
| Logo wall                | linear.app, vercel.com                                                                                                                    | all 10 personal sites                                                                                                         |
| Timeline                 | _(none in this sample; a false-positive "timeline" match on joshwcomeau.com was the CSS `animation-timeline` API, not a résumé timeline)_ | all 10 personal sites, and both marketing sites                                                                               |
| Testimonials             | linear.app (`CustomerQuotes` component)                                                                                                   | vercel.com (not confirmed absent — likely present in unfetched chunks, but not found in the sample) and all 10 personal sites |
| Stats/metrics counters   | rauchg.com (a near-adjacent variant: public per-post _view counts_, not aggregate career stats)                                           | all other 9 personal sites, and neither marketing site showed classic "10,000+ users" style counters in the fetched sample    |

**The signal is the omission.** Every single personal-portfolio site in this sample — including ones by people building at Vercel/Linear/Notion, i.e. people who could easily justify a skills grid or logo wall of employers — omits all five of these standard "portfolio" sections. Not one lists technologies as a grid, not one shows past-employer logos as a wall, not one shows a timeline, and only Linear (a company product page, not a person) uses testimonials in any form. This looks like a genuine convention among people building "spare" personal sites, not a coincidence of sample size.

---

## 6. Synthesis / recommendation seeds

_(Observations from the pattern across the spare personal sites — rauno, paco, emil, josh, maggie, brianlovin, samuelkraft, leerob, delba, rauchg — treated as data points, not as prescriptions for arii.dev.)_

- **The hero is frequently just a sentence, not a headline + subhead + CTA stack.** rauno.me, maggieappleton.com, and delba.dev all lead with a single declarative sentence doing the job a "headline" usually does elsewhere — no separate large display headline sitting above smaller supporting copy.
- **Name-as-headline is optional, and when present is often sized surprisingly close to body text.** brianlovin.com's name is only 1.5x body size (24px/16px) — the flattest ratio in the set — with a photo and a one-line bio doing the rest of the identification work. delba.dev goes further and doesn't headline the name at all.
- **Photos are the exception, not the rule, and even where present are often tiny.** Only 2 of 10 personal sites (brianlovin.com, samuelkraft.com) put a photo in the hero, and both use small circular avatars (60px and 32px respectively) rather than a large portrait. Two more sites (joshwcomeau.com, delba.dev) have a personal photo _somewhere on the site_ but deliberately keep it out of the hero/fold.
- **Where fluid type does appear, it's scoped narrowly.** leerob.com is the only site in the sample with confirmed `clamp()` on its actual hero heading, and even Vercel — which has a whole named fluid-clamp utility system — doesn't apply it to its own flagship H1 (that uses a fixed breakpoint jump instead). Fluid sizing, on this evidence, is a tool reached for on secondary headings/lead text more often than on the single largest element on the page.
- **Hierarchy is frequently built from color/weight/font-family/letter-spacing, not size alone.** brianlovin.com separates heading levels by color (`text-quaternary`) rather than making h2 smaller than h1; maggieappleton.com switches to a serif font for its h1 while (presumably) staying sans elsewhere; Linear scales letter-spacing continuously with size rather than picking one tracking value for all headings.
- **Several of the most "minimal-reputation" personal sites (joshwcomeau.com, rauchg.com, and to a lesser extent leerob.com) don't actually use their homepage as a bio hero at all** — they use it as a blog/post index and push the personal-intro content to a dedicated `/about` page or a compact sidebar. That's a structural option worth naming explicitly: the "hero" doesn't have to live on `/`.
