import fs from 'fs';
import https from 'https';
import http from 'http';

// We need to dynamically import the module
async function main() {
  const { HERO_DATA, TOP10_DATA, CATEGORY_CATALOG, BENTO_DATA, NEWS_CAROUSEL_DATA, AESTHETIC_QUOTES } = await import('./src/utils/movieData.js');

  const brokenAssets = [];
  const urlsToCheck = new Set();
  const urlToContext = new Map();
  const categoryCounts = [];
  const missingTrailers = [];

  function addUrl(url, vertical, component) {
    if (!url) return;
    if (url.startsWith('/')) return; // skip local placeholders
    urlsToCheck.add(url);
    if (!urlToContext.has(url)) {
      urlToContext.set(url, []);
    }
    urlToContext.get(url).push({ vertical, component });
  }

  // Parse HERO_DATA
  for (const [vertical, items] of Object.entries(HERO_DATA)) {
    for (const item of items) {
      addUrl(item.backdrop_path, vertical, 'hero backdrop');
      addUrl(item.poster_path, vertical, 'poster');
      if (!item.trailer && !item.trailerId && !item.videoKey) { // we'll flag any entry missing trailer
        missingTrailers.push(`${vertical} Hero: ${item.title}`);
      }
    }
  }

  // Parse TOP10_DATA
  for (const [vertical, items] of Object.entries(TOP10_DATA)) {
    for (const item of items) {
      addUrl(item.backdrop_path, vertical, 'hero backdrop (top 10)');
      addUrl(item.poster_path, vertical, 'poster (top 10)');
      if (!item.trailer && !item.trailerId && !item.videoKey) {
        missingTrailers.push(`${vertical} Top 10: ${item.title}`);
      }
    }
  }

  // Parse CATEGORY_CATALOG
  for (const [category, items] of Object.entries(CATEGORY_CATALOG)) {
    categoryCounts.push({ category, count: items.length });
    for (const item of items) {
      addUrl(item.backdrop_path, 'catalog', `backdrop (${category})`);
      addUrl(item.poster_path, 'catalog', `poster (${category})`);
      if (!item.trailer && !item.trailerId && !item.videoKey) {
        missingTrailers.push(`Catalog [${category}]: ${item.title}`);
      }
    }
  }

  // Parse BENTO_DATA
  if (BENTO_DATA) {
    for (const [vertical, items] of Object.entries(BENTO_DATA)) {
      if (items.spotlight) addUrl(items.spotlight.image, vertical, 'bento spotlight');
      if (items.tallFeature) addUrl(items.tallFeature.image, vertical, 'bento tall feature');
      if (items.soundtrackCard) addUrl(items.soundtrackCard.image, vertical, 'OST art');
    }
  }

  // Parse NEWS_CAROUSEL_DATA
  if (NEWS_CAROUSEL_DATA) {
    for (const [vertical, items] of Object.entries(NEWS_CAROUSEL_DATA)) {
      for (const item of items) {
        addUrl(item.image, vertical, 'news thumbnail');
      }
    }
  }

  function checkUrl(url) {
    return new Promise((resolve) => {
      const client = url.startsWith('https') ? https : http;
      const req = client.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Referer': 'http://localhost:5173/'
        }
      }, (res) => {
        // Flag 404s, 403s, 401s, 500s, redirects to a placeholder (e.g., imgur removed)
        if (res.statusCode >= 400 || (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location && res.headers.location.includes('removed'))) {
          resolve({ url, status: res.statusCode, ok: false, redirect: res.headers.location });
        } else {
          resolve({ url, status: res.statusCode, ok: true });
        }
      }).on('error', (err) => {
        resolve({ url, status: err.message, ok: false });
      });
      req.setTimeout(5000, () => {
        req.destroy();
        resolve({ url, status: 'timeout', ok: false });
      });
    });
  }

  console.log(`Checking ${urlsToCheck.size} URLs...`);
  
  const results = [];
  const urls = Array.from(urlsToCheck);
  // Batch check to avoid overwhelming
  const batchSize = 10;
  for (let i = 0; i < urls.length; i += batchSize) {
    const batch = urls.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(checkUrl));
    results.push(...batchResults);
    process.stdout.write('.');
  }
  console.log('\nDone checking URLs.');

  const broken = results.filter(r => !r.ok);
  
  let md = `# Broken Assets Audit\n\n`;

  md += `## Broken URLs\n`;
  for (const b of broken) {
    const contexts = urlToContext.get(b.url);
    md += `\n### URL: ${b.url}\n`;
    md += `- **Status**: ${b.status} ${b.redirect ? `(Redirects to: ${b.redirect})` : ''}\n`;
    md += `- **Consumed by**:\n`;
    for (const ctx of contexts) {
      md += `  - ${ctx.vertical}: ${ctx.component}\n`;
    }
  }

  md += `\n## Category Counts\n`;
  for (const { category, count } of categoryCounts) {
    if (count < 12) {
      md += `- **[FLAG]** ${category}: ${count} entries (Under 12)\n`;
    } else {
      md += `- ${category}: ${count} entries\n`;
    }
  }

  md += `\n## Missing Trailers\n`;
  md += `Total entries missing trailer ID: ${missingTrailers.length}\n`;
  
  // Just listing the first few missing trailers since practically ALL of them are missing a trailer ID based on visual inspection of the file.
  if (missingTrailers.length > 0) {
    md += `<details><summary>Click to view all ${missingTrailers.length}</summary>\n\n`;
    for (const mt of missingTrailers) {
      md += `- ${mt}\n`;
    }
    md += `\n</details>\n`;
  }

  fs.writeFileSync('broken-assets.md', md);
  console.log('Saved to broken-assets.md');
}

main().catch(console.error);
