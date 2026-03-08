import { useRef, useState, useContext, useEffect } from 'react'
import { Lock, Unlock, ChevronsUpDown } from 'lucide-react'
import { CourseInfo } from '../../../../@types'
import { getClassDisplayText } from '../../../../utils'
import { Button } from '../../../ui/new/newButton'
import { Dropdown, DropdownItems, DropdownTrigger } from '../../../ui/new/dropdown'
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
      <div className="flex items-center gap-2">
        {/* Dropdown Menu */}
        <Dropdown
          open={isDropdownOpen}
          onOpenChange={(open: boolean) => {
            setIsDropdownOpen(open)
            if (!open) {
              window.setTimeout(() => {
                removePreview()
              }, 0)
            }
          }}
        >
          <div className="w-full">
            <DropdownTrigger asChild>
              <Button
                ref={classSelectorTriggerRef}
                disabled={courseOption?.locked}
                variant="outline"
                className="w-full justify-between truncate bg-lightish text-xs font-normal tracking-tighter hover:bg-primary/75 hover:text-white dark:bg-darkish h-9"
              >
                <span className={`${selectedClassId === null ? 'opacity-50' : ''}`}>
                  {getClassDisplayText(course, selectedClassId)}
                </span>
                {!courseOption?.locked && <ChevronsUpDown size="14" className="text-blackish dark:text-lightish" />}
              </Button>
            </DropdownTrigger>
            <DropdownItems
              className="z-60 pointer-events-auto bg-lightish text-darkish dark:bg-darkish dark:text-lightish"
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
            </DropdownItems>
          </div>
        </Dropdown>

        {/* Lock Button */}
        {lockFunctionality && (
          <Button
            square
            variant="ghost"
            title={courseOption?.locked ? 'Desbloquear Horário' : 'Bloquear Horário'}
            onClick={toggleLocker}
            disabled={display === null}
          >
            {courseOption?.locked ? (
              <Unlock size="18" className="text-darkish dark:text-lightish" />
            ) : (
              <Lock size="18" className="text-darkish dark:text-lightish" />
            )}
          </Button>
        )}
      </div>
    </div>
  )
}

export default ClassSelector
