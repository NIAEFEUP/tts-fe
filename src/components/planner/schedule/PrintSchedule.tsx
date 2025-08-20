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
      container.style.paddingRight = `${generalPadding}px`
      container.style.paddingBottom = `${generalPadding}px`
      container.style.paddingLeft = `${generalPadding}px`
      container.style.paddingTop = `${rect.height * 0.1}px`
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

      // Logo
      const logoImg = document.createElement('img')
      logoImg.src = LogoNIAEFEUPImage
      logoImg.alt = 'Logo'
      logoImg.style.position = 'absolute'
      logoImg.style.top = '10px'
      logoImg.style.left = `${generalPadding}px`
      logoImg.style.height = `${rect.height * 0.10}px`
      logoImg.style.width = 'auto'
      logoImg.style.zIndex = '1000'
      container.appendChild(logoImg)

      // Option name text
      if (optionName) {
        const titleText = document.createElement('div')
        titleText.textContent = optionName
        titleText.style.position = 'absolute'
        titleText.style.top = '10px'
        titleText.style.left = `${generalPadding + rect.height * 0.12}px`
        titleText.style.height = '80px'
        titleText.style.display = 'flex'
        titleText.style.alignItems = 'center'
        titleText.style.fontSize = '24px'
        titleText.style.fontWeight = 'bold'
        titleText.style.color = isThemeEnabled ? '#ffffff' : '#000000'
        titleText.style.zIndex = '1000'
        titleText.style.fontFamily = 'Arial, sans-serif'
        titleText.style.whiteSpace = 'nowrap'
        container.appendChild(titleText)
      }

      document.body.appendChild(container)

      // Wait for all images to load
      const waitForImages = (parent: HTMLElement) => {
        const images = Array.from(parent.querySelectorAll('img'))
        return Promise.all(images.map(img => {
          if (img.complete) return Promise.resolve()
          return new Promise<void>((res) => {
            img.onload = () => res()
            img.onerror = () => res() // resolve even if failed
          })
        }))
      }

      waitForImages(container).then(() => {
        container.style.display = 'inline-block' // show container
        toPng(container, { cacheBust: true, pixelRatio: 2, useCORS: true })
          .then((dataUrl) => {
            const link = document.createElement('a')
            link.href = dataUrl
            link.download = optionName ? `${optionName}.png` : 'horario.png'
            link.click()
          })
          .catch(err => console.error(err))
          .finally(() => {
            document.body.removeChild(container)
          })
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

