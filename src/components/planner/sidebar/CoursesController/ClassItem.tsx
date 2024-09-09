import { useContext, useMemo } from 'react'
import { ClassInfo } from '../../../../@types/index'
import { DropdownMenuCheckboxItem } from '../../../ui/dropdown-menu'
import { ExclamationTriangleIcon } from '@heroicons/react/20/solid'
import { conflictsSeverity, schedulesConflict } from '../../../../utils'
import MultipleOptionsContext from '../../../../contexts/MultipleOptionsContext'
import CourseContext from '../../../../contexts/CourseContext'


type Props = {
  course_id: number,
  classInfo: ClassInfo
  displayed?: boolean
  checked?: boolean
  preview: number
  conflict?: boolean
  onSelect?: () => void
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}

const ClassItem = ({ course_id, classInfo, displayed, checked, preview, onSelect, onMouseEnter, onMouseLeave }: Props) => {
  const { multipleOptions, setMultipleOptions, selectedOption } = useContext(MultipleOptionsContext)
  const { pickedCourses } = useContext(CourseContext);

  const selectOption = () => {
    const multipleOptionsEntry = multipleOptions[selectedOption].course_options.find((option) => option.course_id === course_id);
    if (multipleOptionsEntry) {
      multipleOptionsEntry.picked_class_id = classInfo.id;
      setMultipleOptions([...multipleOptions]);
    }
    onSelect();
  }

  const conflict: number = useMemo(() => {
    let classes: ClassInfo[] = []

    for (const course_option of multipleOptions[selectedOption].course_options) {
      if (course_option.picked_class_id && course_option.course_id !== course_id) {
        const pickedCourse = pickedCourses.find(co => co.id === course_option.course_id);
        // retrieve class with the picked class id of the course option
        const pickedClass = pickedCourse.classes.find(c => c.id === course_option.picked_class_id);

        if (pickedClass) classes.push(pickedClass);
      }
    }

    console.log("multiple options: ", { ...multipleOptions });
    console.log("picked courses: ", [...pickedCourses]);
    console.log("classes: ", classes);

    for (const pickedClass of classes)
      for (const slot1 of pickedClass.slots)
        for (const slot2 of classInfo.slots)
          if (schedulesConflict(slot1, slot2)) {
            return conflictsSeverity(slot1, slot2);
          }
  }, []);

  return (
    <DropdownMenuCheckboxItem
      onSelect={() => selectOption()}
      onMouseEnter={() => onMouseEnter()}
      onMouseLeave={() => onMouseLeave()}
    >
      <div className="grow">
        <span className="text-sm tracking-tighter">{classInfo.name}</span>
        <div>
          {classInfo.slots.map((slot, idx) => (
            <div key={`${classInfo.name}-${idx}`} className="flex items-center space-x-2">
              <span className="text-xs text-gray-500">{slot.lesson_type}</span>
              {/* <span className="text-xs text-gray-500">{convertWeekday(slot.day)}</span> */}
              {/* <span className="text-xs text-gray-500">{getLessonBoxTime(slot)}</span> */}
              <span className="text-xs text-gray-500">{slot.location}</span>
              <span className="text-xs text-gray-500">
                {slot.professors.map((professor) => professor.acronym).join(', ')}
              </span>
            </div>
          ))}
        </div>
      </div>
      <ExclamationTriangleIcon className={`h-5 w-5 ${conflict ? 'block' : 'hidden'} ${conflict == 2 ? 'text-red-600' : 'text-amber-500'}`} aria-hidden="true" />
    </DropdownMenuCheckboxItem>
  )
}

export default ClassItem
