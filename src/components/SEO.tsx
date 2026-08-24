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
}: SEOProps) {
  // Page Title Construction (Strictly 30-60 characters for Bing & Google guidelines)
  const location = useLocation();
  const pageTitle = formatTitle(title);
  const pageDesc = formatDescription(description);

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
        siteConfig.social.youtube,
        siteConfig.social.telegram,
        siteConfig.social.whatsapp
      ]
    }
  };

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'EducationalOrganization',
    '@id': `${siteConfig.url}/#organization`,
    name: siteConfig.name,
    alternateName: siteConfig.brandAlternates,
    url: siteConfig.url,
    logo: `${siteConfig.url}/skilldotpy-logo.svg`,
    description: siteConfig.description,
    email: siteConfig.supportEmail,
    founder: {
      '@type': 'Person',
      name: siteConfig.teacher.name,
      jobTitle: siteConfig.teacher.role
    }
  };

  const jsonLdGraph: Record<string, unknown>[] = [
    websiteSchema,
    organizationSchema
  ];

  if (breadcrumbs && breadcrumbs.length > 0) {
    const breadcrumbSchema = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: siteConfig.url
        },
        ...breadcrumbs.map((item, idx) => ({
          '@type': 'ListItem',
          position: idx + 2,
          name: item.name,
          item: item.url.startsWith('http') ? item.url : `${siteConfig.url}${item.url}`
        }))
      ]
    };
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
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />
      <meta name="bingbot" content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1" />

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