import { Helmet } from 'react-helmet-async'

type BreadcrumbItem = {
  name: string
  url: string
}

type SEOProps = {
  title?: string
  description?: string
  canonical?: string
  ogImage?: string
  ogType?: string
  breadcrumbs?: BreadcrumbItem[]
}

const SEO = ({
  title = 'Time Table Selector - NIAEFEUP',
  description = 'Plataforma para estudantes da FEUP criarem e experimentarem diferentes combinações de horários no início do semestre. Criado por NIAEFEUP.',
  canonical = 'https://tts.niaefeup.pt/',
  ogImage = 'https://tts.niaefeup.pt/logo512.png',
  ogType = 'website',
  breadcrumbs
}: SEOProps) => {
  // Structured Data for Organization
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'NIAEFEUP',
    url: 'https://ni.fe.up.pt',
    logo: 'https://tts.niaefeup.pt/logo512.png',
    sameAs: [
      'https://github.com/NIAEFEUP',
      'https://www.instagram.com/niaefeup/',
      'https://www.linkedin.com/company/niaefeup/'
    ]
  }

  // Structured Data for WebSite
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Time Table Selector',
    alternateName: 'TTS',
    url: 'https://tts.niaefeup.pt',
    description: description,
    publisher: {
      '@type': 'Organization',
      name: 'NIAEFEUP'
    }
  }

  // BreadcrumbList Schema
  const breadcrumbSchema = breadcrumbs ? {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url
    }))
  } : null

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonical} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={canonical} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={canonical} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify(organizationSchema)}
      </script>
      <script type="application/ld+json">
        {JSON.stringify(websiteSchema)}
      </script>
      {breadcrumbSchema && (
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      )}
    </Helmet>
  )
}

export default SEO
