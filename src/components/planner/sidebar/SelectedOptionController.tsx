import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover'
import EmojiPicker, { Theme, EmojiStyle, SuggestionMode } from 'emoji-picker-react'
import { ThemeContext } from '../../../contexts/ThemeContext'
import { useState, useContext, useRef, useEffect } from 'react'
import { CourseOption, Major, MultipleOptions } from '../../../@types'
import CopyOption from './selectedOptionController/CopyOption'
import PasteOption from './selectedOptionController/PasteOption'
import RandomFill from './selectedOptionController/RandomFill'
import { text } from 'stream/consumers'

interface Option {
  id: number
  icon: string
  name: string
}

type Props = {
  optionsListHook: [Option[], React.Dispatch<React.SetStateAction<Option[]>>]
  selectedOptionHook: [number, React.Dispatch<React.SetStateAction<number>>]
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

  // const renameOption = (event) => {
  //   const newName = event.target.value
  //   setOptionsList((prevOptionsList) => {
  //     const updatedOptionsList = prevOptionsList.map((item) =>
  //       item.id === selectedOption ? { ...item, name: newName } : item
  //     )
  //     localStorage.setItem('niaefeup-tts.optionsList', JSON.stringify(updatedOptionsList))
  //     return updatedOptionsList
  //   })
  // }

  const trimOptionName = (event) => {
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

  const option = getOptionById(selectedOption)

  return (
    <div className="flex w-full flex-col sm:flex-row lg:flex-col xl:flex-row xl:content-between xl:gap-5">
      <div className="order-2 flex flex-grow gap-3 sm:order-1 lg:order-2 xl:order-1">
        <Popover open={emojiPickerOpen} onOpenChange={setEmojiPickerOpen}>
          <PopoverTrigger className="aspect-square h-10 w-10 rounded p-1 text-xl hover:bg-lightish hover:dark:bg-darkish">
            <img src={option?.icon} className="h-full w-full" />
          </PopoverTrigger>
          <PopoverContent side="bottom" className="mx-5 w-96 rounded-full bg-lightish p-0 dark:bg-darkish">
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
          id="option-name"
          spellCheck="false"
          ref={textarea}
          rows={1}
          cols={40}
          maxLength={40}
          wrap="off"
          defaultValue={option ? option.name : ''}
          className="w-full resize-none overflow-x-auto scroll-smooth rounded border-none bg-inherit p-1 font-bold transition-all focus:font-normal"
          onBlur={trimOptionName}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              trimOptionName(e)
              e.target.blur()
            }
          }}
          onMouseMove={startScroll}
          onMouseLeave={stopScroll}
          onScroll={scroll}
        />
      </div>
      <div className="order-1 flex items-center gap-1 p-1 sm:order-2 sm:w-1/3 lg:order-1 lg:w-auto xl:order-2">
        <CopyOption majorHook={majorHook} currentOption={currentOption} className="sm:py-0 xl:p-1" />
        <PasteOption majorHook={majorHook} multipleOptionsHook={multipleOptionsHook} className="sm:py-0 xl:p-1" />
        <RandomFill multipleOptionsHook={multipleOptionsHook} className="sm:py-0 xl:p-1" />
      </div>
    </div>
  )
}

export default SelectedOptionController
