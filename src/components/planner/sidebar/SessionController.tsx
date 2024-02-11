import { CheckedCourse, Major, CourseOption, MultipleOptions } from '../../../@types'

// import OldCoursePicker from './sessionController/CoursePicker'
import CoursePicker from './sessionController/CoursePicker'

import CollaborativeSession from './sessionController/CollaborativeSession'
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
      <CoursePicker
        openHook={openHook}
        coursesHook={coursesHook}
        extraCoursesActiveHook={extraCoursesActiveHook}
        extraCoursesModalOpenHook={extraCoursesModalOpenHook}
        sourceBufferHook={sourceBufferHook}
        destBufferHook={destBufferHook}
        repeatedCourseControlHook={repeatedCourseControlHook}
      />

      {/* <CollaborativeSession /> */}
      <Export multipleOptions={multipleOptions} optionsList={optionsList} />
    </div>
  )
}

export default SessionController
