import { CheckedCourse, Major, CourseOption, MultipleOptions } from '../../../@types'

import CoursePicker from './sessionController/CoursePicker'

import Export from './sessionController/Export'

type Props = {
  multipleOptions: MultipleOptions
  optionsList: any
}

/**
 * Sidebar with all the main schedule interactions
 */
const SessionController = ({ multipleOptions, optionsList }: Props) => {
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
