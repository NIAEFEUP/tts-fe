import { useContext } from 'react'
import { ClassInfo } from '../../../../@types/index'
import { DropdownMenuCheckboxItem } from '../../../ui/dropdown-menu'
import { ExclamationTriangleIcon } from '@heroicons/react/20/solid'
import { classesConflictSeverity } from '../../../../utils'
import MultipleOptionsContext from '../../../../contexts/MultipleOptionsContext'
import CourseContext from '../../../../contexts/CourseContext'


type Props = {
  course_id: number,
  classInfo: ClassInfo
  onSelect?: () => void
  onMouseEnter?: () => void
  onMouseLeave?: () => void
}

const ClassItem = ({ course_id, classInfo, onSelect, onMouseEnter, onMouseLeave }: Props) => {
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

  const conflictSeverity = () => {
    const chosenCourses = multipleOptions[selectedOption].course_options.filter(
      (option) => option.course_id !== course_id
    );

    const otherClasses = [];
    chosenCourses.forEach((option) => {
      const courseInfo = pickedCourses.find((course) => course.id === option.course_id);
      const pickedClass = courseInfo?.classes?.find((classInfo) => classInfo.id === option.picked_class_id);

      if (pickedClass) otherClasses.push(pickedClass);
    });

    let maxSeverity = 0;
    for (const otherClass of otherClasses) {
      maxSeverity = Math.max(maxSeverity, classesConflictSeverity(classInfo, otherClass, false));
    }

    return maxSeverity;
  }

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
              <span className="text-xs text-gray-500">{slot.location}</span>
              <span className="text-xs text-gray-500">
                {slot.professors.map((professor) => professor.acronym).join(', ')}
              </span>
            </div>
          ))}
        </div>
      </div>
      <ExclamationTriangleIcon className={`h-5 w-5 ${conflictSeverity() > 0 ? 'block' : 'hidden'} ${conflictSeverity() == 2 ? 'text-red-600' : 'text-amber-500'}`} aria-hidden="true" />
    </DropdownMenuCheckboxItem>
  )
}

export default ClassItem
