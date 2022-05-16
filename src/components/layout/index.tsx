import React, { useEffect } from 'react'
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
    document.title = `${title} | ${process.env.REACT_APP_SITE_TITLE}`;
  }, [title]);

  return (
    <div className="layout">
      <Header location={location} siteTitle="Time Table Selector" />
      <div className={classNames(liquid ? 'my-auto' : 'mb-auto')}>{children}</div>
      <Footer />
    </div>
  )
}

export default Layout
