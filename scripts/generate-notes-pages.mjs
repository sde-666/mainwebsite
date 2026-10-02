// scripts/generate-notes-pages.mjs
//
// Runs at the very end of `npm run build` (after scripts/prerender.mjs).
//
// WHY THIS EXISTS (SEO)
// ---------------------
// Your notes live in Firestore and are loaded by JavaScript AFTER the page
// opens. A search engine that does not wait for that (or that renders it late)
// sees an almost empty page, so the notes can never rank. This script fetches
// every course / chapter / topic at build time and writes a real, static HTML
// page for each one:
//
//   /notes/<course>                      -> course overview (links to chapters)
//   /notes/<course>/<chapter>            -> chapter overview (links to topics)
//   /notes/<course>/<chapter>/<topic>    -> the full note, ready to be indexed
//
// Each page gets its own <title>, meta description, canonical URL, Open Graph
// tags, BreadcrumbList + Article JSON-LD, and plain <a href> links to the
// neighbouring pages (internal linking). When a visitor opens the page the
// React notes reader starts and replaces this static HTML, so users still
// get the normal reader experience.
//
// It also appends every generated URL to dist/sitemap.xml.
//
// Safe by design: any problem is logged and the script exits 0, so it can
// never break your Netlify deploy.
//
// Optional environment variables
//   NOTES_SEO_FIXTURE=path.json   use a local JSON file instead of Firestore (testing)
//   NOTES_SEO_MAX_WORDS=300       only put the first N words of each note in the static HTML
//                                 (0 / unset = full note). See the README note in the chat.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const SITE = 'https://skilldotpy.com';
const BRAND = 'Skilldotpy';
const AUTHOR = 'Mr. Aditya Pathak';
const MAX_WORDS = parseInt(process.env.NOTES_SEO_MAX_WORDS || '0', 10) || 0;

// --------------------------------------------------------------------------
// Small helpers
// --------------------------------------------------------------------------
const esc = (s) =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const stripHtml = (html) =>
  String(html || '')
    .replace(/<(script|style)[\s\S]*?<\/\1>/gi, ' ')
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();

const firstWords = (text, n) => text.split(/\s+/).slice(0, n).join(' ');

// Same 60-char title and 155-char description rules as src/components/SEO.tsx
function formatTitle(title) {
  if (title.includes(BRAND)) return title.length > 60 ? title.slice(0, 57).trim() + '...' : title;
  const withBrand = `${title} | ${BRAND}`;
  if (withBrand.length <= 60) return withBrand;
  const max = 60 - BRAND.length - 3;
  return `${title.slice(0, max).trim()}... | ${BRAND}`;
}
function formatDescription(raw) {
  raw = (raw || '').trim();
  if (raw.length <= 155) return raw;
  const t = raw.slice(0, 152);
  const sp = t.lastIndexOf(' ');
  return (sp > 100 ? t.slice(0, sp) : t).trim() + '...';
}

// Remove anything dangerous from admin-authored HTML before it is written to a static file
function cleanContent(html) {
  return String(html || '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<iframe[\s\S]*?<\/iframe>/gi, '')
    .replace(/\son[a-z]+\s*=\s*("[^"]*"|'[^']*')/gi, '')
    .replace(/javascript:/gi, '');
}

function limitWords(html, maxWords) {
  if (!maxWords) return html;
  const text = stripHtml(html);
  if (text.split(/\s+/).length <= maxWords) return html;
  return `<p>${esc(firstWords(text, maxWords))}…</p>`;
}

const isoDate = (ms) => {
  const d = ms ? new Date(Number(ms)) : new Date();
  return (isNaN(d.getTime()) ? new Date() : d).toISOString();
};

// --------------------------------------------------------------------------
// Data: Firestore REST API (your rules allow public reads on notes_*)
// --------------------------------------------------------------------------
function fromFsValue(v) {
  if (!v || typeof v !== 'object') return undefined;
  if ('stringValue' in v) return v.stringValue;
  if ('integerValue' in v) return Number(v.integerValue);
  if ('doubleValue' in v) return Number(v.doubleValue);
  if ('booleanValue' in v) return v.booleanValue;
  if ('timestampValue' in v) return Date.parse(v.timestampValue);
  if ('nullValue' in v) return null;
  if ('arrayValue' in v) return (v.arrayValue.values || []).map(fromFsValue);
  if ('mapValue' in v) {
    const o = {};
    for (const [k, val] of Object.entries(v.mapValue.fields || {})) o[k] = fromFsValue(val);
    return o;
  }
  return undefined;
}

async function fetchCollection(cfg, name) {
  const dbId = cfg.firestoreDatabaseId || '(default)';
  const base = `https://firestore.googleapis.com/v1/projects/${cfg.projectId}/databases/${encodeURIComponent(dbId)}/documents/${name}`;
  const out = [];
  let pageToken = '';
  do {
    const url = `${base}?pageSize=300&key=${cfg.apiKey}${pageToken ? `&pageToken=${encodeURIComponent(pageToken)}` : ''}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Firestore ${name}: HTTP ${res.status}`);
    const json = await res.json();
    for (const d of json.documents || []) {
      const obj = {};
      for (const [k, v] of Object.entries(d.fields || {})) obj[k] = fromFsValue(v);
      if (!obj.id) obj.id = d.name.split('/').pop();
      out.push(obj);
    }
    pageToken = json.nextPageToken || '';
  } while (pageToken);
  return out;
}

async function loadData() {
  if (process.env.NOTES_SEO_FIXTURE) {
    const f = JSON.parse(fs.readFileSync(process.env.NOTES_SEO_FIXTURE, 'utf-8'));
    return { courses: f.courses || [], chapters: f.chapters || [], topics: f.topics || [] };
  }
  const cfg = JSON.parse(fs.readFileSync(path.join(ROOT, 'firebase-applet-config.json'), 'utf-8'));
  const [courses, chapters, topics] = await Promise.all([
    fetchCollection(cfg, 'notes_courses'),
    fetchCollection(cfg, 'notes_chapters'),
    fetchCollection(cfg, 'notes_topics'),
  ]);
  return { courses, chapters, topics };
}

// --------------------------------------------------------------------------
// Template (clean shell saved by the build script BEFORE prerender touched it)
// --------------------------------------------------------------------------
function loadShell() {
  const p = path.join(DIST, '_shell.html');
  if (!fs.existsSync(p)) throw new Error('dist/_shell.html missing (build script must copy dist/index.html first)');
  let html = fs.readFileSync(p, 'utf-8');
  // strip the generic homepage SEO tags so each page gets only its own
  html = html
    .replace(/<title[^>]*>[\s\S]*?<\/title>/gi, '')
    .replace(/<meta\s+name="(description|keywords|robots|googlebot|bingbot|author|twitter:[^"]+)"[^>]*>/gi, '')
    .replace(/<meta\s+property="(og:[^"]+)"[^>]*>/gi, '')
    .replace(/<link\s+rel="canonical"[^>]*>/gi, '')
    .replace(/<script\s+type="application\/ld\+json"[^>]*>[\s\S]*?<\/script>/gi, '');
  return html;
}

function renderPage(shell, { title, description, canonical, jsonLd, bodyHtml, ogType = 'article' }) {
  const t = formatTitle(title);
  const d = formatDescription(description);
  const head = `
    <title data-rh="true">${esc(t)}</title>
    <meta data-rh="true" name="description" content="${esc(d)}" />
    <meta data-rh="true" name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <link data-rh="true" rel="canonical" href="${esc(canonical)}" />
    <meta data-rh="true" property="og:title" content="${esc(t)}" />
    <meta data-rh="true" property="og:description" content="${esc(d)}" />
    <meta data-rh="true" property="og:url" content="${esc(canonical)}" />
    <meta data-rh="true" property="og:type" content="${ogType}" />
    <meta data-rh="true" property="og:site_name" content="${BRAND}" />
    <meta data-rh="true" property="og:image" content="${SITE}/skilldotpy-logo.svg" />
    <meta data-rh="true" name="twitter:card" content="summary_large_image" />
    <meta data-rh="true" name="twitter:title" content="${esc(t)}" />
    <meta data-rh="true" name="twitter:description" content="${esc(d)}" />
    <script id="seo-jsonld" type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@graph': jsonLd }).replace(/</g, '\\u003c')}</script>
  `;
  let html = shell.replace('</head>', `${head}</head>`);
  const start = html.indexOf('<div id="root">');
  const end = html.indexOf('</body>');
  if (start === -1 || end === -1) throw new Error('shell has no #root');
  const closeIdx = html.lastIndexOf('</div>', end);
  html = html.slice(0, start) + `<div id="root">${bodyHtml}</div>` + html.slice(closeIdx + 6);
  return html;
}

const STATIC_CSS = `
<style>
  .seo-page{max-width:62rem;margin:0 auto;padding:1.25rem 1rem 3rem;font-family:Inter,system-ui,-apple-system,'Segoe UI',Roboto,'Noto Sans Devanagari',sans-serif;color:#1f2937;line-height:1.8;font-size:17px}
  .seo-page h1{font-size:2rem;line-height:1.25;color:#0b1220;margin:.4rem 0 .6rem}
  .seo-page h2{font-size:1.4rem;color:#0b1220;margin:2rem 0 .6rem}
  .seo-page h3{font-size:1.15rem;color:#0b1220}
  .seo-page a{color:#2563eb}
  .seo-page nav.crumbs{font-size:.85rem;color:#6b7788}
  .seo-page pre{background:#0f172a;color:#e2e8f0;padding:1rem;border-radius:10px;overflow:auto}
  .seo-page table{border-collapse:collapse;width:100%}.seo-page td,.seo-page th{border:1px solid #e3e8f0;padding:.5rem .7rem;text-align:left}
  .seo-page ul.topic-list{padding-left:1.2rem}
  .seo-page .excerpt{color:#6b7788;font-size:.95rem}
</style>`;

const crumbHtml = (items) =>
  `<nav class="crumbs" aria-label="Breadcrumb">${items
    .map((i, idx) => (idx === items.length - 1 ? `<span>${esc(i.name)}</span>` : `<a href="${esc(i.url)}">${esc(i.name)}</a>`))
    .join(' › ')}</nav>`;

const crumbLd = (items) => ({
  '@type': 'BreadcrumbList',
  itemListElement: items.map((i, idx) => ({
    '@type': 'ListItem',
    position: idx + 1,
    name: i.name,
    item: i.url.startsWith('http') ? i.url : SITE + i.url,
  })),
});

const orgRef = { '@id': `${SITE}/#organization` };

// --------------------------------------------------------------------------
// Main
// --------------------------------------------------------------------------
async function main() {
  if (!fs.existsSync(DIST)) {
    console.warn('[notes-seo] dist/ not found, skipping.');
    return;
  }
  const { courses, chapters, topics } = await loadData();
  if (!topics.length) {
    console.warn('[notes-seo] No topics found in Firestore, skipping.');
    return;
  }
  const shell = loadShell();

  // Existing sitemap chapter URLs like /notes/m1-r5/m1-ch1 -> keep those paths for chapter pages
  const sitemapPath = path.join(DIST, 'sitemap.xml');
  let sitemapXml = fs.existsSync(sitemapPath) ? fs.readFileSync(sitemapPath, 'utf-8') : '';
  const existingLocs = new Set([...sitemapXml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim()));
  const existingPaths = [...existingLocs].map((u) => { try { return new URL(u).pathname; } catch { return ''; } });

  const sortedCourses = [...courses].sort((a, b) => (a.order || 0) - (b.order || 0));
  const newUrls = [];
  let pageCount = 0;

  const writePage = (urlPath, html) => {
    const file = path.join(DIST, urlPath.replace(/^\//, ''), 'index.html');
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, html, 'utf-8');
    pageCount++;
  };

  for (const course of sortedCourses) {
    const courseChapters = chapters
      .filter((c) => c.courseId === course.id)
      .sort((a, b) => (a.chapterNumber || a.order || 0) - (b.chapterNumber || b.order || 0));
    // de-duplicate by chapter number, same rule the reader uses
    const seenNum = new Set();
    const chapList = courseChapters.filter((c) => {
      const n = Number(c.chapterNumber) || 0;
      if (n > 0 && seenNum.has(n)) return false;
      if (n > 0) seenNum.add(n);
      return true;
    });

    const topicsFor = (ch) => {
      const seenT = new Set();
      return topics
        .filter((t) => t.courseId === course.id && t.chapterId === ch.id)
        .sort((a, b) => (a.order || 0) - (b.order || 0))
        .filter((t) => {
          const k = (t.title || '').trim().toLowerCase();
          if (!k || seenT.has(k)) return false;
          seenT.add(k);
          return true;
        });
    };

    const coursePath = `/notes/${course.id}`;
    const courseCrumb = [
      { name: 'Home', url: '/' },
      { name: 'Free O Level Notes', url: '/notes' },
      { name: course.title, url: coursePath },
    ];
    const courseLabel = `${course.badge || course.code} ${course.title}`;
    const courseWithTopics = chapList.filter((ch) => topicsFor(ch).length);

    // ---------- Course page ----------
    writePage(
      coursePath,
      renderPage(shell, {
        title: `${course.title} Notes (${course.badge || course.code}) - Free`,
        description: `Free NIELIT ${courseLabel} chapter-wise notes in simple English & Hindi. ${course.description || ''}`,
        canonical: SITE + coursePath,
        ogType: 'website',
        jsonLd: [
          crumbLd(courseCrumb),
          {
            '@type': 'CollectionPage',
            name: `${courseLabel} - Free Notes`,
            url: SITE + coursePath,
            description: course.description,
            isPartOf: { '@id': `${SITE}/#website` },
            publisher: orgRef,
          },
        ],
        bodyHtml: `${STATIC_CSS}<main class="seo-page">${crumbHtml(courseCrumb)}
          <h1>${esc(course.title)} – Free NIELIT ${esc(course.badge || course.code)} Notes</h1>
          ${course.hindiTitle ? `<p lang="hi">${esc(course.hindiTitle)}</p>` : ''}
          <p>${esc(course.description || '')}</p>
          <h2>Chapter-wise notes</h2>
          <ul class="topic-list">${courseWithTopics
            .map((ch) => `<li><a href="${coursePath}/${encodeURIComponent(ch.id)}">Chapter ${ch.chapterNumber}: ${esc(ch.title)}</a> <span class="excerpt">(${topicsFor(ch).length} topics)</span></li>`)
            .join('')}</ul></main>`,
      })
    );
    newUrls.push({ loc: SITE + coursePath, lastmod: isoDate(course.updatedAt), prio: '0.9' });

    for (const ch of chapList) {
      const chTopics = topicsFor(ch);
      if (!chTopics.length) continue;

      // Use the chapter URL already listed in your sitemap (e.g. /notes/m1-r5/m1-ch1) if there is one
      const sitemapAlt = existingPaths.find((p) => {
        const m = p.match(new RegExp(`^/notes/${course.id}/([^/]+)$`));
        if (!m || m[1] === ch.id) return false;
        const num = m[1].match(/ch(?:apter)?[-_]?(\d+)$/i);
        return num && parseInt(num[1], 10) === Number(ch.chapterNumber);
      });
      const chPath = sitemapAlt || `${coursePath}/${encodeURIComponent(ch.id)}`;
      const chCrumb = [...courseCrumb, { name: `Chapter ${ch.chapterNumber}: ${ch.title}`, url: chPath }];

      writePage(
        chPath,
        renderPage(shell, {
          title: `${ch.title} - ${course.badge || course.code} Chapter ${ch.chapterNumber} Notes`,
          description: ch.description || `Free ${courseLabel} notes: Chapter ${ch.chapterNumber} ${ch.title}. ${chTopics.length} topics explained in simple English & Hindi.`,
          canonical: SITE + chPath,
          ogType: 'website',
          jsonLd: [
            crumbLd(chCrumb),
            {
              '@type': 'CollectionPage',
              name: `Chapter ${ch.chapterNumber}: ${ch.title}`,
              url: SITE + chPath,
              isPartOf: { '@type': 'CollectionPage', name: course.title, url: SITE + coursePath },
              publisher: orgRef,
            },
          ],
          bodyHtml: `${STATIC_CSS}<main class="seo-page">${crumbHtml(chCrumb)}
            <h1>Chapter ${ch.chapterNumber}: ${esc(ch.title)} – ${esc(course.badge || course.code)} Notes</h1>
            ${ch.hindiTitle ? `<p lang="hi">${esc(ch.hindiTitle)}</p>` : ''}
            ${ch.description ? `<p>${esc(ch.description)}</p>` : ''}
            <h2>Topics in this chapter</h2>
            <ul class="topic-list">${chTopics
              .map((t) => `<li><a href="${coursePath}/${encodeURIComponent(ch.id)}/${encodeURIComponent(t.id)}"><strong>${esc(t.title)}</strong></a><div class="excerpt">${esc(firstWords(stripHtml(t.content), 30))}…</div></li>`)
              .join('')}</ul></main>`,
        })
      );
      newUrls.push({ loc: SITE + chPath, lastmod: isoDate(ch.updatedAt), prio: '0.8' });

      // ---------- Topic pages ----------
      chTopics.forEach((t, idx) => {
        const tPath = `${coursePath}/${encodeURIComponent(ch.id)}/${encodeURIComponent(t.id)}`;
        const prev = chTopics[idx - 1];
        const next = chTopics[idx + 1];
        const text = stripHtml(t.content);
        const desc =
          firstWords(text, 40) ||
          `${t.title} explained in simple words for NIELIT ${courseLabel}.`;
        const tCrumb = [...chCrumb.slice(0, -1), { name: `Chapter ${ch.chapterNumber}: ${ch.title}`, url: chPath }, { name: t.title, url: tPath }];
        const hasHindi = t.hindiContent && stripHtml(t.hindiContent).length > 20;
        const modified = isoDate(t.updatedAt || ch.updatedAt || course.updatedAt);

        writePage(
          tPath,
          renderPage(shell, {
            title: `${t.title} - ${course.badge || course.code} Notes`,
            description: desc,
            canonical: SITE + tPath,
            jsonLd: [
              crumbLd(tCrumb),
              {
                '@type': 'Article',
                '@id': `${SITE}${tPath}#article`,
                headline: t.title.slice(0, 110),
                description: formatDescription(desc),
                mainEntityOfPage: SITE + tPath,
                url: SITE + tPath,
                inLanguage: hasHindi ? ['en', 'hi'] : 'en',
                datePublished: modified,
                dateModified: modified,
                isAccessibleForFree: true,
                educationalLevel: 'NIELIT O Level',
                learningResourceType: 'Study notes',
                about: `${course.title} (${course.badge || course.code})`,
                author: { '@type': 'Person', name: AUTHOR },
                publisher: orgRef,
                image: `${SITE}/skilldotpy-logo.svg`,
                wordCount: text.split(/\s+/).filter(Boolean).length,
              },
            ],
            bodyHtml: `${STATIC_CSS}<main class="seo-page"><article>${crumbHtml(tCrumb)}
              <h1>${esc(t.title)}</h1>
              ${t.hindiTitle ? `<p lang="hi"><strong>${esc(t.hindiTitle)}</strong></p>` : ''}
              <p class="excerpt">${esc(course.badge || course.code)} · Chapter ${ch.chapterNumber}: ${esc(ch.title)}${t.readTime ? ` · ${esc(t.readTime)}` : ''}</p>
              <div>${limitWords(cleanContent(t.content), MAX_WORDS)}</div>
              ${hasHindi ? `<section lang="hi"><h2>${esc(t.hindiTitle || t.title)} (हिंदी में)</h2>${limitWords(cleanContent(t.hindiContent), MAX_WORDS)}</section>` : ''}
              </article>
              <nav aria-label="More topics"><h2>Continue reading</h2><ul class="topic-list">
                ${prev ? `<li>Previous: <a href="${coursePath}/${encodeURIComponent(ch.id)}/${encodeURIComponent(prev.id)}">${esc(prev.title)}</a></li>` : ''}
                ${next ? `<li>Next: <a href="${coursePath}/${encodeURIComponent(ch.id)}/${encodeURIComponent(next.id)}">${esc(next.title)}</a></li>` : ''}
                <li><a href="${chPath}">All topics in Chapter ${ch.chapterNumber}</a></li>
                <li><a href="${coursePath}">${esc(course.title)} – all chapters</a></li>
              </ul></nav></main>`,
          })
        );
        newUrls.push({ loc: SITE + tPath, lastmod: modified, prio: '0.7' });
      });
    }
  }

  // ---------- Sitemap: add every generated URL (skip ones already listed) ----------
  if (sitemapXml && newUrls.length) {
    const fresh = newUrls.filter((u) => !existingLocs.has(u.loc));
    const entries = fresh
      .map((u) => `  <url>\n    <loc>${u.loc}</loc>\n    <lastmod>${u.lastmod.slice(0, 10)}</lastmod>\n    <changefreq>weekly</changefreq>\n    <priority>${u.prio}</priority>\n  </url>`)
      .join('\n');
    // refresh lastmod of entries that already existed
    for (const u of newUrls.filter((x) => existingLocs.has(x.loc))) {
      const re = new RegExp(`(<loc>${u.loc.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}</loc>\\s*<lastmod>)[^<]*(</lastmod>)`);
      sitemapXml = sitemapXml.replace(re, `$1${u.lastmod.slice(0, 10)}$2`);
    }
    sitemapXml = sitemapXml.replace('</urlset>', `\n  <!-- Auto-generated note pages -->\n${entries}\n</urlset>`);
    fs.writeFileSync(sitemapPath, sitemapXml, 'utf-8');
    console.log(`[notes-seo] Sitemap: +${fresh.length} URLs`);
  }

  console.log(`[notes-seo] Done. ${pageCount} static note pages written.`);
}

main()
  .catch((err) => {
    console.warn('[notes-seo] Skipped (build continues):', err && err.message ? err.message : err);
  })
  .finally(() => {
    try { fs.rmSync(path.join(DIST, '_shell.html'), { force: true }); } catch { /* ignore */ }
    process.exit(0);
  });
