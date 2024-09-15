import CoursePicker from './sessionController/CoursePicker'
import Export from './sessionController/Export'
import Refresh from './sessionController/Refresh'
import CollaborativeSession from './sessionController/CollaborativeSession'

/**
 * Sidebar with all the main schedule interactions
 */
const SessionController = () => {
  return (
    <div className="flex w-full gap-1">
      <CoursePicker />
      <Refresh />
      {import.meta.env.VITE_APP_PROD == 0 && <CollaborativeSession />}
      <Export />
    </div>
  )
}

export default SessionController
