import { SessionController, CourseOptionsController, OptionsController } from './sidebar'

type Props = {}

/**
 * Sidebar with all the main schedule interactions
 */
const Sidebar = () => {
  return (
    <div className="lg:min-h-adjusted order-2 col-span-12 flex min-h-min flex-col justify-between rounded bg-lightest px-3 py-3 dark:bg-dark lg:col-span-3 2xl:px-4 2xl:py-4">
      <div className="space-y-2">
        <div className="flex flex-row flex-wrap items-start justify-start gap-x-2 gap-y-2">
          <SessionController />
          <CourseOptionsController />
          {/*<OptionsController />*/}
        </div>
      </div>
    </div>
  )
}

export default Sidebar
