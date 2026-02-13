import { Helmet } from 'react-helmet-async'

type SEOProps = {
  title?: string
  description?: string
  canonical?: string
  ogImage?: string
  ogType?: string
}

const SEO = ({
  title = 'Time Table Selector - NIAEFEUP',
  description = 'Plataforma para estudantes da FEUP criarem e experimentarem diferentes combinações de horários no início do semestre. Criado por NIAEFEUP.',
  canonical = 'https://tts.niaefeup.pt/',
  ogImage = 'https://tts.niaefeup.pt/logo512.png',
  ogType = 'website'
}: SEOProps) => {
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
    </Helmet>
  )
}

export default SEO
