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
  const { multipleOptions, selectedOption, setMultipleOptions } = useContext(MultipleOptionsContext);
  const { toggleSidebarPosition } = useSidebarContext();
  
  const noClassesPicked = !multipleOptions[selectedOption]?.course_options.some(
    (option) => option.picked_class_id !== null
  );

  const eraseClasses = () => {
    const currentOption = multipleOptions[selectedOption];
  
    const updatedCourseOptions = currentOption.course_options.map(courseOption => ({
      ...courseOption,
      picked_class_id: null,
      locked: false,
    }));
  
    const updatedMultipleOptions = [...multipleOptions];
    updatedMultipleOptions[selectedOption] = {
      ...currentOption,
      course_options: updatedCourseOptions,
    };
  
    setMultipleOptions(updatedMultipleOptions);
  };


  return (
    <div className="lg:min-h-adjusted order-2 col-span-12 flex min-h-min flex-col justify-between rounded-md bg-lightest px-3 py-3 dark:bg-dark lg:col-span-3 2xl:px-4 2xl:py-4">
      <div className="flex-grow space-y-2">
        <div className="relative flex flex-row flex-wrap items-center justify-center gap-x-2 gap-y-2 lg:justify-start">
          <SessionController />
          <OptionsController />
          <SelectedOptionController
            currentOption={multipleOptions[selectedOption].course_options}
          />
          <CoursesController />
        </div>
      </div>
      <footer className="mt-4 gap-x-1 border-white-300 pt-3 text-center flex items-end justify-end">
        <Button
          onClick={eraseClasses}
          variant="icon"
          className={`bg-lightish text-darkish gap-1.5 ${noClassesPicked ? 'opacity-50 pointer-events-none' : ''}`}
        >
          <TrashIcon className="h-5 w-5" />
          <span>Limpar</span>
        </Button>
        <button title='Mudar o lado da Sidebar'
          onClick={toggleSidebarPosition}
          className="flex items-center justify-center gap-2 w-[48px] h-[40px] bg-primary hover:opacity-80 dark:text-white rounded-md p-1 text-gray text-sm"
        >
          <ArrowsRightLeftIcon className="h-5 w-5 text-white dark:text-white" />
        </button>
      </footer>
    </div>
  )
}

export default Sidebar
