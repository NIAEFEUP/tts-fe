import { useContext } from 'react'
import { CheckedCourse, Major, CourseOption, MultipleOptions } from '../../../@types'

import CoursePicker from './sessionController/CoursePicker'

import Export from './sessionController/Export'
import MultipleOptionsContext from '../../../contexts/MultipleOptionsContext'

/**
 * Sidebar with all the main schedule interactions
 */
const SessionController = () => {
  const { multipleOptions } = useContext(MultipleOptionsContext)
  return (
    <div className="flex w-full gap-1">
      {/* Course Picker */}
      <CoursePicker />

      {/* <CollaborativeSession /> */}
      <Export multipleOptions={multipleOptions} />
    </div>
  )
}

export default SessionController
