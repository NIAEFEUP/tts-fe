import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover'
import EmojiPicker, { Theme, EmojiStyle, SuggestionMode } from 'emoji-picker-react'
import { ThemeContext } from '../../../contexts/ThemeContext'
import { useState, useContext } from 'react'
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
  majorHook: [Major, React.Dispatch<React.SetStateAction<Major>>]
  currentOption: CourseOption[],
  multipleOptionsHook: [MultipleOptions, React.Dispatch<React.SetStateAction<MultipleOptions>>]
}

/**
 * Interactions with the currently selected option
 */
const SelectedOptionController = ({ optionsListHook, selectedOptionHook, majorHook, currentOption, multipleOptionsHook }: Props) => {
  const { enabled, setEnabled } = useContext(ThemeContext)
  const [optionsList, setOptionsList] = optionsListHook
  const [selectedOption, setSelectedOption] = selectedOptionHook
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false)

  const getOptionById = (id: number) => {
    return optionsList.find((elem) => elem.id === id)
  }

  const renameOption = (event) => {
    const newName = event.target.value
    setOptionsList((prevOptionsList) => {
      const updatedOptionsList = prevOptionsList.map((item) =>
        item.id === selectedOption ? { ...item, name: newName } : item
      )
      localStorage.setItem('niaefeup-tts.optionsList', JSON.stringify(updatedOptionsList))
      return updatedOptionsList
    })
  }

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
    <div className="flex content-between w-full gap-5">
      <div className="flex gap-3">
        <Popover open={emojiPickerOpen} onOpenChange={setEmojiPickerOpen}>
          <PopoverTrigger className="w-10 h-10 p-1 text-xl rounded aspect-square hover:bg-lightish hover:dark:bg-darkish">
            <img src={option?.icon} className="w-full h-full" />
          </PopoverTrigger>
          <PopoverContent side="bottom" className="p-0 rounded-full w-96 bg-lightish dark:bg-darkish">
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

        <input
          className="w-full p-1 font-bold transition-all bg-inherit focus:font-normal"
          maxLength={25}
          value={option ? option.name : ''}
          onChange={renameOption}
          onBlur={trimOptionName}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              trimOptionName(e)
              e.target.blur()
            }
          }}
        />
      </div>
      <div className="flex items-center gap-1">
        <CopyOption majorHook={majorHook} currentOption={currentOption} />
        <PasteOption majorHook={majorHook} multipleOptionsHook={multipleOptionsHook} />
        <RandomFill />
      </div>
    </div>
  )
}

export default SelectedOptionController
