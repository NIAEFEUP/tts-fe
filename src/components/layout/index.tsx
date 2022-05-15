import React from 'react'

type Props = {
  children: JSX.Element
  location: string
}

const Layout = ({ children, location }: Props) => {
  return (
    <div className="layout">
      <div></div>
      {children}
    </div>
  )
}

export default Layout
