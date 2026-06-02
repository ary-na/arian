import { readFileSync } from 'fs';

const KEY = process.env.INDEXNOW_KEY;
if (!KEY) {
  console.error('INDEXNOW_KEY environment variable is not set');
  process.exit(1);
}

const HOST = 'arii.dev';

// Read sitemap index to discover all sitemap files
const index = readFileSync('dist/sitemap-index.xml', 'utf-8');
const sitemapFiles = [...index.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);

// Extract all URLs from every sitemap file
const urls: string[] = [];
for (const sitemapUrl of sitemapFiles) {
  const filename = `dist/${sitemapUrl.split('/').pop()}`;
  try {
    const content = readFileSync(filename, 'utf-8');
    const found = [...content.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1]);
    urls.push(...found);
  } catch {
    console.warn(`Could not read ${filename}`);
  }
}

console.log(`Submitting ${urls.length} URLs to IndexNow...`);

for (const url of urls) {
  try {
    const res = await fetch(
      `https://api.indexnow.org/indexnow?url=${encodeURIComponent(url)}&key=${KEY}&keyLocation=${encodeURIComponent(`https://${HOST}/${KEY}.txt`)}`,
      { method: 'GET' },
    );
    console.log(`${res.status} — ${url}`);
  } catch (err) {
    console.error(`Failed to submit ${url}:`, err);
  }
  await new Promise((r) => setTimeout(r, 500));
}
