import { useCallback, useContext } from 'react'
import { ThemeContext } from '../../../contexts/ThemeContext'
import { Button } from '../../ui/button'
import { CameraIcon } from '@heroicons/react/24/outline'
import { toPng } from 'html-to-image'
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from '../../ui/tooltip'
import { AnalyticsTracker, Feature } from '../../../utils/AnalyticsTracker'
import { LogoNIAEFEUPImage } from '../../../images'

type Props = {
  component: any
  optionName?: string
}

const PrintSchedule = ({ component, optionName }: Props) => {
  const { enabled } = useContext(ThemeContext)

  const takeScreenshot = useCallback(
    (isThemeEnabled) => {
      if (!component.current) return

      const original = component.current
      const rect = original.getBoundingClientRect()
      const generalPadding = rect.height * 0.05

      // Create container
      const container = document.createElement('div')
      container.style.width = `${rect.width}px`
      container.style.height = `${rect.height}px`
      container.style.padding = `${generalPadding}px`
      container.style.boxSizing = 'border-box'
      container.style.backgroundColor = isThemeEnabled ? '#252733' : '#fbfbfb'
      container.style.position = 'relative'
      container.style.display = 'none' // hide until everything loaded

      // Clone original
      const clone = original.cloneNode(true) as HTMLElement

      // Remove bottom bar
      const bottomBars = clone.querySelectorAll('div.flex.justify-end')
      bottomBars.forEach(bar => bar.remove())
      const lastChild = clone.lastElementChild
      if (lastChild && lastChild.classList.contains('flex') && lastChild.classList.contains('justify-end')) {
        lastChild.remove()
      }

      container.appendChild(clone)


      document.body.appendChild(container)

      

      
      container.style.display = 'inline-block' // show container
      toPng(container, { cacheBust: true, pixelRatio: 2, useCORS: true })
          .then((dataUrl) => {
            const link = document.createElement('a')
            link.href = dataUrl
            link.download = optionName ? `${optionName}.png` : 'horario.png'
            link.click()
          })
          .catch((err) => {
          console.error(err)
        })

      AnalyticsTracker.trackFeature(Feature.SCREENSHOT)
    },
    [component, enabled, optionName]
  )

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="icon"
            className="bg-lightish text-black dark:bg-darkish dark:text-white"
            onClick={() => takeScreenshot(enabled)}
          >
            <CameraIcon className="h-5 w-5" />
          </Button>
        </TooltipTrigger>
        <TooltipContent>Descarregar imagem do horário</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default PrintSchedule
