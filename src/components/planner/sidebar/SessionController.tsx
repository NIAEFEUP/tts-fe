import CoursePicker from './sessionController/CoursePicker'
import Export from './sessionController/Export'
import Refresh from './sessionController/Refresh'
import CollaborativeSession from './sessionController/CollaborativeSession'
import DevMode from '../../ui/DevMode'
/**
 * Sidebar with all the main schedule interactions
 */
const SessionController = () => {
  return (
    <div className="flex w-full gap-1">
      <CoursePicker />
      <Refresh />
      <DevMode>
        <CollaborativeSession />
      </DevMode>
      <Export />
    </div>
  )
}

export default SessionController
