import { ComingSoon } from '../components/layout/ComingSoon'
const FeupExchangePage = () => {
  const isComingSoon = true

  return isComingSoon ? (
    <div className="mx-auto w-full">
      <ComingSoon />
    </div>
  ) : (
    <div className="grid w-full grid-cols-12 gap-x-4 gap-y-4 py-4 px-8 md:px-8 xl:gap-x-8 xl:gap-y-0">
      {/* Main area */}
      <div className="lg:min-h-adjusted order-2 col-span-12 min-h-min rounded bg-lightest px-3 py-3 dark:bg-dark lg:col-span-9 lg:px-4 lg:py-4"></div>

      {/* Sidebar */}
      <div className="min-h-adjusted order-1 col-span-12 flex flex-col justify-between space-y-2 rounded bg-lightest px-4 py-4 dark:bg-dark lg:col-span-3"></div>
    </div>
  )
}

export default FeupExchangePage
