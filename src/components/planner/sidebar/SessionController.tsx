import CoursePicker from './sessionController/CoursePicker'
import Export from './sessionController/Export'
import Refresh from './sessionController/Refresh'
import CollaborativeSession from './sessionController/CollaborativeSession'
import DevMode from '../../ui/DevMode'
import { PlannerCoursePicker } from './sessionController/PlannerCoursePicker'
/**
 * Sidebar with all the main schedule interactions
 */
const SessionController = () => {
  return (
    <div className="flex w-full gap-1">
      <PlannerCoursePicker />
      <Refresh />
      <DevMode>
        <CollaborativeSession />
      </DevMode>
      <Export />
    </div>
  )
}

export default SessionController
