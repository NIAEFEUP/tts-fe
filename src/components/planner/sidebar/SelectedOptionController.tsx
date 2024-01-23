import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover'
import EmojiPicker, { Theme, EmojiStyle, SuggestionMode } from 'emoji-picker-react'
import { ThemeContext } from '../../../contexts/ThemeContext'
import { useState, useContext, useRef } from 'react'
import { CourseOption, Major, MultipleOptions } from '../../../@types'
import CopyOption from './selectedOptionController/CopyOption'
import PasteOption from './selectedOptionController/PasteOption'
import RandomFill from './selectedOptionController/RandomFill'

interface Option {
  id: number
  icon: string
  name: string
}

type Props = {
  optionsListHook: [Option[], React.Dispatch<React.SetStateAction<Option[]>>]
  selectedOptionHook: [number, React.Dispatch<React.SetStateAction<number>>]
  majors: Major[],
  majorHook: [Major, React.Dispatch<React.SetStateAction<Major>>]
  currentOption: CourseOption[]
  multipleOptionsHook: [MultipleOptions, React.Dispatch<React.SetStateAction<MultipleOptions>>]
}

/**
 * Interactions with the currently selected option
 */
const SelectedOptionController = ({
  optionsListHook,
  selectedOptionHook,
  majors,
  majorHook,
  currentOption,
  multipleOptionsHook,
}: Props) => {
  const { enabled, setEnabled } = useContext(ThemeContext)
  const [optionsList, setOptionsList] = optionsListHook
  const [selectedOption, setSelectedOption] = selectedOptionHook
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false)

  let isHovered = false
  let isScrollingBack = false
  const textarea = useRef(null)

  const startScroll = () => {
    if (document.activeElement === textarea.current) return
    isHovered = true
    textarea.current.scrollLeft += 5
  }

  const stopScroll = () => {
    if (document.activeElement === textarea.current) return
    isHovered = false
    textarea.current.scrollLeft = 0
  }

  const scroll = () => {
    if (document.activeElement === textarea.current) return
    if (isHovered) {
      if (isScrollingBack) {
        if (textarea.current.scrollLeft == 0) isScrollingBack = false
        else return
      }
      if (textarea.current.scrollLeft >= textarea.current.scrollWidth - textarea.current.clientWidth) {
        isScrollingBack = true
        textarea.current.scrollLeft = 0
      } else {
        textarea.current.scrollLeft += 5
      }
    }
  }

  const getOptionById = (id: number) => {
    return optionsList.find((elem) => elem.id === id)
  }

  const renameOptionName = (event) => {
    const newName = event.target.value.trim()
    event.target.value = newName
    setOptionsList((prevOptionsList) => {
      const updatedOptionsList = prevOptionsList.map((item) =>
        item.id === selectedOption ? { ...item, name: newName } : item
      )
      localStorage.setItem('niaefeup-tts.optionsList', JSON.stringify(updatedOptionsList))
      return updatedOptionsList
    })
  }

  const changeOptionIcon = (newIcon) => {
    setOptionsList((prevOptionsList) => {
      const updatedOptionsList = prevOptionsList.map((item) =>
        item.id === selectedOption ? { ...item, icon: newIcon } : item
      )
      localStorage.setItem('niaefeup-tts.optionsList', JSON.stringify(updatedOptionsList))
      return updatedOptionsList
    })
  }

  return (
    <div className="flex flex-col w-full sm:flex-row lg:flex-col xl:flex-row xl:content-between xl:gap-5">
      <div className="flex flex-grow order-2 gap-3 sm:order-1 lg:order-2 xl:order-1">
        <Popover open={emojiPickerOpen} onOpenChange={setEmojiPickerOpen}>
          <PopoverTrigger className="w-10 h-10 p-1 text-xl rounded aspect-square hover:bg-lightish hover:dark:bg-darkish">
            <img src={getOptionById(selectedOption)?.icon} className="w-full h-full" />
          </PopoverTrigger>
          <PopoverContent side="bottom" className="p-0 mx-5 rounded-full w-96 bg-lightish dark:bg-darkish">
            <EmojiPicker
              width={'100%'}
              searchDisabled={true}
              previewConfig={{ showPreview: false }}
              theme={enabled ? Theme.DARK : Theme.LIGHT}
              suggestedEmojisMode={SuggestionMode.RECENT}
              emojiStyle={EmojiStyle.APPLE}
              onEmojiClick={(emojiData, event) => {
                changeOptionIcon(emojiData.imageUrl)
                setEmojiPickerOpen(false)
              }}
            />
          </PopoverContent>
        </Popover>

        <textarea
          key={selectedOption}
          id="option-name"
          spellCheck="false"
          ref={textarea}
          rows={1}
          cols={40}
          maxLength={40}
          wrap="off"
          defaultValue={getOptionById(selectedOption)?.name}
          className="w-full p-1 overflow-x-auto font-bold transition-all border-none rounded resize-none scroll-smooth bg-inherit focus:font-normal"
          onBlur={renameOptionName}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              renameOptionName(e)
              e.target.blur()
            }
          }}
          onMouseMove={startScroll}
          onMouseLeave={stopScroll}
          onScroll={scroll}
        />
      </div>
      <div className="flex items-center order-1 gap-1 p-1 sm:order-2 sm:w-1/3 lg:order-1 lg:w-auto xl:order-2">
        <CopyOption majorHook={majorHook} currentOption={currentOption} className="sm:py-0 xl:p-1" />
        <PasteOption majors={majors} majorHook={majorHook} multipleOptionsHook={multipleOptionsHook} className="sm:py-0 xl:p-1" />
        <RandomFill multipleOptionsHook={multipleOptionsHook} className="sm:py-0 xl:p-1" />
      </div>
    </div>
  )
}

export default SelectedOptionController
