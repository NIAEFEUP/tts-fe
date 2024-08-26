//TODO(thePeras): Check this package, its extremely heavy (231.2k, gzipped: 50.8k)
import EmojiPicker, { Theme, EmojiStyle, SuggestionMode } from 'emoji-picker-react'
import { useState, useContext, useRef, useEffect } from 'react'
import CopyOption from './selectedOptionController/CopyOption'
import PasteOption from './selectedOptionController/PasteOption'
import MultipleOptionsContext from '../../../contexts/MultipleOptionsContext'
import { CourseOption } from '../../../@types'
import { ThemeContext } from '../../../contexts/ThemeContext'
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover'
import RandomFill from './selectedOptionController/RandomFill'

type Props = {
  currentOption: CourseOption[]
}

/**
 * Interactions with the currently selected option
 */
const SelectedOptionController = ({
  currentOption,
}: Props) => {
  const { enabled } = useContext(ThemeContext)
  const { multipleOptions, setMultipleOptions, selectedOption } = useContext(MultipleOptionsContext);
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false)

  let isHovered = false
  let isScrollingBack = false

  const input = useRef(null)
  const [scrollDirection, setScrollDirection] = useState(1); // 1 is right, -1 is left

  const inputIsActive = () => document.activeElement === input.current;

  //TODO(thePeras): Fix these functions using states and setInterval
  const startScroll = () => {
    if (inputIsActive()) return;

    isHovered = true
    input.current.scrollLeft += 5
  }

  const stopScroll = () => {
    if (inputIsActive()) return;

    isHovered = false
    input.current.scrollLeft = 0
  }

  const getOptionById = (id: number) => {
    return multipleOptions.find((elem) => elem.id === id)
  }

  const [optionName, setOptionName] = useState(multipleOptions.find((elem) => elem.id === selectedOption).name ?? '');

  useEffect(() => {
    setOptionName(multipleOptions.find((elem) => elem.id === selectedOption).name)
  }, [selectedOption, multipleOptions])

  const renameOptionName = (event) => {
    const newName = event.target.value;
    if (newName.length > 35) return;
    event.target.value = newName
    setMultipleOptions((prevMultipleOptions) => {
      const updatedMultipleOptions = prevMultipleOptions.map((item) =>
        item.id === selectedOption ? { ...item, name: newName } : item
      )
      return updatedMultipleOptions;
    })
  }

  const changeOptionIcon = (newIcon) => {
    setMultipleOptions((prevMultipleOptions) => {
      const updatedMultipleOptions = prevMultipleOptions.map((item) =>
        item.id === selectedOption ? { ...item, icon: newIcon } : item
      )
      return updatedMultipleOptions;
    })
  }

  return (
    <div className="flex w-full flex-col sm:flex-row lg:flex-col xl:flex-row xl:content-between xl:gap-5">
      <div className="order-2 flex flex-grow gap-2 sm:order-1 lg:order-2 xl:order-1">
        <Popover open={emojiPickerOpen} onOpenChange={setEmojiPickerOpen}>
          <PopoverTrigger className="aspect-square h-10 w-15 rounded-md p-1 px-2 text-xl bg-lightish dark:bg-darkish border border-slate-200 dark:border-slate-800">
            <img
              src={getOptionById(selectedOption)?.icon}
              alt={multipleOptions[selectedOption].name}
            />
          </PopoverTrigger>
          <PopoverContent side="bottom" className="mx-5 w-96 rounded-full bg-lightish p-0 dark:bg-darkish">
            <EmojiPicker
              width="100%"
              searchDisabled={true}
              previewConfig={{ showPreview: false }}
              theme={enabled ? Theme.DARK : Theme.LIGHT}
              suggestedEmojisMode={SuggestionMode.RECENT}
              emojiStyle={EmojiStyle.APPLE}
              onEmojiClick={(emojiData, e) => {
                changeOptionIcon(emojiData.imageUrl)
                setEmojiPickerOpen(false)
              }}
            />
          </PopoverContent>
        </Popover>

        <input
          key={selectedOption}
          id="option-name"
          spellCheck="false"
          ref={input}
          value={optionName}
          className="w-full resize-none overflow-x-auto scroll-smooth rounded border-none bg-inherit p-1 transition-all font-medium"
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
      <div className="order-1 flex items-center gap-1 p-1 sm:order-2 sm:w-1/3 lg:order-1 lg:w-auto xl:order-2">
        <CopyOption currentOption={currentOption} className="sm:py-0 xl:p-1" />
        <PasteOption />
        <RandomFill className="sm:py-0 xl:p-1" />
      </div>
    </div>
  )
}

export default SelectedOptionController
