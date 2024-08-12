import { ExchangeSidebar } from "../components/exchange/ExchangeSidebar";
import { Schedule } from "../components/planner";

const ExchangePage = () => {
  return <div className="grid w-full grid-cols-12 gap-x-4 gap-y-4 px-4 py-4">
    {/* Schedule Preview */}
    <div className="lg:min-h-adjusted order-1 col-span-12 min-h-min rounded bg-lightest px-3 py-3 dark:bg-dark lg:col-span-9 2xl:px-5 2xl:py-5">
      <div className="h-full w-full">
        <Schedule />
      </div>
    </div>

    <ExchangeSidebar />
  </div>

}

export default ExchangePage;