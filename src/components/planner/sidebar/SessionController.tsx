import Export from './sessionController/Export'
import Refresh from './sessionController/Refresh'
import CollaborativeSession from './sessionController/CollaborativeSession'
import { PlannerCoursePicker } from './sessionController/PlannerCoursePicker'
/**
 * Sidebar with all the main schedule interactions
 */
const SessionController = () => {
  return (
    <div className="flex w-full gap-1">
      <PlannerCoursePicker />
      <Refresh />
      <CollaborativeSession />
      <Export />
    </div>
  )
}

export default SessionController
