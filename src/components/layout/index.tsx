import { useEffect } from 'react'
import Header from './Header'
import FooterWraper from './FooterWraper'
import classNames from 'classnames'
import { FeedbackReport } from '../FeedbackReport'

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
      className="min-h-screen flex-col bg-light font-prose font-normal text-gray-800 opacity-[99%] dark:bg-darkest dark:text-white"
    >
      <div className="hidden md:flex fixed bottom-0 left-0 mb-6 ml-5 rounded-full shadow-lg bg-white border z-40">
        <FeedbackReport />
      </div>

      <Header location={location} siteTitle="Time Table Selector" />
      <div className="flex flex-col flex-grow">
        <div className={classNames('flex-grow', liquid ? 'sm:my-auto' : '')}>
          {children}
        </div>
        <FooterWraper />
      </div>
    </div>

  )
}

export default Layout
