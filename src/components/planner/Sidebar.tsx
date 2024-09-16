import { useContext } from 'react'
import SessionController from './sidebar/SessionController'
import OptionsController from './sidebar/OptionsController'
import SelectedOptionController from './sidebar/SelectedOptionController'
import CoursesController from './sidebar/CoursesController'
import MultipleOptionsContext from '../../contexts/MultipleOptionsContext'

/**
 * Sidebar with all the main schedule interactions
 */
const Sidebar = () => {
  const { multipleOptions, selectedOption } = useContext(MultipleOptionsContext);

  return (
    <div className="lg:min-h-adjusted order-2 col-span-12 flex min-h-min flex-col justify-between rounded-md bg-lightest px-3 py-3 dark:bg-dark lg:col-span-3 2xl:px-4 2xl:py-4">
      <div className="space-y-2">
        <div className="relative flex flex-row flex-wrap items-center justify-center gap-x-2 gap-y-2 lg:justify-start">
          <SessionController />
          <OptionsController />
          <SelectedOptionController
            currentOption={multipleOptions[selectedOption].course_options}
          />
          <CoursesController />
        </div>
      </div>
    </div>
  )
}

export default Sidebar
