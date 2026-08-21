import { Helmet } from 'react-helmet-async';
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
  // Page Title Construction (Brand included in every page for brand ranking dominance)
  const pageTitle = title
    ? `${title} | ${siteConfig.name} - NIELIT O Level & CCC Preparation`
    : `${siteConfig.name} - NIELIT O Level (M1, M2, M3, M4) & CCC Free Notes, Courses & App`;

  const pageDesc = description || siteConfig.description;
  const pageUrl = url || siteConfig.url;
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
        siteConfig.links.youtube,
        siteConfig.links.telegram,
        siteConfig.links.instagram
      ]
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
      email: siteConfig.links.email,
      contactType: 'customer support',
      availableLanguage: ['Hindi', 'English']
    },
    sameAs: [
      siteConfig.links.youtube,
      siteConfig.links.telegram,
      siteConfig.links.instagram
    ]
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
