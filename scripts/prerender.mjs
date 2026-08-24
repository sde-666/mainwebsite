// scripts/prerender.mjs
//
// Runs AFTER `vite build` (see the "build" script in package.json — this is
// only wired into the script that Netlify runs; Render's "build:server"
// script is untouched and never calls this file).
//
// What it does:
//   1. Builds a small, separate Node-side SSR bundle of the app
//      (src/_prerender-entry.tsx) into a throwaway temp folder.
//   2. Reads the list of routes from public/sitemap.xml, so new pages you
//      add to the sitemap are picked up automatically next deploy.
//   3. For each route, renders the real App component to an HTML string
//      (via jsdom + react-dom/server — no headless browser needed) and
//      writes it into dist/<route>/index.html, using the ALREADY-BUILT
//      dist/index.html as the template (so script/css tags always match
//      the current build's hashed filenames — nothing goes stale).
//
// Safety: this script is best-effort only. If anything goes wrong, it logs
// a warning and exits 0 (success) so it can NEVER cause `npm run build` —
// and therefore your Netlify deploy — to fail. Worst case, this step
// silently does nothing and your site builds and deploys exactly as it
// does today.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { build as viteBuild } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const TMP_SSR_DIR = path.join(ROOT, '.prerender-tmp');

async function safeMain() {
  const indexHtmlPath = path.join(DIST, 'index.html');
  if (!fs.existsSync(indexHtmlPath)) {
    console.warn('[prerender] dist/index.html not found, skipping prerender step.');
    return;
  }

  const routes = readRoutesFromSitemap();
  if (routes.length === 0) {
    console.warn('[prerender] No routes found in public/sitemap.xml, skipping.');
    return;
  }

  console.log(`[prerender] Building SSR snapshot bundle for ${routes.length} routes...`);
  const reactPlugin = (await import('@vitejs/plugin-react')).default;
  const tailwindPlugin = (await import('@tailwindcss/vite')).default;
  await viteBuild({
    root: ROOT,
    configFile: false,
    plugins: [reactPlugin(), tailwindPlugin()],
    resolve: {
      alias: [
        { find: /^react-dom$/, replacement: path.join(__dirname, 'prerender-react-dom-shim.mjs') },
        { find: '@', replacement: ROOT },
      ],
    },
    build: {
      ssr: path.join(ROOT, 'src', '_prerender-entry.tsx'),
      outDir: TMP_SSR_DIR,
      emptyOutDir: true,
      write: true,
      minify: false,
    },
    logLevel: 'warn',
  });

  const bundlePath = path.join(TMP_SSR_DIR, '_prerender-entry.js');
  if (!fs.existsSync(bundlePath)) {
    console.warn('[prerender] SSR bundle build did not produce expected output, skipping.');
    return;
  }

  await import('fake-indexeddb/auto');
  const { JSDOM } = await import('jsdom');
  const { renderRouteToHtml } = await import(pathToFileURL(bundlePath).href);

  const indexTemplate = fs.readFileSync(indexHtmlPath, 'utf-8');
  let okCount = 0;
  let failCount = 0;

  for (const route of routes) {
    try {
      setupJsdomGlobals(JSDOM, 'http://localhost' + route);
      const rawHtml = renderRouteToHtml();
      const { headHtml, bodyHtml } = splitHeadAndBody(rawHtml);
      let outHtml = indexTemplate.replace(
        '<div id="root"></div>',
        `<div id="root">${bodyHtml}</div>`
      );
      outHtml = applyPageHeadTags(outHtml, headHtml);
      const outFile = route === '/'
        ? path.join(DIST, 'index.html')
        : path.join(DIST, route.replace(/^\//, ''), 'index.html');
      fs.mkdirSync(path.dirname(outFile), { recursive: true });
      fs.writeFileSync(outFile, outHtml, 'utf-8');
      okCount++;
    } catch (err) {
      failCount++;
      console.warn(`[prerender] Skipped ${route}: ${err && err.message ? err.message : err}`);
    }
  }

  console.log(`[prerender] Done. ${okCount} pages snapshotted, ${failCount} skipped.`);

  try {
    fs.rmSync(TMP_SSR_DIR, { recursive: true, force: true });
  } catch {
    // non-fatal cleanup failure, ignore
  }
}

// The app renders page-specific <title>/<meta>/<link> tags (via its own
// Helmet-based SEO component) as literal elements at the START of the React
// tree, right before the real Layout wrapper div. renderToStaticMarkup has
// no way to "teleport" these into <head> like a browser does, so they land
// inline inside <div id="root">, which is invalid there and ignored by
// crawlers. This splits that leading chunk off, and applyPageHeadTags()
// below copies the page-specific values into the REAL <head> of the output
// file, so each route gets its own correct <title>/description/OG tags
// instead of the generic homepage ones.
const LAYOUT_MARKER = '<div class="flex min-h-screen';

function splitHeadAndBody(rawHtml) {
  const idx = rawHtml.indexOf(LAYOUT_MARKER);
  if (idx <= 0) {
    return { headHtml: '', bodyHtml: rawHtml };
  }
  return { headHtml: rawHtml.slice(0, idx), bodyHtml: rawHtml.slice(idx) };
}

function applyPageHeadTags(outHtml, headHtml) {
  if (!headHtml) return outHtml;

  // IMPORTANT: react-helmet-async marks every tag it manages with a
  // data-rh="true" attribute, and on the client it looks specifically for
  // <title data-rh>, <meta data-rh>, <link data-rh> when it hydrates — so
  // it knows which existing tags are "its own" and can update/reuse them.
  // Without this attribute, Helmet doesn't recognise our pre-rendered tags
  // as its own and INSERTS a second copy of each one instead of reusing
  // it — that's exactly the "More than one title tag" / "More than one
  // canonical tag" errors Bing/Google flag.
  //
  // Fix, done generically (covers every tag SEO.tsx renders today AND any
  // it renders in future, without needing a hand-maintained list here):
  //   1. Tag every element in the rendered head chunk with data-rh="true".
  //   2. Remove the matching tags (same name="…" / property="…" / rel="…")
  //      from the static <head> in dist/index.html, so there's exactly
  //      one copy of each.
  //   3. Insert the freshly-rendered, data-rh-tagged chunk into <head>.
  // Once Helmet hydrates on the client, it finds these exact elements via
  // that attribute and takes over cleanly — no duplicates.

  const taggedHead = headHtml
    .replace(/<title>/, '<title data-rh="true">')
    .replace(/<meta\s/g, '<meta data-rh="true" ')
    .replace(/<link\s/g, '<link data-rh="true" ');

  const headEndIdx = outHtml.indexOf('</head>');
  if (headEndIdx === -1) return outHtml;
  let head = outHtml.slice(0, headEndIdx);
  const rest = outHtml.slice(headEndIdx);

  // The static template always has a <title>; the fresh one replaces it.
  if (/<title[ >]/.test(taggedHead)) {
    head = head.replace(/<title>[\s\S]*?<\/title>/, '');
  }

  // Remove any static <meta>/<link> tag whose identifying attribute
  // (name="…" / property="…" / rel="…") matches one present in the
  // freshly-rendered head chunk, so we end up with exactly one copy.
  const escapeRegex = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const collectKeys = (attr) => {
    const re = new RegExp(`<(?:meta|link)[^>]*\\s${attr}="([^"]+)"`, 'g');
    const keys = new Set();
    let m;
    while ((m = re.exec(taggedHead))) keys.add(m[1]);
    return keys;
  };

  for (const attr of ['name', 'property', 'rel']) {
    for (const key of collectKeys(attr)) {
      const staticTagRe = new RegExp(
        `<(?:meta|link)(?![^>]*data-rh)[^>]*\\s${attr}="${escapeRegex(key)}"[^>]*/?>`,
        'gi'
      );
      head = head.replace(staticTagRe, '');
    }
  }

  head = head.replace(/\n[ \t]*\n/g, '\n');
  return `${head}${taggedHead}${rest}`;
}

function setupJsdomGlobals(JSDOM, url) {
  const dom = new JSDOM('<!doctype html><html><body></body></html>', { url, pretendToBeVisual: true });
  const { window } = dom;
  window.matchMedia = window.matchMedia || (() => ({
    matches: false, addListener() {}, removeListener() {}, addEventListener() {}, removeEventListener() {},
  }));
  window.IntersectionObserver = class { observe() {} unobserve() {} disconnect() {} };
  window.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };
  window.scrollTo = () => {};

  global.window = window;
  global.document = window.document;
  Object.defineProperty(global, 'navigator', { value: window.navigator, configurable: true });
  global.localStorage = window.localStorage;
  global.sessionStorage = window.sessionStorage;
  global.HTMLElement = window.HTMLElement;
  global.location = window.location;
  global.requestAnimationFrame = (cb) => setTimeout(cb, 0);
  global.cancelAnimationFrame = (id) => clearTimeout(id);
  global.self = global.window;
}

function readRoutesFromSitemap() {
  const sitemapPath = path.join(ROOT, 'public', 'sitemap.xml');
  if (!fs.existsSync(sitemapPath)) return [];
  const xml = fs.readFileSync(sitemapPath, 'utf-8');
  const matches = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
  const routes = matches
    .map((u) => {
      try {
        return new URL(u).pathname;
      } catch {
        return null;
      }
    })
    .filter(Boolean)
    // Skip dynamic per-user/admin/auth-only areas — not useful to prerender
    // and safest to leave untouched.
    .filter((p) => !p.startsWith('/admin'));
  return [...new Set(routes)];
}

safeMain()
  .catch((err) => {
    console.warn('[prerender] Unexpected error, skipping prerender step (build continues):', err && err.message ? err.message : err);
  })
  .finally(() => {
    // Always exit 0 — this step must never fail the real build.
    process.exit(0);
  });
