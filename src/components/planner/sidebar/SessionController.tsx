import CoursePicker from './sessionController/CoursePicker'
import Export from './sessionController/Export'
import Refresh from './sessionController/Refresh'

/**
 * Sidebar with all the main schedule interactions
 */
const SessionController = () => {
  return (
    <div className="flex w-full gap-1">
      <CoursePicker />
      {/* <CollaborativeSession /> */}
      <Refresh />
      <Export />
    </div>
  )
}

export default SessionController
