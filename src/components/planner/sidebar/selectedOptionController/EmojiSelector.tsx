import EmojiPicker, { EmojiClickData, EmojiStyle, SuggestionMode, Theme } from 'emoji-picker-react'
import { useContext, useState } from 'react'
import MultipleOptionsContext from '../../../../contexts/MultipleOptionsContext'
import { ThemeContext } from '../../../../contexts/ThemeContext'
import { AnalyticsTracker, Feature } from '../../../../utils/AnalyticsTracker'
import { Button } from '../../../ui/new/button'
import { Popover } from '../../../ui/new/popover'
import { cn } from '../../../../lib/utils'

type Props = {
  className?: string
}

const EmojiSelector = ({ className }: Props) => {
  const { enabled } = useContext(ThemeContext)
  const { multipleOptions, setMultipleOptions, selectedOption } = useContext(MultipleOptionsContext)
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false)

  const changeOptionIcon = (newIcon: EmojiClickData) => {
    setMultipleOptions((prevMultipleOptions) => {
      const updatedMultipleOptions = prevMultipleOptions.map((item) =>
        item.id === multipleOptions[selectedOption].id ? { ...item, icon: newIcon.imageUrl } : item,
      )
      return updatedMultipleOptions
    })
    AnalyticsTracker.trackFeature(Feature.OPTION_EMOJI)
    AnalyticsTracker.emoji(newIcon.emoji)
  }

  return (
    <Popover placement="bottom">
      <Popover.Trigger
        className="aspect-square h-10 w-10 rounded-md p-2 bg-lightish hover:bg-lightish/90
      dark:bg-darkish"
      >
        <img src={multipleOptions[selectedOption]?.icon} alt={multipleOptions[selectedOption].name} />
      </Popover.Trigger>
      <Popover.Content className="w-96 p-0">
        <EmojiPicker
          width="100%"
          searchDisabled={true}
          previewConfig={{ showPreview: false }}
          theme={enabled ? Theme.DARK : Theme.LIGHT}
          suggestedEmojisMode={SuggestionMode.RECENT}
          emojiStyle={EmojiStyle.APPLE}
          onEmojiClick={changeOptionIcon}
        />
      </Popover.Content>
    </Popover>
  )
}

export default EmojiSelector
