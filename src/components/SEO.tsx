import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { siteConfig } from '../data/config';

// ---------------------------------------------------------------------------
// Why this file doesn't use react-helmet-async's <Helmet> anymore
// ---------------------------------------------------------------------------
// This project runs React 19. react-helmet-async v3 doesn't have real React
// 19 support: internally it detects React 19 and switches to rendering
// <title>/<meta>/<link> as plain React elements, leaning on React 19's own
// experimental "hoist tags to <head>" feature instead of its normal,
// reliable DOM-patching code. That hoisting does not reliably adopt a
// matching tag that's already sitting in <head> (from prerendered static
// HTML, or one this same component rendered on the previous page) — it can
// append a second copy instead of reusing/replacing the first one. That's
// exactly what Bing was flagging: 2 title tags, 2 meta descriptions, 2
// canonicals, and only some of the time — a hydration race, not a config
// problem. (Verified directly with a real headless-Chromium test: the old
// code duplicated on every single fresh page load; rendering plain
// <title>/<meta>/<link> tags via React 19's own hoisting has the identical
// failure mode, since it's the same underlying mechanism Helmet was using.)
//
// Fix: in a real browser, never render these as JSX tags at all — manage
// <head> with plain, direct DOM calls instead. Every tag is looked up by
// its identifying attribute (name/property/rel) and updated in place if it
// exists, or created once if it doesn't. No duplicate is possible, because
// we never blindly insert — we always look first. This behaves identically
// whether it's the very first paint (reusing the already-correct
// prerendered tag) or the 50th client-side navigation (updating the same
// node again).
//
// The one place this component still needs to render real JSX tags is
// during the site's own build-time prerendering pass (scripts/prerender.mjs
// runs each route through a one-shot, non-interactive static render — no
// hydration, no race, no browser involved — and scrapes the resulting
// <title>/<meta>/<link> text to bake into the static HTML file for that
// route). prerender.mjs sets a `__PRERENDER__` flag for that pass only, so
// this component knows which mode it's in.
// ---------------------------------------------------------------------------

function isPrerenderPass(): boolean {
  return typeof globalThis !== 'undefined' && (globalThis as unknown as { __PRERENDER__?: boolean }).__PRERENDER__ === true;
}

function setMetaTag(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setLinkTag(rel: string, href: string) {
  let el = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function setJsonLd(id: string, data: unknown) {
  let el = document.getElementById(id) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement('script');
    el.id = id;
    el.type = 'application/ld+json';
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface SEOProps {
  title?: string;
  description?: string;
  url?: string;
  keywords?: string[];
  schema?: Record<string, unknown> | Record<string, unknown>[];
  type?: string;
  image?: string;
  breadcrumbs?: BreadcrumbItem[];
  noIndex?: boolean;
}

function formatTitle(title?: string): string {
  if (!title) {
    return `${siteConfig.name} - NIELIT O Level & CCC Free Notes`;
  }
  const brand = siteConfig.name;
  if (title.includes(brand)) {
    return title.length > 60 ? title.slice(0, 57).trim() + '...' : title;
  }
  const withBrand = `${title} | ${brand}`;
  if (withBrand.length <= 60) return withBrand;
  const maxTitleLen = 60 - brand.length - 3; // Leaves space for " | Brand"
  return `${title.slice(0, maxTitleLen).trim()}... | ${brand}`;
}

function formatDescription(desc?: string): string {
  const raw = (desc || siteConfig.description || '').trim();
  if (raw.length <= 155 && raw.length >= 60) return raw;
  if (raw.length > 155) {
    const trimmed = raw.slice(0, 152);
    const lastSpace = trimmed.lastIndexOf(' ');
    return (lastSpace > 100 ? trimmed.slice(0, lastSpace).trim() : trimmed.trim()) + '...';
  }
  return raw;
}

function buildJsonLdGraph(opts: {
  breadcrumbs?: BreadcrumbItem[];
  schema?: Record<string, unknown> | Record<string, unknown>[];
}): Record<string, unknown>[] {
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteConfig.url}/#website`,
    url: siteConfig.url,
    name: siteConfig.name,
    alternateName: siteConfig.brandAlternates,
    description: siteConfig.description,
    publisher: {
      '@type': 'EducationalOrganization',
      '@id': `${siteConfig.url}/#organization`,
      name: siteConfig.name,
      url: siteConfig.url,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}/skilldotpy-logo.svg`
      },
      founder: {
        '@type': 'Person',
        name: siteConfig.teacher.name,
        jobTitle: siteConfig.teacher.role
      },
      sameAs: [
        siteConfig.links?.youtube || siteConfig.social?.youtube || 'https://youtube.com/@skilldotpy',
        siteConfig.links?.telegram || siteConfig.social?.telegram || 'https://t.me/skilldotpy',
        siteConfig.links?.instagram || siteConfig.social?.instagram || 'https://instagram.com/skilldotpy'
      ].filter(Boolean)
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteConfig.url}/resources?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  };

  const orgSchema = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    '@id': `${siteConfig.url}/#organization`,
    name: 'Skilldotpy - NIELIT & Computer Education Hub',
    alternateName: siteConfig.brandAlternates,
    url: siteConfig.url,
    logo: `${siteConfig.url}/skilldotpy-logo.svg`,
    description: siteConfig.description,
    founder: {
      '@type': 'Person',
      name: siteConfig.teacher.name,
      jobTitle: siteConfig.teacher.role,
      description: siteConfig.teacher.bio
    },
    contactPoint: {
      '@type': 'ContactPoint',
      email: siteConfig.links?.email || siteConfig.supportEmail || 'skilldotpy@gmail.com',
      contactType: 'customer support',
      availableLanguage: ['Hindi', 'English']
    },
    sameAs: [
      siteConfig.links?.youtube || siteConfig.social?.youtube || 'https://youtube.com/@skilldotpy',
      siteConfig.links?.telegram || siteConfig.social?.telegram || 'https://t.me/skilldotpy',
      siteConfig.links?.instagram || siteConfig.social?.instagram || 'https://instagram.com/skilldotpy'
    ].filter(Boolean)
  };

  const breadcrumbSchema = opts.breadcrumbs && opts.breadcrumbs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: opts.breadcrumbs.map((b, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: b.name,
      item: b.url.startsWith('http') ? b.url : `${siteConfig.url}${b.url.startsWith('/') ? b.url : `/${b.url}`}`
    }))
  } : null;

  const jsonLdGraph: Record<string, unknown>[] = [websiteSchema, orgSchema];
  if (breadcrumbSchema) jsonLdGraph.push(breadcrumbSchema);
  if (opts.schema) {
    if (Array.isArray(opts.schema)) {
      jsonLdGraph.push(...opts.schema);
    } else {
      jsonLdGraph.push(opts.schema);
    }
  }
  return jsonLdGraph;
}

export function SEO({
  title,
  description,
  url,
  keywords,
  schema,
  type = 'website',
  image = siteConfig.ogImage,
  breadcrumbs,
  noIndex = false,
}: SEOProps) {
  const location = useLocation();

  const pageTitle = formatTitle(title);
  const pageDesc = formatDescription(description);
  // Auto-detect canonical URL from the current route so every page gets its
  // own correct canonical/og:url, without every page having to remember to
  // pass a `url` prop. An explicit `url` prop (if given) still wins.
  const autoUrl = `${siteConfig.url}${location.pathname === '/' ? '' : location.pathname}`;
  const pageUrl = url || autoUrl;
  const pageKeywords = keywords ? [...keywords, ...siteConfig.keywords.slice(0, 10)].join(', ') : siteConfig.keywords.join(', ');
  const robotsContent = noIndex
    ? 'noindex, nofollow'
    : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';
  const botContent = noIndex
    ? 'noindex, nofollow'
    : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1';

  // Real browser: sync <head> imperatively. Safe on first paint (adopts the
  // already-correct prerendered tags) and on every later client-side
  // navigation (updates the same nodes again) — see the comment block up
  // top for why this replaced JSX-rendered tags on the client.
  useEffect(() => {
    if (isPrerenderPass()) return;

    document.title = pageTitle; // native API, can never duplicate

    setMetaTag('name', 'description', pageDesc);
    setMetaTag('name', 'keywords', pageKeywords);
    setMetaTag('name', 'author', `${siteConfig.teacher.name} - Skilldotpy`);
    setMetaTag('name', 'robots', robotsContent);
    setMetaTag('name', 'googlebot', botContent);
    setMetaTag('name', 'bingbot', botContent);

    setMetaTag('name', 'application-name', 'Skilldotpy');
    setMetaTag('name', 'apple-mobile-web-app-title', 'Skilldotpy');
    setMetaTag('name', 'geo.region', 'IN');
    setMetaTag('name', 'geo.placename', 'India');
    setMetaTag('name', 'rating', 'General');
    setMetaTag('name', 'distribution', 'Global');

    setLinkTag('canonical', pageUrl);

    setMetaTag('property', 'og:title', pageTitle);
    setMetaTag('property', 'og:description', pageDesc);
    setMetaTag('property', 'og:url', pageUrl);
    setMetaTag('property', 'og:type', type);
    setMetaTag('property', 'og:site_name', 'Skilldotpy');
    setMetaTag('property', 'og:locale', 'en_IN');
    setMetaTag('property', 'og:locale:alternate', 'hi_IN');
    setMetaTag('property', 'og:image', image);
    setMetaTag('property', 'og:image:alt', 'Skilldotpy - NIELIT O Level & CCC Free Notes, Courses & App');

    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:site', '@skilldotpy');
    setMetaTag('name', 'twitter:creator', '@skilldotpy');
    setMetaTag('name', 'twitter:title', pageTitle);
    setMetaTag('name', 'twitter:description', pageDesc);
    setMetaTag('name', 'twitter:image', image);

    setJsonLd('seo-jsonld', {
      '@context': 'https://schema.org',
      '@graph': buildJsonLdGraph({ breadcrumbs, schema }),
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageTitle, pageDesc, pageUrl, pageKeywords, type, image, noIndex, robotsContent, botContent]);

  // Build-time prerender pass only: render literal tags for
  // scripts/prerender.mjs to scrape into the static HTML for this route.
  // Never reached in a real browser.
  if (!isPrerenderPass()) {
    return null;
  }

  const jsonLdGraph = buildJsonLdGraph({ breadcrumbs, schema });

  return (
    <>
      <title>{pageTitle}</title>
      <meta name="description" content={pageDesc} />
      <meta name="keywords" content={pageKeywords} />
      <meta name="author" content={`${siteConfig.teacher.name} - Skilldotpy`} />
      <meta name="robots" content={robotsContent} />
      <meta name="googlebot" content={botContent} />
      <meta name="bingbot" content={botContent} />

      <meta name="application-name" content="Skilldotpy" />
      <meta name="apple-mobile-web-app-title" content="Skilldotpy" />
      <meta name="geo.region" content="IN" />
      <meta name="geo.placename" content="India" />
      <meta name="rating" content="General" />
      <meta name="distribution" content="Global" />

      <link rel="canonical" href={pageUrl} />

      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDesc} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Skilldotpy" />
      <meta property="og:locale" content="en_IN" />
      <meta property="og:locale:alternate" content="hi_IN" />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content="Skilldotpy - NIELIT O Level & CCC Free Notes, Courses & App" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@skilldotpy" />
      <meta name="twitter:creator" content="@skilldotpy" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDesc} />
      <meta name="twitter:image" content={image} />

      <script type="application/ld+json">
        {JSON.stringify({ '@context': 'https://schema.org', '@graph': jsonLdGraph })}
      </script>
    </>
  );
}
