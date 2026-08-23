# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Astro dev server
npm run build     # production build to dist/
npm run preview   # serve the production build locally
npm run check     # astro check (type-checks .astro files + content schema)
npx prettier --write .   # formatting (prettier-plugin-astro + prettier-plugin-tailwindcss)
```

There is no ESLint config and no test suite. `astro check` + `prettier` are the only checks; run both before considering a change done.

## Architecture

**Content collection.** Blog posts are `.mdx`/`.md` files in `src/content/blog/`, loaded via `glob()` and validated by the schema in `src/content.config.ts`: `title`, `description`, `pubDate` (coerced date), optional `updatedDate`, optional `heroImage` (an `image()` reference — pass an import-style string path, e.g. `'@assets/blog/foo.webp'`, not a URL), `heroImageAlt`, `category`, `tags`. Hero images live in `src/assets/blog/`.

**Manual post registries in `src/consts.ts`.** `FEATURED_POSTS` (slugs shown on `/featured`) and `SHIPPED` (project cards on the homepage) are hardcoded arrays of slugs/hrefs — adding a new blog post file does **not** automatically surface it there. Update these by hand when a post should appear.

**Path aliases** (`tsconfig.json` + `astro.config.mjs`, keep both in sync): `@components/*`, `@layouts/*`, `@assets/*`, `@styles/*`, `@scripts/*`, `@/*` → `src/*`.

**Style cascade.** Everything funnels through `src/styles/__root.css`, imported once from `BaseHead.astro`, in this order: `tailwindcss` → `@tailwindcss/typography` plugin → `fonts.css` → `variables.css` (light tokens on `:root`) → `variables-dark.css` (dark tokens, re-declared under `@media (prefers-color-scheme: dark)`) → `theme.css` (maps the raw `--bg-primary`/`--text-*`/etc. vars into Tailwind `@theme` tokens like `--color-surface-primary`) → `global.css`. Order matters: the dark media-query block must load after the light `:root` block to win the cascade.

**Dark mode is media-query only** — there is no class-based toggle, no `data-theme` attribute, and no theme switcher UI. `dark:` Tailwind variants (e.g. `dark:prose-invert` in `BlogPost.astro`) rely on Tailwind v4's default `prefers-color-scheme` strategy. The dark `theme-color` meta tag in `BaseHead.astro` and `variables-dark.css` must be kept in sync manually if palette colors change.

**Table of contents** (`BlogPost.astro`) is generated client-side from `article h2, article h3` after render, and only shown if the post has 2+ headings (otherwise the `#toc-sidebar` is hidden). It only appears at the `xl` breakpoint — there is no mobile/tablet ToC.

**Reading time** (`ReadingTime.astro`) is a naive word count of the raw MDX body string at 200wpm — this includes frontmatter-adjacent import lines and JSX in the count, not just prose.

**Pagination.** `BLOG_PAGE_SIZE = 8` (in `consts.ts`) drives `/blog/page/[page]`, `/blog/category/[category]/page/[page]`, and `/blog/tag/[tag]/page/[page]`. Category/tag values are derived from post frontmatter, not a separate taxonomy file.

**Fonts** are self-hosted under `public/fonts` (no external font CDN) and preloaded explicitly in `BaseHead.astro`: Bytesized (display/headings), DM Sans (body), DM Mono (code). If you add a font, add both the `@font-face` and a matching preload link.

## Deploy

Pushing to the **`production`** branch (not `main`) triggers `.github/workflows/*` → build → sync to S3 → CloudFront invalidation → IndexNow submission (`src/scripts/indexnow.ts`, needs `INDEXNOW_KEY`). S3 sync runs in two passes: HTML/JSON/XML/txt are uploaded first with `no-cache`, then hashed assets (JS/CSS/fonts/images) are synced with a 1-year immutable cache and `--delete` (deletion runs last on purpose, so nothing is removed before the no-cache pass completes). `main` is the working branch; merging/pushing to `production` is what actually ships.
