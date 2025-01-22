import { useEffect, useRef, useState, useContext } from 'react'
import { ChevronUpDownIcon, LockClosedIcon, LockOpenIcon } from '@heroicons//react/24/solid'
import { CourseInfo, CourseOption } from '../../../../@types'
import MultipleOptionsContext from '../../../../contexts/MultipleOptionsContext'
import { getClassDisplayText } from '../../../../utils'
import { Button } from '../../../ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '../../../ui/dropdown-menu'
import { AnalyticsTracker, Feature } from '../../../../utils/AnalyticsTracker'
import ClassSelectorDropdownController from './ClassSelectorDropdownController'

type Props = {
  course: CourseInfo
}

const ClassSelector = ({ course }: Props) => {
  const classSelectorTriggerRef = useRef(null)
  const classSelectorContentRef = useRef(null)

  const { multipleOptions, setMultipleOptions, selectedOption } = useContext(MultipleOptionsContext)
  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);
  const courseOption: CourseOption = multipleOptions[selectedOption].course_options.find((opt) => opt.course_id === course.id)
  const [locked, setLocked] = useState(courseOption?.locked)
  const [preview, setPreview] = useState<number | null>(null)
  const [display, setDisplay] = useState(courseOption?.picked_class_id)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    const course_options = multipleOptions[selectedOption].course_options;
    const option = course_options.filter((option) => option.course_id === course.id && option.picked_class_id !== null)

    if (option.length === 0) {
      setSelectedClassId(null);
      setDisplay(null);
      return;
    }

    if (!preview) setSelectedClassId(option[0].picked_class_id);
    setDisplay(option[0].picked_class_id);
  }, [selectedOption, multipleOptions, course.id]);

  const toggleLocker = () => {
    const newMultipleOptions = [...multipleOptions];
    const courseOptions = newMultipleOptions[selectedOption].course_options.map(opt => {
      if (opt.course_id === course.id) {
        return { ...opt, locked: !locked };
      }
      return opt;
    });
    newMultipleOptions[selectedOption].course_options = courseOptions;
    setMultipleOptions(newMultipleOptions);
    setLocked(!locked)

    AnalyticsTracker.trackFeature(Feature.LOCK_TOGGLE);
  }

  useEffect(() => {
    setLocked(courseOption?.locked)
  }, [selectedOption]);


  // Restores into multiple options the picked_class_id prior to when the user started previewing
  const removePreview = () => {
    const newMultipleOptions = [...multipleOptions];

    const newCourseOptions: CourseOption[] = newMultipleOptions[selectedOption].course_options.map((c: CourseOption) => {
      if (c.course_id === course.course_unit_id) {
        c.picked_class_id = selectedClassId
      }

      return c;
    });

    newMultipleOptions[selectedOption].course_options = newCourseOptions;
    setMultipleOptions(newMultipleOptions);

    setPreview(null);
  }

  return (
    <div className="text-sm" key={`course-option-${course.acronym}`}>
      {/* Header */}
      <p className="mb-0.5 flex text-xs">
        <strong>{course.acronym}</strong>
        <span>&nbsp;&middot;&nbsp;</span>
        <span className="truncate tracking-tighter">{course.name}&nbsp;</span>
      </p>
      <div className="flex items-center">
        {/* Dropdown Menu */}
        <DropdownMenu open={isDropdownOpen} onOpenChange={(open: boolean) => {
          setIsDropdownOpen(open);
          if (!open) removePreview();
        }}>
          <div className="w-full">
            <DropdownMenuTrigger asChild disabled={courseOption?.locked} ref={classSelectorTriggerRef}>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-between truncate bg-lightish text-xs font-normal tracking-tighter hover:bg-primary/75 hover:text-white dark:bg-darkish"
              >
                <span className={`${selectedClassId === null ? "opacity-50" : ""}`}>{getClassDisplayText(course, selectedClassId)}</span>
                {!courseOption?.locked && <ChevronUpDownIcon className="text-blackish h-6 w-6 dark:text-lightish" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="bg-lightish text-darkish dark:bg-darkish dark:text-lightish"
              ref={classSelectorContentRef}
            >
              <ClassSelectorDropdownController
                course={course}
                selectedClassIdHook={[selectedClassId, setSelectedClassId]}
                isDropdownOpen={isDropdownOpen}
                setPreview={setPreview}
                removePreview={removePreview}
                contentRef={classSelectorContentRef}
                triggerRef={classSelectorTriggerRef}
              />
            </DropdownMenuContent>
          </div>
        </DropdownMenu>

        {/* Lock Button */}
        <Button
          variant="icon"
          title={courseOption?.locked ? 'Desbloquear Horário' : 'Bloquear Horário'}
          onClick={toggleLocker}
          disabled={display === null}
        >
          {courseOption?.locked ? (
            <LockClosedIcon className="h-6 w-6 text-darkish dark:text-lightish" />
          ) : (
            <LockOpenIcon className="h-6 w-6 text-darkish dark:text-lightish" />
          )}
        </Button>
      </div>
    </div>
  )
}

export default ClassSelector
