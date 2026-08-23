# SEO / AI-visibility audit — arii.dev

Date: 2026-08-23. Scope: search-engine and AI-answer-engine visibility only. Read-only audit of the repo at this commit (`5fb4339`) plus live checks against `https://arii.dev`.

---

## Part 1 — current state

### Meta tags, Open Graph, Twitter, canonical (`src/components/BaseHead.astro`)

Comprehensive and correctly wired. Confirmed by direct read:

- `viewport`, `color-scheme`, dual `theme-color` (light/dark via `prefers-color-scheme`), `apple-mobile-web-app-status-bar-style`, favicon (svg + ico), `<link rel="sitemap">`, RSS `<link rel="alternate">`, `generator` meta, font preloads.
- Canonical: `<link rel="canonical">` built from `canonicalPath` prop (falls back to `Astro.url.pathname`), resolved against `Astro.site` (`https://arii.dev`). **Verified non-obvious detail:** on paginated category/tag pages, `page 1` explicitly canonicalizes to the un-paginated base URL rather than to itself (`categoryPageHref` returns the bare category URL when `page <= 1`, and `[category]/page/[page].astro` passes that through to `BlogArchive` → `SiteLayout` → `BaseHead`). This correctly avoids the classic `/category/x/` vs `/category/x/page/1/` duplicate-content trap. **This is already correct — do not touch.**
- Title: `${title} — ${SITE_TITLE}` pattern, with a distinct home-page variant using `SITE_TAGLINE`. No truncation issues observed in samples.
- OG: `site_name`, `type` (hardcoded `"website"` on every page, including blog posts — see Part 3), `url`, `title`, `description`, `image` + explicit `width`/`height`.
- Twitter: `summary_large_image` card, `domain`, `url`, `title`, `description`, `image`.
- Fallback OG image (`FallbackImage` from `@assets/og-image.jpg`) used when a page/post has no hero image — good, prevents blank social cards.

### Structured data (JSON-LD)

Grepped for `application/ld+json` / `@type` / `schema` across `src/` — appears in exactly three files: `BaseHead.astro`, `SiteLayout.astro`, `BlogPost.astro`. No other schema types anywhere in the codebase (no `TechArticle`, `BreadcrumbList`, `SoftwareApplication`, `Organization`).

- **Site-wide default** (`BaseHead.astro`, when no `schema` prop is passed — i.e. home, about, featured, blog index, category/tag archive pages): `Person` schema — `name`, `alternateName`, `url`, `jobTitle: "Software Developer"`, `knowsAbout: ["AI", "Machine Learning", "Software Development"]`. No `sameAs` (see Part 3).
- **Blog posts** (`BlogPost.astro`, passed as `schema` prop into `SiteLayout` → `BaseHead`): `BlogPosting` — `headline`, `description`, `datePublished` (ISO from `pubDate`), `dateModified` (ISO from `updatedDate`, only when present), `author: { @type: Person, name }`, `image` (only when a hero image exists). All required/recommended `BlogPosting` properties for Google's Article rich-result eligibility are present.
- **Verified: this matches what was expected** — `BlogPost.astro` does pass a `BlogPosting` schema prop, confirmed by direct read rather than inference.

### Heading hierarchy — verified clean, contrary to the task brief's suggestion

`BlogPost.astro` renders exactly one `<h1>{title}</h1>` per post. An initial grep for `^# ` across all 20 posts in `src/content/blog/*.mdx` returned false positives — those are bash comments (`# core`, `# storage & auth`, etc.) *inside fenced code blocks*, not markdown headings. Re-running the check with code fences stripped (`awk '/^```/{c=!c;next} !c && /^#{1,6} /{print}'`) across all 20 posts shows:

- Every post uses `##` (h2) exclusively for body section headings (`key features`, `tech stack`, `how it works`, `highlights`, etc.).
- **Zero** real `h1` in any post body, **zero** `h3` usage anywhere, no skipped levels.

So the hierarchy is `h1` (title, from layout) → `h2` (sections), clean on all 20 posts. The client-side ToC script in `BlogPost.astro` (`article h2, article h3`) is consistent with this — it just never finds an h3 to render, which is fine. **No fix needed here; do not "fix" heading levels that aren't actually broken.**

### Sitemap + RSS

- `@astrojs/sitemap` is registered in `astro.config.mjs` with no custom `filter`/`serialize`/`i18n` options — default behavior.
- Live-verified: `curl https://arii.dev/sitemap-index.xml` returns a valid index pointing to `sitemap-0.xml`, which lists every static route (home, about, blog index + all `/page/N/`, every post, every category archive + its `/page/N/` variants, every tag archive + its `/page/N/` variants). Correctly excludes the `Person`-schema-only pages from anything special (they're just regular URLs).
- **Gap, verified:** `grep -c lastmod` against the live `sitemap-0.xml` returns `0`. No `<lastmod>` on any URL, despite every post having `pubDate`/`updatedDate` available at build time. See Part 3.
- RSS (`src/pages/rss.xml.js`): valid feed, live-verified via `curl https://arii.dev/rss.xml`. Uses `@astrojs/rss` with `title`, `description`, `site`, and items mapped from `getCollection('blog')` (spreading `post.data` + `link`).
- **Bug, verified:** `rss.xml.js` never sorts posts before mapping. Live feed order is `auto-sort-downloads-folder` (pubDate May 2026) → `coffee-on` (pubDate Sep 2023) → `dtm` (May 2026) → `grid-pathfinder` (Dec 2022) → ... — this is filesystem/glob enumeration order (alphabetical by slug), not reverse-chronological. RSS consumers (feed readers, aggregators, and any AI/tooling that treats "first item in the feed" as "most recent") will see the wrong post as "latest." See Part 3, recommendation #1.
- `heroImage`, `heroImageAlt`, `category`, `tags` are spread into each RSS item alongside the allowed fields, but `@astrojs/rss`'s schema silently drops unrecognized properties — confirmed via the live feed, which contains only `title`, `link`, `guid`, `description`, `pubDate` per item. Not broken, just minimal (no `categories`, no full content). Given the site's minimalism, this is arguably fine as-is; flagged only as an optional, low-priority item, not a defect.

### `robots.txt` — repo and live are identical, verified

Repo (`public/robots.txt`) and live (`curl https://arii.dev/robots.txt`) are byte-identical:

```
User-agent: *
Allow: /

Sitemap: https://arii.dev/sitemap-index.xml
```

This is a single wildcard rule with **no crawler-specific entries at all** — not for `GPTBot`, `ClaudeBot`, `Claude-User`, `Claude-SearchBot`, `Google-Extended`, `PerplexityBot`, `Perplexity-User`, `CCBot`, `Amazonbot`, `OAI-SearchBot`, or anyone else. Because `Allow: /` is set under `User-agent: *` and nothing more specific exists, **every crawler — training and retrieval alike — is currently allowed to crawl the entire site.** This is a valid, deliberate-looking choice (maximal visibility) rather than an oversight, but the file makes no explicit statement either way about AI training vs. AI answer-engine retrieval. See Part 3 for the decision point this raises (not a "fix").

### IndexNow (`src/scripts/indexnow.ts`, wired from `.github/workflows/deploy.yml`)

Verified by direct read: the script reads `dist/sitemap-index.xml`, resolves every child sitemap, extracts **every `<loc>` URL from every sitemap file** (i.e. the entire site — home, about, every post, every category/tag archive and every paginated variant of each), and submits **all of them** to the IndexNow API on **every single deploy**, unconditionally, with a 500ms delay between requests. There is no diffing against a previous run, no restriction to changed files, no use of git diff or build cache to scope the list. This confirms the task brief's suspicion exactly. It's not harmful (IndexNow doesn't penalize resubmission of unchanged URLs), just wasteful and slower than necessary — a low-priority efficiency item, not a correctness bug.

The IndexNow key file (`public/2c1e8ec74dbd43488cdf4e683373103f.txt`) exists and matches the `keyLocation` the script constructs (`https://arii.dev/{KEY}.txt`) — wiring is mechanically correct.

### Deploy pipeline cache/invalidation strategy (`.github/workflows/deploy.yml`)

Verified by direct read and live header checks:

- HTML/JSON/XML/TXT synced first with `Cache-Control: no-cache,no-store,must-revalidate` — confirmed live (`curl -I https://arii.dev/` shows exactly this header).
- Hashed assets (JS/CSS/fonts/images) synced second with `Cache-Control: public,max-age=31536000,immutable`, and `--delete` runs on this pass only (so nothing is wrongly deleted before the "never cache" pass completes) — confirmed live (`curl -I` on a built `/_astro/*.css` asset shows exactly this header).
- CloudFront invalidation of `/*` runs after both syncs, so HTML changes go live immediately despite the CDN sitting in front.
- **This is a correct, well-thought-out cache strategy. Do not recommend changing it.**

### CloudFront Function

Searched the repo (`grep -ri cloudfront`, `find . -iname "*cloudfront*"`) — the only CloudFront-related artifact in this repo is the `aws cloudfront create-invalidation` step in `deploy.yml`. No CloudFront Function, Lambda@Edge, or related config file exists in this codebase. If a CloudFront Function exists, it is managed entirely outside this repo (AWS console) and is out of scope for this code-level audit — nothing here to report or recommend at the code level.

### `llms.txt` / `llms-full.txt`

Confirmed absent: `find . -iname "llms*.txt"` (excluding `node_modules`) returns nothing. Neither `public/llms.txt` nor `public/llms-full.txt` exists. See Part 2 for whether this is worth adding.

### Astro/integration versions

`astro ^6.4.2`, `@astrojs/mdx ^6.0.1`, `@astrojs/sitemap ^3.7.3`, `@astrojs/rss ^4.0.18` — current major versions, nothing outdated enough to affect this audit.

### Summary — already well-implemented (do not redo)

- OG/Twitter/canonical meta tag coverage.
- Canonical self-referencing on paginated page-1 URLs (avoids duplicate content).
- `BlogPosting` JSON-LD on posts, `Person` JSON-LD sitewide default.
- Heading hierarchy (h1 → h2, no skips, no stray h1s) — verified clean across all 20 posts.
- Sitemap generation and live availability.
- HTML no-cache / hashed-asset immutable-cache split + CloudFront invalidation ordering.
- `robots.txt` is valid, simple, and matches live exactly.
- IndexNow wiring is mechanically correct (just overly broad in scope per run).

---

## Part 2 — current practice research (last ~12 months weighted higher)

### 1. Article vs BlogPosting vs TechArticle — does the subtype change rich-result eligibility?

Google's own Article structured-data documentation (`developers.google.com/search/docs/appearance/structured-data/article`, current) states: *"Article objects must be based on one of the following schema.org types: `Article`, `NewsArticle`, `BlogPosting`."* `TechArticle` is not mentioned anywhere in that page. All three listed types share identical required/recommended properties and are treated interchangeably for Article rich-result eligibility (headline, image, date, etc.) — the type choice is a content-classification signal, not a feature switch. **Conclusion: keeping `BlogPosting` is correct and accurately reflects this site's voice ("a developer's log"); migrating to `TechArticle` would be cosmetic churn with no documented eligibility benefit.** Source: Google Search Central docs (primary, current). Secondary SEO-blog sources (schemavalidator.org, schemaengineai.com, etc.) largely agree but frame it as a "signal" — treat that framing as speculative dressing on top of the one hard fact from Google's own page.

`BreadcrumbList`: Google's own docs (`developers.google.com/search/docs/appearance/structured-data/breadcrumb`) confirm this unlocks a breadcrumb trail in the search result snippet, and — notably — does **not** require a visible on-page breadcrumb UI; it's pure JSON-LD. For a personal blog with a shallow hierarchy (home → blog → post, no deep categories), the practical payoff is modest, but it wouldn't add visual clutter if added. Low priority, not in the top 5.

`Person`/`sameAs`: not directly covered by a Google Article/Person doc fetched here, but `sameAs` is a documented schema.org property whose purpose (per schema.org and Google's Organization guidance, which explicitly recommends `sameAs` for entity disambiguation) is to link an entity to its authoritative profiles elsewhere on the web. Confidence here is "plausible, low-risk" rather than "Google explicitly confirms this changes ranking" — no primary source claims a direct ranking effect for `Person.sameAs`, only entity-linking value.

`SoftwareApplication` for project posts: not independently researched in depth, but schema.org's own type definition expects fields like `applicationCategory`, `operatingSystem`, and commonly `aggregateRating`/`offers` for rich-result eligibility — none of which map cleanly onto this site's project write-ups (small CLIs, side projects, no ratings/pricing). Adding it with empty/inaccurate fields risks Search Console structured-data errors for no proven benefit. **Not recommended.**

### 2. Google's current guidance on AI-generated/AI-assisted content

Fetched directly from `developers.google.com/search/docs/fundamentals/using-gen-ai-content` (Google Search Central, current page). Key points, verified by direct fetch:

- Google does not prohibit AI-assisted content. The operative line: *"using generative AI tools ... to generate many pages without adding value for users may violate Google's spam policy on scaled content abuse."* The violation is about **scaled, low-value production**, not AI use itself.
- Guidance centers on **accuracy, quality, relevance, and user value**, and explicitly recommends *"consider disclosing how content was created"* for transparency — this is a recommendation, not a requirement.
- This is a **refinement**, not a reversal, of the older "helpful content" framing: the shift (also visible in a September 2025 addition to Google's Search Quality Raters Guidelines covering AI Overviews specifically, per secondary reporting) is toward *"does it demonstrate genuine value, regardless of production method"* rather than *"who/what wrote it."* E-E-A-T is still the underlying framework Google evaluates against; it hasn't been replaced.
- **Caveat on sourcing**: the E-E-A-T-specific framing above ("who wrote it" → "does it add value") comes from secondary SEO commentary (searched, not fetched from a primary Google page) summarizing a January 2025 Google update — treat that specific phrasing as a paraphrase of Google's position, not a verified quote. The spam-policy quote and the "consider disclosing" line are both directly fetched from Google's own current documentation and can be trusted as primary.

Practical read for this site: nothing to change here. It's a personal, first-person, experience-based blog with real projects behind each post — exactly the profile Google's guidance favors regardless of any AI assistance in drafting.

### 3. How AI answer engines source and cite content — crawlers, robots.txt, and llms.txt

Verified via a mix of primary crawler-operator documentation and secondary aggregation:

| Crawler | Operator | Purpose (per operator docs) |
|---|---|---|
| `GPTBot` | OpenAI | Training data collection for OpenAI's models |
| `OAI-SearchBot` | OpenAI | ChatGPT Search indexing (separate from training) |
| `ClaudeBot` | Anthropic | Training data collection — **confirmed via direct fetch of Anthropic's own support article** ("ClaudeBot enhances AI model development by collecting web content for training datasets") |
| `Claude-User` | Anthropic | Live retrieval when a Claude user's query causes Claude to visit a page on their behalf — confirmed via the same primary source |
| `Claude-SearchBot` | Anthropic | Indexing for Claude's search-result quality — confirmed via the same primary source |
| `PerplexityBot` | Perplexity | Proactive crawling to build Perplexity's answer/search index (not purely reactive to a single query) |
| `Perplexity-User` | Perplexity | Live retrieval on behalf of a user's in-session query |
| `Google-Extended` | Google | Controls Gemini/Vertex **training** use of content; explicitly does **not** control Google AI Overviews eligibility (that's governed by standard Googlebot indexing) |
| `CCBot` | Common Crawl (non-profit) | Publishes an open web corpus reused as training-data input by many LLM trainers (GPT-2/3/4, LLaMA, Mistral, etc. per Common Crawl's own page) — CCBot itself doesn't train anything, it's upstream of training |

Anthropic's docs (fetched directly) confirm each of the three Claude bots is controlled **independently** in `robots.txt` — blocking `ClaudeBot` does not block `Claude-User` or `Claude-SearchBot`. This means a site can block AI *training* crawlers while still remaining eligible for citation in live AI *answers*, by allowing the retrieval/search bots and blocking only the training ones. Since arii.dev's current `robots.txt` blocks nothing, this is a **choice available**, not a fix required — see Part 3.

**`llms.txt`**: originated as a proposal by Jeremy Howard (Answer.AI), published September 2024 at `llmstxt.org` — confirmed via the original Answer.AI post and the current spec site. As of the most recent reporting found (2026): adoption is real but uneven (one cited study found ~10% adoption across 300k domains), concentrated in developer-facing SaaS/API products (Stripe, Vercel, Cloudflare, Anthropic all ship one). **Critically: neither OpenAI, Anthropic, Google, nor Perplexity has officially confirmed their crawlers consume the file normatively**, and it has not been ratified by IETF or W3C — it remains a community convention, not an adopted standard. One cited study found that including `llms.txt` as a feature in a model predicting AI-citation likelihood *reduced* prediction accuracy — i.e. it measured as noise, not signal, for citation frequency in that study. **Conclusion: `llms.txt` is speculative/aspirational for actual citation impact today, not evidenced.** This directly informs Part 3 — not recommending it as one of the confident picks.

### 4. What correlates with being cited in AI answers — studies vs. vendor marketing

The one study with real academic backing found: **"GEO: Generative Engine Optimization"** (Aggarwal, Murahari, Rajpurohit, Kalyan, Narasimhan, Deshpande — Princeton/IIT Delhi, published at ACM SIGKDD 2024, arXiv:2311.09735). Ran ~10,000 queries across nine content-modification strategies and measured visibility impact in AI-generated answers directly. Findings (per multiple summaries of the paper, cross-checked): **"Cite Sources," "Statistics Addition," and "Quotation Addition"** produced the largest, most consistent gains (roughly 22–41% relative visibility improvement); clear headings/logical structure help models parse and extract content; content with verifiable claims/data points is preferentially cited. This is a genuine peer-reviewed study, not vendor content — treat its specific findings as the most solidly evidenced input to Part 3.

Everything else found in this research pass (SEO-agency blog posts about "content structure for AI citation," "AEO," etc.) is vendor/agency marketing dressed as research — directionally consistent with the GEO paper (headings, direct answers, structure) but not independently evidenced, and explicitly *not* treated as a primary source here.

### 5. Core Web Vitals — current thresholds and relevance to this architecture

Fetched directly from `web.dev/articles/inp` (Google's own site, current page):

- **Good** thresholds (unchanged from what's been standard since INP replaced FID in March 2024, confirmed as background knowledge and consistent with the fetched page): LCP ≤ 2.5s, INP ≤ 200ms, CLS ≤ 0.1, each at the 75th percentile of real-user CrUX data over a rolling 28-day window.
- Critically, per the fetched INP page: **"it's possible for a page to return no INP value"** at all if the user never clicks/taps/types on the page — scroll and hover don't count. For a static, content-first Astro site with minimal JS (skip-link, ToC scroll listener, scroll-animate script) and few interactive elements beyond navigation and the image lightbox, INP is close to a non-issue by construction; there's very little main-thread work to respond slowly to. LCP is the metric actually worth watching (hero images), and CLS is naturally low on a site with explicit `width`/`height` on `<Image>` and no ad/embed injection.
- **Conclusion: no performance work is recommended here.** The architecture (static Astro output, hashed immutable assets, CDN-fronted) already puts Core Web Vitals largely out of reach as a risk area. Recommending Core Web Vitals work for this site would be solving a problem that doesn't exist for this architecture — explicitly not included in Part 3.

---

## Part 3 — recommendations, ordered by effort-to-impact (cheapest/highest-confidence first)

Five recommendations, as requested — not padded with speculative extras. Each is invisible to a site visitor (no new UI, no badges, no metadata rows on the page) and does not conflict with the site's minimalist direction.

### 1. Fix RSS feed sort order

**File:** `src/pages/rss.xml.js`
**Change:** sort `posts` by `pubDate` descending before mapping to items, e.g. `posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())` (mirrors the sort already used identically in `src/pages/blog/category/[category].astro` and elsewhere in the codebase, so this is consistent with existing patterns, not a new one).
**Why:** verified live — the feed currently serves posts in filesystem/glob order, not chronological order, so the "first" item in the feed is not the newest post. Any feed reader, aggregator, or tool that treats feed order as recency (which is the RSS convention) will surface the wrong post as latest. This affects both human RSS subscribers and any automated content-freshness signal derived from the feed.
**Confidence: solid, evidenced.** This isn't a matter of SEO opinion — it's a verified deviation from RSS convention with a one-line, zero-risk fix, using a sort already present elsewhere in the codebase.

### 2. Add `sameAs` to the default `Person` JSON-LD

**File:** `src/components/BaseHead.astro` (the fallback `Person` schema object)
**Change:** add `sameAs: SOCIAL_LINKS.map(l => l.href)` (or a curated subset — github/linkedin/x), using data that already exists in `src/consts.ts`.
**Why:** `sameAs` is schema.org's standard mechanism for tying a `Person`/`Organization` entity to its authoritative profiles elsewhere on the web, which Google explicitly recommends for `Organization` entity disambiguation; the analogous benefit for `Person` is commonly recommended but not confirmed by a fetched Google-Person-specific primary source in this research pass. No new data collection needed — `SOCIAL_LINKS` already has every URL this would need.
**Confidence: plausible, low-risk.** Cheap because the data already exists; not "solid, evidenced" in the same way as #1 because no primary source in this research confirmed a `Person.sameAs` ranking or citation effect specifically.

### 3. Add `lastmod` to sitemap entries

**File:** `astro.config.mjs` (the `sitemap()` integration's `serialize` option)
**Change:** pass a `serialize(item)` function that looks up each URL's underlying post `updatedDate ?? pubDate` and returns `{ ...item, lastmod: date.toISOString() }` for blog-post URLs (archive/pagination URLs can be left without `lastmod`, or set to the newest contained post's date).
**Why:** verified live — the current sitemap has zero `<lastmod>` entries anywhere, despite every post having reliable date fields available at build time. `lastmod` helps crawl schedulers (including IndexNow-adjacent recrawl behavior) prioritize what's actually changed.
**Confidence: plausible, bounded value.** Google's own stated position (widely cited, not independently re-fetched in this pass) is that `lastmod` is only used when it's judged reliably accurate — since this site's dates genuinely are accurate (real frontmatter dates, not auto-generated build timestamps), it should qualify, but the upside is a modest crawl-efficiency signal, not a ranking lever. Slightly more implementation effort than #1/#2 since it requires wiring content-collection data into the integration config.

### 4. Set `og:type="article"` + `article:published_time` / `article:modified_time` on blog posts

**Files:** `src/components/BaseHead.astro` (currently hardcodes `og:type` to `"website"` for every page) and `src/layouts/SiteLayout.astro`/`BlogPost.astro` (would need to pass a `type` prop through)
**Why:** verified — `og:type` is currently `"website"` even on post pages. The Open Graph `article` type plus its `article:*` extension properties is the documented way to tell OG-consuming platforms (link-preview generators, some social platforms) that a URL is a dated article rather than a generic page.
**Confidence: plausible, modest impact.** This affects social-preview and OG-parser behavior, not Google ranking or AI-answer citation directly — no primary source in this research ties `og:type` to search or AI-citation outcomes. Included because it's cheap, invisible on-page, and closes an actual gap between "this is a `BlogPosting` in JSON-LD" and "this is `website` in OG" for the same URL.

### 5. Decide, explicitly, whether to split AI crawlers in `robots.txt` — informational, not a fix

**File:** `public/robots.txt`
**What this is:** currently `Allow: /` under `User-agent: *` permits every crawler, AI training bots included (`GPTBot`, `ClaudeBot`, `Google-Extended`, `CCBot`) and AI retrieval bots (`OAI-SearchBot`, `Claude-SearchBot`, `Claude-User`, `PerplexityBot`, `Perplexity-User`) alike. Anthropic's own documentation (fetched directly) confirms these are independently controllable per bot — it's possible to block only the training bots while leaving the retrieval/answer bots (the ones that can actually cite this site in a live AI answer) allowed.
**Why this is listed but not prescribed:** whether to block AI training crawlers is a values decision (does the author want project write-ups used as LLM training data or not), not a technical improvement — there's no visibility or ranking upside to blocking them, and the current all-allow posture is a defensible, common choice for someone who wants maximum reach. This is presented as a decision point the user should make deliberately rather than by default, not a recommendation to change anything.
**Confidence: solid on the facts** (what each bot does, and that they're independently controllable — both confirmed via Anthropic's own docs), **but the recommendation itself is a preference call, not an evidenced improvement.**

### Explicitly not recommended (researched and ruled out)

- **Migrating `BlogPosting` → `TechArticle`**: Google's own Article documentation doesn't even list `TechArticle` as a supported type for Article rich results; no eligibility difference exists. Keep `BlogPosting` — it also better matches the site's personal-blog voice.
- **`BreadcrumbList`**: doesn't require visible UI, so it wouldn't violate minimalism, but with a two-level hierarchy (blog → post) the payoff is low. Not worth prioritizing over the five above.
- **`SoftwareApplication` schema on project posts**: schema.org's expected fields (`aggregateRating`, `offers`, `operatingSystem`, etc.) don't map onto small CLI/side-project write-ups without fabricating data, risking Search Console structured-data errors for no evidenced benefit.
- **`llms.txt` / `llms-full.txt`**: no primary source from OpenAI, Anthropic, Google, or Perplexity confirms their crawlers consume it normatively; one study found it added noise rather than signal to citation-prediction models. Speculative, not evidenced — not recommended at this time. Worth revisiting if a major AI vendor publishes primary documentation committing to consuming it.
- **Any Core Web Vitals work**: per Part 2 §5, INP is architecturally close to a non-issue for this site, and LCP/CLS are already well-handled by static output + explicit image dimensions. Nothing here is currently at risk.
- **IndexNow scoping (submit only changed URLs instead of the whole sitemap every deploy)**: real inefficiency, verified in Part 1, but low urgency — IndexNow doesn't penalize resubmission, so this is a "nice to have" for deploy speed, not a visibility fix. Left out of the top 5 by design, per the instruction not to pad with lower-confidence/lower-impact items.
- **Any visible additions** (breadcrumb UI, AI-disclosure badges, author bio boxes, visible "last updated" rows beyond what already exists, rating badges): none proposed. All five recommendations above are metadata-only and invisible on the rendered page, consistent with the site's restrained, dark, Japanese-minimalist direction and the deliberate sparse-metadata choices already made in this project.
