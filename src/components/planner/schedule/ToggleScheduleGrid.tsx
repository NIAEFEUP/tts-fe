import { Button } from '../../ui/new/button'
import { Columns3 } from 'lucide-react'
import { Tooltip, TooltipTrigger, TooltipContent } from '../../ui/new/tooltip'
import { AnalyticsTracker, Feature } from '../../../utils/AnalyticsTracker'
import * as React from 'react'

type Props = {
  showGridHook: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
}

const ToggleScheduleGrid = ({ showGridHook }: Props) => {
  const [showGrid, setShowGrid] = showGridHook

  return (
    <Tooltip delayIn={300}>
      <TooltipTrigger
        asChild
        onClick={() => {
          setShowGrid(!showGrid)
          AnalyticsTracker.trackFeature(Feature.GRID)
        }}
      >
        <Button square className="bg-lightish hover:bg-lightish/90 text-black dark:bg-darkish dark:text-white">
          <Columns3 size="18" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>{showGrid ? 'Ocultar a grelha do horário' : 'Mostrar a grelha do horário'}</TooltipContent>
    </Tooltip>
  )
}

export default ToggleScheduleGrid
