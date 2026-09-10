import { useContext } from 'react'
import SessionController from './sidebar/SessionController'
import OptionsController from './sidebar/OptionsController'
import SelectedOptionController from './sidebar/SelectedOptionController'
import CoursesController from './sidebar/CoursesController'
import MultipleOptionsContext from '../../contexts/MultipleOptionsContext'
import { useSidebarContext } from '../layout/SidebarPosition'
import { ArrowLeftRight, Trash } from 'lucide-react'
import { Button } from '../ui/new/button'

/**
 * Sidebar with all the main schedule interactions
 */
const Sidebar = () => {
  const { multipleOptions, selectedOption, setMultipleOptions } = useContext(MultipleOptionsContext)
  const { toggleSidebarPosition } = useSidebarContext()

  const noClassesPicked = !multipleOptions[selectedOption]?.course_options.some(
    (option) => option.picked_class_id !== null,
  )

  const eraseClasses = () => {
    const currentOption = multipleOptions[selectedOption]

    const updatedCourseOptions = currentOption.course_options.map((courseOption) => ({
      ...courseOption,
      picked_class_id: null,
      locked: false,
    }))

    const updatedMultipleOptions = [...multipleOptions]
    updatedMultipleOptions[selectedOption] = {
      ...currentOption,
      course_options: updatedCourseOptions,
    }

    setMultipleOptions(updatedMultipleOptions)
  }

  return (
    <div
      className="order-2 col-span-12 flex min-h-min flex-col justify-between rounded-md bg-lightest px-3 py-3 dark:bg-dark lg:col-span-3 lg:min-h-adjusted 2xl:px-4 2xl:py-4
                h-[85vh] overflow-y-auto"
    >
      <div className="space-y-1">
        <SessionController />
        <OptionsController />
        <SelectedOptionController currentOption={multipleOptions[selectedOption].course_options} />
        <CoursesController />
      </div>
      <footer className=" gap-x-1 border-white-300 text-center flex items-end justify-end">
        <Button
          onClick={eraseClasses}
          className={`bg-lightish hover:bg-lightish/90 text-darkish gap-1.5`}
          disabled={noClassesPicked}
        >
          <Trash size="18" />
          <span>Limpar</span>
        </Button>
        <Button
          title="Mudar o lado da Sidebar"
          onClick={toggleSidebarPosition}
          square
          className="bg-primary hover:opacity-80 dark:text-white "
        >
          <ArrowLeftRight className="text-white dark:text-white" size="18" />
        </Button>
      </footer>
    </div>
  )
}

export default Sidebar
