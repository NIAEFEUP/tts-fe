import React from 'react'
import Header from './Header'
import Footer from './Footer'
import classNames from 'classnames'

type Props = {
  children: JSX.Element
  location: string
  liquid?: boolean
}

const Layout = ({ children, location, liquid }: Props) => {
  return (
    <div className="layout">
      <Header location={location} siteTitle="Time Table Selector" />
      <div className={classNames(liquid ? 'my-auto' : 'mb-auto')}>{children}</div>
      <Footer />
    </div>
  )
}

export default Layout
