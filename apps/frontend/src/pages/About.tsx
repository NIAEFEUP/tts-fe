import { useEffect } from 'react'
import HeroPlanner from '../components/home/HeroPlanner'
import { scrollToTop } from '../utils'

const AboutPage = () => {
  useEffect(() => {
    scrollToTop()
  }, [])

  return (
    <div className="container mx-auto mb-8 w-full px-4 md:px-6">
      <HeroPlanner />
    </div>
  )
}

export default AboutPage
