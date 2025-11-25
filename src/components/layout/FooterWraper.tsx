import { useState, useEffect } from 'react'
import Footer from './Footer'
import classNames from 'classnames'

const FooterWrapper = () => {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setVisible(true)
      } else {
        setVisible(false)
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <div className={classNames(visible ? 'opacity-100' : 'opacity-0')}>
      <Footer />
    </div>
  )
}

export default FooterWrapper
