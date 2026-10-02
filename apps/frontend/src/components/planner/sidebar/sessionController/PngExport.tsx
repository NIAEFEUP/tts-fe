import { useCallback, useContext } from 'react'
import { Camera } from 'lucide-react'
import { toPng } from 'html-to-image'
import { ThemeContext } from '../../../../contexts/ThemeContext'
import MultipleOptionsContext from '../../../../contexts/MultipleOptionsContext'
import { AnalyticsTracker, Feature } from '../../../../utils/AnalyticsTracker'

const PngExport = () => {
  const { enabled } = useContext(ThemeContext)
  const { multipleOptions, selectedOption } = useContext(MultipleOptionsContext)
  const optionName = multipleOptions?.[selectedOption]?.name

  const takeScreenshot = useCallback(() => {
    // The desktop and mobile layouts both render a `.schedule-area` node at
    // the same time (CSS hides whichever doesn't match the viewport), so we
    // can't just grab the first match — that one might be `display: none`
    // and have zero size, producing an empty/corrupt PNG.
    const candidates = document.querySelectorAll<HTMLElement>('.schedule-area')
    const component = Array.from(candidates).find((el) => el.offsetWidth > 0 && el.offsetHeight > 0)
    if (!component) return

    const rect = component.getBoundingClientRect()
    const generalPadding = rect.height * 0.05

    // Create container
    const container = document.createElement('div')
    container.style.width = `${rect.width}px`
    container.style.height = `${rect.height}px`
    container.style.padding = `${generalPadding}px`
    container.style.boxSizing = 'border-box'
    container.style.backgroundColor = enabled ? '#252733' : '#fbfbfb'
    container.style.position = 'relative'
    container.style.display = 'none' // hide until everything loaded

    // Clone original
    const clone = component.cloneNode(true) as HTMLElement

    // Remove bottom bar
    const bottomBars = clone.querySelectorAll('div.flex.justify-end')
    bottomBars.forEach((bar) => bar.remove())
    const lastChild = clone.lastElementChild
    if (lastChild?.classList.contains('flex') && lastChild.classList.contains('justify-end')) {
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
      .catch((err) => console.error(err))
      .finally(() => container.remove())

    AnalyticsTracker.trackFeature(Feature.SCREENSHOT)
  }, [enabled, optionName])

  return (
    <button
      onClick={takeScreenshot}
      className="group flex w-full items-center gap-2 dark:text-white rounded-md p-1 text-gray text-sm disabled:cursor-not-allowed disabled:opacity-50"
    >
      <Camera className="h-5 w-5 text-secondary black:hover:brightness-200" />
      <span className="pl-1">Exportar Horário (PNG)</span>
    </button>
  )
}

export default PngExport
