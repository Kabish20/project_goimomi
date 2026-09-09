import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const frontendDirectory = path.resolve(scriptDirectory, '..');
const distDirectory = path.join(frontendDirectory, 'dist');
const sourceIndex = path.join(distDirectory, 'index.html');
const metadataFile = path.join(scriptDirectory, 'seo-pages.json');
const siteUrl = 'https://goimomi.com';

if (!fs.existsSync(sourceIndex)) {
  throw new Error(`Cannot generate SEO pages because ${sourceIndex} does not exist.`);
}

const baseHtml = fs.readFileSync(sourceIndex, 'utf8');
const pages = JSON.parse(fs.readFileSync(metadataFile, 'utf8'));

const escapeHtml = (value) => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('"', '&quot;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;');

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const setMeta = (html, attributeName, attributeValue, content) => {
  const escapedAttributeName = escapeRegExp(attributeName);
  const escapedAttributeValue = escapeRegExp(attributeValue);
  const tagPattern = new RegExp(
    `<meta\\s+(?=[^>]*\\b${escapedAttributeName}\\s*=\\s*["']${escapedAttributeValue}["'])[^>]*>`,
    'i'
  );
  const tag = `<meta ${attributeName}="${escapeHtml(attributeValue)}" content="${escapeHtml(content)}" />`;
  return tagPattern.test(html)
    ? html.replace(tagPattern, tag)
    : html.replace('</head>', `  ${tag}\n\n</head>`);
};

const setCanonical = (html, url) => {
  const canonicalPattern = /<link\s+(?=[^>]*\brel\s*=\s*["']canonical["'])[^>]*>/i;
  const tag = `<link rel="canonical" href="${escapeHtml(url)}" />`;
  return canonicalPattern.test(html)
    ? html.replace(canonicalPattern, tag)
    : html.replace('</head>', `  ${tag}\n\n</head>`);
};

const setRobots = (html, content) => setMeta(html, 'name', 'robots', content);

const findBuiltImage = (imageStem) => {
  const assetsDirectory = path.join(distDirectory, 'assets');
  const imageExtensions = new Set(['.avif', '.gif', '.jpeg', '.jpg', '.png', '.webp']);
  const matches = [];

  const walk = (directory) => {
    if (!fs.existsSync(directory)) return;
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
      const entryPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        walk(entryPath);
      } else if (
        imageExtensions.has(path.extname(entry.name).toLowerCase())
        && entry.name.toLowerCase().startsWith(imageStem.toLowerCase())
      ) {
        matches.push(entryPath);
      }
    }
  };

  walk(assetsDirectory);
  return matches[0];
};

const resolveImage = (image) => {
  if (!image) return `${siteUrl}/logo.png`;
  if (/^https?:\/\//i.test(image)) return image;
  if (image.startsWith('/')) {
    const rawPath = image.slice(1);
    const distPath = path.join(distDirectory, rawPath);
    // WhatsApp strictly drops images >300KB. Prefer lightweight, highly compressed .jpg if available!
    const jpgCandidate = distPath.replace(/\.png$/i, '.jpg');
    if (fs.existsSync(jpgCandidate)) {
      return `${siteUrl}/${rawPath.replace(/\.png$/i, '.jpg')}`;
    }
    if (fs.existsSync(distPath)) {
      return `${siteUrl}${image}`;
    }
    throw new Error(`SEO image "${image}" was not found in dist.`);
  }

  const builtImage = findBuiltImage(image);
  if (!builtImage) {
    console.warn(`SEO image "${image}" was not found in dist/assets; using /logo.png.`);
    return `${siteUrl}/logo.png`;
  }

  const relativeImage = path.relative(distDirectory, builtImage).split(path.sep).join('/');
  return `${siteUrl}/${relativeImage}`;
};

const renderPage = (page) => {
  const route = page.route === '/' ? '/' : `/${page.route.replace(/^\/+|\/+$/g, '')}`;
  const canonicalRoute = page.canonical || route;
  const canonicalClean = canonicalRoute === '/' ? '' : canonicalRoute.replace(/^\/+|\/+$/g, '');
  // Trailing slash avoids Nginx 301 redirect delays for social crawlers
  const pageUrl = canonicalClean ? `${siteUrl}/${canonicalClean}/` : `${siteUrl}/`;
  const imageUrl = resolveImage(page.image);
  let html = baseHtml.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeHtml(page.title)}</title>`);

  const isPng = imageUrl.toLowerCase().endsWith('.png');
  const imageMime = isPng ? 'image/png' : 'image/jpeg';

  html = setMeta(html, 'name', 'description', page.description);
  html = setMeta(html, 'name', 'keywords', page.keywords || '');
  html = setMeta(html, 'itemprop', 'name', page.title);
  html = setMeta(html, 'itemprop', 'description', page.description);
  html = setMeta(html, 'itemprop', 'image', imageUrl);

  html = setMeta(html, 'property', 'og:type', 'website');
  html = setMeta(html, 'property', 'og:site_name', 'Goimomi Holidays');
  html = setMeta(html, 'property', 'og:locale', 'en_US');
  html = setMeta(html, 'property', 'og:url', pageUrl);
  html = setMeta(html, 'property', 'og:title', page.title);
  html = setMeta(html, 'property', 'og:description', page.description);
  html = setMeta(html, 'property', 'og:image', imageUrl);
  html = setMeta(html, 'property', 'og:image:secure_url', imageUrl);
  html = setMeta(html, 'property', 'og:image:type', imageMime);
  html = setMeta(html, 'property', 'og:image:width', '1200');
  html = setMeta(html, 'property', 'og:image:height', '630');
  html = setMeta(html, 'property', 'og:image:alt', `${page.title} | Goimomi Holidays`);

  html = setMeta(html, 'name', 'twitter:card', 'summary_large_image');
  html = setMeta(html, 'name', 'twitter:url', pageUrl);
  html = setMeta(html, 'name', 'twitter:title', page.title);
  html = setMeta(html, 'name', 'twitter:description', page.description);
  html = setMeta(html, 'name', 'twitter:image', imageUrl);
  html = setMeta(html, 'name', 'twitter:image:alt', `${page.title} | Goimomi Holidays`);

  html = setRobots(html, page.indexable === false ? 'noindex, nofollow' : 'index, follow');
  html = setCanonical(html, pageUrl);
  return html;
};

for (const page of pages) {
  if (!page.route.startsWith('/') || page.route.includes('..')) {
    throw new Error(`Invalid SEO route: ${page.route}`);
  }

  const routeDirectory = page.route === '/'
    ? distDirectory
    : path.join(distDirectory, page.route.replace(/^\/+|\/+$/g, ''));
  fs.mkdirSync(routeDirectory, { recursive: true });
  fs.writeFileSync(path.join(routeDirectory, 'index.html'), renderPage(page));
}

const sitemapPages = pages.filter((page) => page.indexable !== false);
const sitemapEntries = sitemapPages.map((page) => {
  const route = page.canonical || page.route;
  const url = route === '/' ? siteUrl : `${siteUrl}${route}`;
  return `  <url>\n    <loc>${escapeHtml(url)}</loc>\n  </url>`;
}).join('\n');

fs.writeFileSync(
  path.join(distDirectory, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapEntries}\n</urlset>\n`
);

console.log(`Generated crawler-readable SEO pages for ${pages.length} public routes.`);
console.log(`Generated sitemap.xml with ${sitemapPages.length} indexable routes.`);
