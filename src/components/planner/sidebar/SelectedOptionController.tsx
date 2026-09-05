import { useState, useRef, useEffect, useContext } from 'react'
import { CopyOption, PasteOption, RandomFill } from './selectedOptionController/index'
import { Blobatar } from "@blobatar/react";
import "blobatar/motion.css";
import MultipleOptionsContext from '../../../contexts/MultipleOptionsContext'
import { CourseOption } from '../../../@types'
import { AnalyticsTracker, Feature } from '../../../utils/AnalyticsTracker'
import { Input } from '../../ui/new/input'

type Props = {
  currentOption: CourseOption[]
}

/**
 * Interactions with the currently selected option
 */
const SelectedOptionController = ({ currentOption }: Props) => {
  const { multipleOptions, setMultipleOptions, selectedOption } = useContext(MultipleOptionsContext)

  const input = useRef(null)

  const inputIsActive = () => document.activeElement === input.current

  //TODO(thePeras): Fix these functions using states and setInterval
  const startScroll = () => {
    if (inputIsActive()) return

    input.current.scrollLeft += 5
  }

  const stopScroll = () => {
    if (inputIsActive()) return

    input.current.scrollLeft = 0
  }

  const [optionName, setOptionName] = useState(multipleOptions[selectedOption].name ?? '')

  useEffect(() => {
    setOptionName(multipleOptions[selectedOption].name)
  }, [selectedOption, multipleOptions])

  const renameOptionName = (event) => {
    const newName = event.target.value
    if (newName.length > 35) return
    event.target.value = newName
    setMultipleOptions((prevMultipleOptions) => {
      const updatedMultipleOptions = prevMultipleOptions.map((item) =>
        item.id === multipleOptions[selectedOption].id ? { ...item, name: newName } : item,
      )
      return updatedMultipleOptions
    })
    AnalyticsTracker.trackFeature(Feature.OPTION_RENAME)
  }

  return (
    <div className="flex w-full flex-col sm:flex-row lg:flex-col xl:flex-row xl:content-between gap-2">
      <div className="order-2 flex grow gap-2 sm:order-1 lg:order-2 xl:order-1">
        <Input
          key={selectedOption}
          id="option-name"
          spellCheck="false"
          ref={input}
          value={optionName}
          onChange={renameOptionName}
          onBlur={renameOptionName}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              renameOptionName(e)
              e.currentTarget.blur() // currentTarget is the element the event handler was attached to
            }
          }}
          onMouseMove={startScroll}
          onMouseLeave={stopScroll}
        />
      </div>
      <div className="order-1 flex items-center gap-1 sm:order-2 sm:w-1/3 lg:order-1 lg:w-auto xl:order-2 justify-between">
        <CopyOption currentOption={currentOption} className="sm:py-0 xl:p-1" />
        <PasteOption />
        <RandomFill className="sm:py-0 xl:p-1" />
      </div>
    </div>
  )
}

export default SelectedOptionController
