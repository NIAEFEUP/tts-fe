import { Button } from '../../ui/button'
import { ViewColumnsIcon } from '@heroicons/react/24/outline'

const ToggleScheduleGrid = ({ showGridHook }) => {
  const [showGrid, setShowGrid] = showGridHook

  return (
    <Button
      variant="icon"
      className="bg-lightish text-black"
      onClick={() => setShowGrid(!showGrid)}
      title={showGrid ? 'Ocultar grelha' : 'Mostrar grelha'}
    >
      <ViewColumnsIcon className="h-5 w-5" />
    </Button>
  )
}

export default ToggleScheduleGrid
