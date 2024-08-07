import { useEffect } from 'react'
import { HeaderFaqs, PlannerFaqs } from '../components/faqs'
import { scrollToTop } from '../utils'

const FaqsPage = () => {
  useEffect(() => {
    scrollToTop()
  }, [])

  return (
    <div className="container mx-auto w-full max-w-7xl space-y-4 px-4 py-6 md:px-6 md:py-10">
      <HeaderFaqs />
      <PlannerFaqs />
    </div>
  )
}
export default FaqsPage
