import { Button } from '../../ui/button'
import { ViewColumnsIcon } from '@heroicons/react/24/outline'
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '../../ui/tooltip'

const ToggleScheduleGrid = ({ showGridHook }) => {
  const [showGrid, setShowGrid] = showGridHook

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="icon" className="bg-lightish text-black" onClick={() => setShowGrid(!showGrid)}>
            <ViewColumnsIcon className="h-5 w-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>{showGrid ? 'Ocultar a grelha do horário' : 'Mostrar a grelha do horário'}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default ToggleScheduleGrid
