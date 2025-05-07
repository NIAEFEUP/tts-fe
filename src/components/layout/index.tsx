import { useEffect } from 'react'
import Header from './Header'
import Footer from './Footer'
import classNames from 'classnames'

type Props = {
  children: JSX.Element
  title: string
  location: string
  liquid?: boolean
}

const Layout = ({ children, location, liquid, title }: Props) => {
  useEffect(() => {
    document.title = `${title} | ${import.meta.env.VITE_APP_SITE_TITLE || 'Time Table Selector'}`
  }, [title])

  return (
    <div
      id="layout"
      className="flex min-h-screen flex-col bg-light font-prose font-normal text-gray-800 opacity-[99%] dark:bg-darkest dark:text-white"
    >
      <Header location={location} siteTitle="Time Table Selector" />
      <div className={classNames(liquid ? 'sm:my-auto' : 'mb-auto')}>{children}</div>
      <Footer />
    </div>
  )
}

export default Layout
