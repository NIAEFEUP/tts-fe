import ScheduleListbox from './ScheduleListbox'
import { removeDuplicatesFromCourseOption } from '../../../utils/utils'

const CoursesController = ({ multilpleOptionsHook, isImportedOptionHook }) => {
  const [multipleOptions, setMultipleOptions] = multilpleOptionsHook
  const [isImportedOption, setIsImportedOption] = isImportedOptionHook

  return (
    <div className="flex w-full flex-col gap-4 px-0 py-2">
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
