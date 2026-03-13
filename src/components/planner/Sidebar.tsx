import { useContext } from 'react'
import SessionController from './sidebar/SessionController'
import OptionsController from './sidebar/OptionsController'
import SelectedOptionController from './sidebar/SelectedOptionController'
import CoursesController from './sidebar/CoursesController'
import MultipleOptionsContext from '../../contexts/MultipleOptionsContext'
import { useSidebarContext } from '../layout/SidebarPosition'
import { ArrowsRightLeftIcon, TrashIcon } from '@heroicons/react/24/outline'
import { Button } from '../ui/button'

/**
 * Sidebar with all the main schedule interactions
 */
const Sidebar = () => {
  const { multipleOptions, selectedOption, setMultipleOptions } = useContext(MultipleOptionsContext)
  const { toggleSidebarPosition } = useSidebarContext()

  const noClassesPicked = !multipleOptions[selectedOption]?.course_options.some(
    (option) => option.picked_class_id !== null
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
      className="bg-lightest dark:bg-dark order-2 col-span-12 flex h-[85vh] flex-col justify-between overflow-y-auto rounded-md px-3 py-3 lg:col-span-3
                2xl:px-4 2xl:py-4"
    >
      <div className="space-y-1">
        <SessionController />
        <OptionsController />
        <SelectedOptionController currentOption={multipleOptions[selectedOption].course_options} />
        <CoursesController />
      </div>
      <footer className=" border-white-300 flex items-end justify-end gap-x-1 text-center">
        <Button
          onClick={eraseClasses}
          variant="icon"
          className={`bg-lightish text-darkish gap-1.5 ${noClassesPicked ? 'pointer-events-none opacity-50' : ''}`}
        >
          <TrashIcon className="h-5 w-5" />
          <span>Limpar</span>
        </Button>
        <button
          title="Mudar o lado da Sidebar"
          onClick={toggleSidebarPosition}
          className="bg-primary text-gray hidden h-[40px] w-[48px] items-center justify-center gap-2 rounded-md p-1 text-sm hover:opacity-80 md:flex dark:text-white"
        >
          <ArrowsRightLeftIcon className="h-5 w-5 text-white dark:text-white" />
        </button>
      </footer>
    </div>
  )
}

export default Sidebar
