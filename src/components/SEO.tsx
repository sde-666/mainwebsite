import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
import { siteConfig } from '../data/config';

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
  // Page Title Construction (Strictly 30-60 characters for Bing & Google guidelines)
  const location = useLocation();
  const pageTitle = formatTitle(title);
  const pageDesc = formatDescription(description);
  // Auto-detect canonical URL from the current route so every page gets its
  // own correct canonical/og:url, without every page having to remember to
  // pass a `url` prop. An explicit `url` prop (if given) still wins.
  const autoUrl = `${siteConfig.url}${location.pathname === '/' ? '' : location.pathname}`;
  const pageUrl = url || autoUrl;
  const pageKeywords = keywords ? [...keywords, ...siteConfig.keywords.slice(0, 10)].join(', ') : siteConfig.keywords.join(', ');

  // Base Structured Data Schemas
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

  // Breadcrumb schema if items provided
  const breadcrumbSchema = breadcrumbs && breadcrumbs.length > 0 ? {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((b, idx) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: b.name,
      item: b.url.startsWith('http') ? b.url : `${siteConfig.url}${b.url.startsWith('/') ? b.url : `/${b.url}`}`
    }))
  } : null;

  // Build JSON-LD graph
  const jsonLdGraph: Record<string, unknown>[] = [websiteSchema, orgSchema];

  if (breadcrumbSchema) {
    jsonLdGraph.push(breadcrumbSchema);
  }

  if (schema) {
    if (Array.isArray(schema)) {
      jsonLdGraph.push(...schema);
    } else {
      jsonLdGraph.push(schema);
    }
  }

  return (
    <Helmet>
      {/* Standard Meta */}
      <title>{pageTitle}</title>
      <meta name="description" content={pageDesc} />
      <meta name="keywords" content={pageKeywords} />
      <meta name="author" content={`${siteConfig.teacher.name} - Skilldotpy`} />
      <meta name="robots" content={noIndex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'} />
      <meta name="googlebot" content={noIndex ? 'noindex, nofollow' : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'} />
      <meta name="bingbot" content={noIndex ? 'noindex, nofollow' : 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1'} />

      {/* Brand Search Ranking Meta */}
      <meta name="application-name" content="Skilldotpy" />
      <meta name="apple-mobile-web-app-title" content="Skilldotpy" />
      <meta name="geo.region" content="IN" />
      <meta name="geo.placename" content="India" />
      <meta name="rating" content="General" />
      <meta name="distribution" content="Global" />

      {/* Canonical URL */}
      <link rel="canonical" href={pageUrl} />

      {/* Open Graph / Facebook */}
      <meta property="og:title" content={pageTitle} />
      <meta property="og:description" content={pageDesc} />
      <meta property="og:url" content={pageUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Skilldotpy" />
      <meta property="og:locale" content="en_IN" />
      <meta property="og:locale:alternate" content="hi_IN" />
      <meta property="og:image" content={image} />
      <meta property="og:image:alt" content="Skilldotpy - NIELIT O Level & CCC Free Notes, Courses & App" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@skilldotpy" />
      <meta name="twitter:creator" content="@skilldotpy" />
      <meta name="twitter:title" content={pageTitle} />
      <meta name="twitter:description" content={pageDesc} />
      <meta name="twitter:image" content={image} />

      {/* Structured Data (JSON-LD) Graph */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@graph': jsonLdGraph
        })}
      </script>
    </Helmet>
  );
}
