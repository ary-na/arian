import { readFileSync } from 'fs';

const KEY = process.env.INDEXNOW_KEY;
const sitemap = readFileSync('dist/sitemap-0.xml', 'utf-8');
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);

for (const url of urls) {
  const res = await fetch(
    `https://api.indexnow.org/indexnow?url=${encodeURIComponent(url)}&key=${KEY}`,
    { method: 'GET' },
  );
  console.log(`${res.status} — ${url}`);
  await new Promise((r) => setTimeout(r, 500));
}
