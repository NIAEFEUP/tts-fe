import { Export, CollaborativeSession, CoursePicker } from './sessionController'
import { CheckedCourse, Course, Major, CourseOption, MultipleOptions } from '../../../@types'

type Props = {
  majors: Major[]
  openHook: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
  majorHook: [Major, React.Dispatch<React.SetStateAction<Major>>]
  coursesHook: [CheckedCourse[][], React.Dispatch<React.SetStateAction<CheckedCourse[][]>>]
  extraCoursesActiveHook: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
  extraCoursesModalOpenHook: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
  sourceBufferHook: [CheckedCourse[][], React.Dispatch<React.SetStateAction<CheckedCourse[][]>>]
  destBufferHook: [CheckedCourse[][], React.Dispatch<React.SetStateAction<CheckedCourse[][]>>]
  repeatedCourseControlHook: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
  schedule: CourseOption[]
  multipleOptions: MultipleOptions
}

/**
 * Sidebar with all the main schedule interactions
 */
const SessionController = ({
  majors,
  openHook,
  majorHook,
  coursesHook,
  extraCoursesActiveHook,
  extraCoursesModalOpenHook,
  sourceBufferHook,
  destBufferHook,
  repeatedCourseControlHook,
  schedule,
  multipleOptions,
}: Props) => {
  return (
    <div className="flex justify-between">
      <CoursePicker
        majors={majors}
        openHook={openHook}
        majorHook={majorHook}
        coursesHook={coursesHook}
        extraCoursesActiveHook={extraCoursesActiveHook}
        extraCoursesModalOpenHook={extraCoursesModalOpenHook}
        sourceBufferHook={sourceBufferHook}
        destBufferHook={destBufferHook}
        repeatedCourseControlHook={repeatedCourseControlHook}
      />
      <div>
        <CollaborativeSession />
        <Export schedule={schedule} multipleOptions={multipleOptions} />
      </div>
    </div>
  )
}

export default SessionController
