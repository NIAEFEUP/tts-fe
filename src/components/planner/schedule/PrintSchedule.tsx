import { useCallback, useContext } from 'react'
import { ThemeContext } from '../../../contexts/ThemeContext'
import { Button } from '../../ui/button'
import { CameraIcon } from '@heroicons/react/24/outline'
import { toPng } from 'html-to-image'
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '../../ui/tooltip'

const PrintSchedule = ({ component }) => {
  const { enabled } = useContext(ThemeContext)

  const takeScreenshot = useCallback(
    (isThemeEnabled) => {
      if (component.current === null) {
        return
      }

      toPng(component.current, { cacheBust: true, backgroundColor: isThemeEnabled ? '#252733' : '#fbfbfb' })
        .then((dataUrl) => {
          const link = document.createElement('a')
          link.download = 'horario.png'
          link.href = dataUrl
          link.click()
        })
        .catch((err) => {
          console.log(err)
        })
    },
    [component]
  )

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant="icon" className="bg-lightish text-black" onClick={() => takeScreenshot(enabled)}>
            <CameraIcon className="h-5 w-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Descarregar imagem do horário</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default PrintSchedule
