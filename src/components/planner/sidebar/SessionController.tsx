import CoursePicker from './sessionController/CoursePicker'
import Export from './sessionController/Export'

/**
 * Sidebar with all the main schedule interactions
 */
const SessionController = () => {
  return (
    <div className="flex w-full gap-1">
      <CoursePicker />
      {/* <CollaborativeSession /> */}
      <Export />
    </div>
  )
}

export default SessionController
