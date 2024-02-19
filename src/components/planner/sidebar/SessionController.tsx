import { CheckedCourse, Major, CourseOption, MultipleOptions } from '../../../@types'

import CoursePicker from './sessionController/CoursePicker'

import Export from './sessionController/Export'

type Props = {
  openHook: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
  coursesHook: [CheckedCourse[][], React.Dispatch<React.SetStateAction<CheckedCourse[][]>>]
  extraCoursesActiveHook: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
  extraCoursesModalOpenHook: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
  sourceBufferHook: [CheckedCourse[][], React.Dispatch<React.SetStateAction<CheckedCourse[][]>>]
  destBufferHook: [CheckedCourse[][], React.Dispatch<React.SetStateAction<CheckedCourse[][]>>]
  repeatedCourseControlHook: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
  multipleOptions: MultipleOptions
  optionsList: any
}

/**
 * Sidebar with all the main schedule interactions
 */
const SessionController = ({
  openHook,
  coursesHook,
  extraCoursesActiveHook,
  extraCoursesModalOpenHook,
  sourceBufferHook,
  destBufferHook,
  repeatedCourseControlHook,
  multipleOptions,
  optionsList,
}: Props) => {
  return (
    <div className="flex w-full gap-1">
      {/* Course Picker */}
      <CoursePicker />

      {/* <CollaborativeSession /> */}
      <Export multipleOptions={multipleOptions} optionsList={optionsList} />
    </div>
  )
}

export default SessionController
