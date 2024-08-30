import CoursePicker from './sessionController/CoursePicker'
import Export from './sessionController/Export'
import Refresh from './sessionController/Refresh'
import Collab from './sessionController/Collab'

/**
 * Sidebar with all the main schedule interactions
 */
const SessionController = () => {
  return (
    <div className="flex w-full gap-1">
      <CoursePicker />
      <Refresh />
      <Collab />
      <Export />
    </div>
  )
}

export default SessionController
