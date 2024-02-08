import { removeDuplicatesFromCourseOption } from '../../../utils/utils'
import { default as ClassSelector } from './ClassSelector'

const CoursesController = ({ multilpleOptionsHook, isImportedOptionHook }) => {
  const [multipleOptions, setMultipleOptions] = multilpleOptionsHook
  const [isImportedOption, setIsImportedOption] = isImportedOptionHook

  return (
    <div className="flex w-full flex-col gap-4 px-0 py-2">
      {multipleOptions.selected.length > 0 &&
        removeDuplicatesFromCourseOption(multipleOptions.options[multipleOptions.index]).map(
          (courseOption, courseOptionIdx) => (
            <ClassSelector
              courseOption={courseOption}
              multipleOptionsHook={[multipleOptions, setMultipleOptions]}
              isImportedOptionHook={[isImportedOption, setIsImportedOption]}
              key={`course-schedule-${multipleOptions.index}-${courseOption.course.info.id}`}
            />
          )
        )}
    </div>
  )
}

export default CoursesController
