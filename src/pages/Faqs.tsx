import { PlannerFaqs, ExchangeFaqs, HeaderFaqs } from '../components/faqs'

const FaqsPage = () => {
  return (
    <div className="container mx-auto w-full space-y-12 py-6 px-4 md:py-10 md:px-6">
      <HeaderFaqs />
      <PlannerFaqs />
      <ExchangeFaqs hidden />
    </div>
  )
}
export default FaqsPage
