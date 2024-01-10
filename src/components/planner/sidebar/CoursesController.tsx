import ScheduleListbox from './ScheduleListbox'
import { CourseOption } from '../../../@types'

const CoursesController = ({ multilpleOptionsHook, isImportedOptionHook }) => {
  const [multipleOptions, setMultipleOptions] = multilpleOptionsHook
  const [isImportedOption, setIsImportedOption] = isImportedOptionHook

  const removeDuplicatesFromCourseOption = (courses: CourseOption[]): CourseOption[] => {
    let frequency: Map<number, number> = new Map()
    let newCourseOptions: CourseOption[] = []

    for (let courseOption of courses) {
      if (!frequency.has(courseOption.course.info.id)) {
        newCourseOptions.push(courseOption)
        frequency.set(courseOption.course.info.id, 1)
      }
    }

    return newCourseOptions
  }

  return (
    <div className="flex flex-col gap-4 px-0 py-1">
      {multipleOptions.selected.length > 0 &&
        removeDuplicatesFromCourseOption(multipleOptions.selected).map((courseOption, courseOptionIdx) => (
          <ScheduleListbox
            courseOption={courseOption}
            multipleOptionsHook={[multipleOptions, setMultipleOptions]}
            isImportedOptionHook={[isImportedOption, setIsImportedOption]}
            key={`course-schedule-listbox-${multipleOptions.index}-${courseOption.course.info.id}`}
          />
        ))}
    </div>
  )
}

export default CoursesController
