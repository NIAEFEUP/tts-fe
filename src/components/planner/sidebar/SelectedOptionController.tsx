import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover'
import EmojiPicker, { Theme, EmojiStyle, SuggestionMode } from 'emoji-picker-react'
import { ThemeContext } from '../../../contexts/ThemeContext'
import { useContext } from 'react'

interface Option {
  id: number
  icon: string
  name: string
}

type Props = {
  optionsListHook: [Option[], React.Dispatch<React.SetStateAction<Option[]>>]
  selectedOptionHook: [number, React.Dispatch<React.SetStateAction<number>>]
}

/**
 * Interactions with the currently selected option
 */
const SelectedOptionController = ({ optionsListHook, selectedOptionHook }: Props) => {
  const { enabled, setEnabled } = useContext(ThemeContext)
  const [optionsList, setOptionsList] = optionsListHook
  const [selectedOption, setSelectedOption] = selectedOptionHook

  const getOptionById = (id: number) => {
    return optionsList.find((elem) => elem.id === id)
  }

  const renameOption = (event) => {
    console.log('coise')
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
    <div className="flex w-full flex-row items-center gap-3">
      <Popover>
        <PopoverTrigger className="aspect-square h-10 w-10 rounded p-1 text-xl hover:bg-lightish hover:dark:bg-darkish">
          <img src={option?.icon} className="h-full w-full" />
        </PopoverTrigger>
        <PopoverContent>
          <EmojiPicker
            searchDisabled={true}
            previewConfig={{ showPreview: false }}
            theme={enabled ? Theme.DARK : Theme.LIGHT}
            suggestedEmojisMode={SuggestionMode.RECENT}
            emojiStyle={EmojiStyle.APPLE}
            onEmojiClick={(emojiData, event) => {
              changeOptionIcon(emojiData.imageUrl)
              console.log(event.target)
              // blur()
            }}
          />
        </PopoverContent>
      </Popover>

      <input
        className="w-full bg-inherit p-1 font-bold transition-all focus:font-normal"
        maxLength={30}
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
  )
}

export default SelectedOptionController
