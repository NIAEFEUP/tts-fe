import { useEffect } from 'react'
import Header from './Header'
import Footer from './Footer'
import classNames from 'classnames'
import { FeedbackReport } from '../FeedbackReport'
import SEO, { BreadcrumbItem } from '../SEO'

type Props = {
  children: JSX.Element
  title: string
  location: string
  liquid?: boolean
  description?: string
  canonical?: string
  breadcrumbs?: BreadcrumbItem[]
}

const Layout = ({ children, location, liquid, title, description, canonical, breadcrumbs }: Props) => {
  const fullTitle = `${title} | ${import.meta.env.VITE_APP_SITE_TITLE || 'Time Table Selector'}`

  useEffect(() => {
    document.title = fullTitle
  }, [fullTitle])

  return (
    <div
      id="layout"
      className="bg-light font-prose dark:bg-darkest font-normal text-gray-800 opacity-[99%] dark:text-white"
    >
      <SEO title={fullTitle} description={description} canonical={canonical} breadcrumbs={breadcrumbs} />

      <div className="fixed bottom-0 left-0 z-40 mb-6 ml-5 hidden rounded-full border bg-white shadow-lg md:flex">
        <FeedbackReport />
      </div>

      <div className="flex min-h-screen flex-col">
        <Header location={location} siteTitle="Time Table Selector" />
        <div className={classNames('flex-grow', liquid ? 'sm:my-auto' : '')}>{children}</div>
      </div>
      <Footer />
    </div>
  )
}

export default Layout
