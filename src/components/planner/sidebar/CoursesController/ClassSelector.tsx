import { useRef, useState, useContext, useEffect } from 'react'
import { ChevronUpDownIcon, LockClosedIcon, LockOpenIcon } from '@heroicons//react/24/solid'
import { CourseInfo } from '../../../../@types'
import { getClassDisplayText } from '../../../../utils'
import { Button } from '../../../ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '../../../ui/dropdown-menu'
import ClassSelectorDropdownController from './ClassSelectorDropdownController'
import ClassSelectorContext from '../../../../contexts/classSelector/ClassSelectorContext'
import useCourseUnitClasses from '../../../../hooks/useCourseUnitClasses'
import CourseContext from '../../../../contexts/CourseContext'

type Props = {
  course: CourseInfo
  lockFunctionality?: boolean
}

const ClassSelector = ({ course, lockFunctionality = true }: Props) => {
  const classSelectorTriggerRef = useRef(null)
  const classSelectorContentRef = useRef(null)

  const { pickedCourses, setPickedCourses } = useContext(CourseContext)

  const { classes, loading: classesLoading } = useCourseUnitClasses(course.id, pickedCourses)

  useEffect(() => {
    if (classes) {
      setPickedCourses((prevCourses) => prevCourses.map((c) => (c.id === course.id ? { ...c, classes: classes } : c)))
    }
  }, [classes, setPickedCourses])

  const { selectedClassId, setSelectedClassId, display, setPreview, removePreview, toggleLocker, courseOption } =
    useContext(ClassSelectorContext)

  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

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
        <DropdownMenu
          open={isDropdownOpen}
          onOpenChange={(open: boolean) => {
            setIsDropdownOpen(open)
            if (!open) removePreview()
          }}
        >
          <div className="w-full">
            <DropdownMenuTrigger asChild disabled={courseOption?.locked} ref={classSelectorTriggerRef}>
              <Button
                variant="outline"
                size="sm"
                className="bg-lightish hover:bg-primary/75 dark:bg-darkish w-full justify-between truncate text-xs font-normal tracking-tighter hover:text-white"
              >
                <span className={`${selectedClassId === null ? 'opacity-50' : ''}`}>
                  {getClassDisplayText(course, selectedClassId)}
                </span>
                {!courseOption?.locked && <ChevronUpDownIcon className="text-blackish dark:text-lightish h-6 w-6" />}
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
                classesLoading={classesLoading}
              />
            </DropdownMenuContent>
          </div>
        </DropdownMenu>

        {/* Lock Button */}
        {lockFunctionality && (
          <Button
            variant="icon"
            title={courseOption?.locked ? 'Desbloquear Horário' : 'Bloquear Horário'}
            onClick={toggleLocker}
            disabled={display === null}
          >
            {courseOption?.locked ? (
              <LockClosedIcon className="text-darkish dark:text-lightish h-6 w-6" />
            ) : (
              <LockOpenIcon className="text-darkish dark:text-lightish h-6 w-6" />
            )}
          </Button>
        )}
      </div>
    </div>
  )
}

export default ClassSelector
