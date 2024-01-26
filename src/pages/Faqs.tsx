import { useEffect } from 'react'
import { PlannerFaqs, ExchangeFaqs, HeaderFaqs } from '../components/faqs'

const FaqsPage = () => {
  useEffect(() => {
    if (!window.location.href.split('#')[1]) document.getElementById('layout').scrollIntoView()
  }, [])

  return (
    <div className="container mx-auto w-full max-w-7xl space-y-4 px-4 py-6 md:py-10 md:px-6">
      <HeaderFaqs />
      <PlannerFaqs />
      <ExchangeFaqs />
    </div>
  )
}
export default FaqsPage
