import { useCallback, useContext } from 'react'
import { ThemeContext } from '../../../contexts/ThemeContext'
import { Button } from '../../ui/new/button'
import { Camera } from 'lucide-react'
import { toPng } from 'html-to-image'
import { Tooltip, TooltipTrigger, TooltipContent } from '../../ui/new/tooltip'
import { AnalyticsTracker, Feature } from '../../../utils/AnalyticsTracker'

type Props = {
  component: any
  optionName?: string
}

const PrintSchedule = ({ component, optionName }: Props) => {
  const { enabled } = useContext(ThemeContext)

  const takeScreenshot = useCallback(
    (isThemeEnabled) => {
      if (!component.current) return

      const rect = component.current.getBoundingClientRect()
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
      const clone = component.current.cloneNode(true) as HTMLElement

      // Remove bottom bar
      const bottomBars = clone.querySelectorAll('div.flex.justify-end')
      bottomBars.forEach((bar) => bar.remove())
      const lastChild = clone.lastElementChild
      if (lastChild && lastChild.classList.contains('flex') && lastChild.classList.contains('justify-end')) {
        lastChild.remove()
      }

      container.appendChild(clone)
      document.body.appendChild(container)

      container.style.display = 'inline-block'
      toPng(container, { cacheBust: true, pixelRatio: 2 })
        .then((dataUrl) => {
          const link = document.createElement('a')
          link.href = dataUrl
          link.download = optionName ? `${optionName}.png` : 'horario.png'
          link.click()
        })
        .catch((err) => {
          console.error(err)
        })
        .finally(() => {
          container.remove() // remove do DOM
        })

      AnalyticsTracker.trackFeature(Feature.SCREENSHOT)
    },
    [component, enabled, optionName],
  )

  return (
    <Tooltip delayIn={300}>
      <TooltipTrigger asChild onClick={() => takeScreenshot(enabled)}>
        <Button square className="bg-lightish hover:bg-lightish/90 text-black dark:bg-darkish dark:text-white">
          <Camera size="18" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Descarregar imagem do horário</TooltipContent>
    </Tooltip>
  )
}

export default PrintSchedule
