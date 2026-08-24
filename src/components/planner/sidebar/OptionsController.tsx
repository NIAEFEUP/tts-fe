import { Option } from '../../../@types/index'
import { ReactSortable } from 'react-sortablejs'
import { useContext } from 'react'
import MultipleOptionsContext from '../../../contexts/MultipleOptionsContext'
import { Tooltip } from '../../ui/new/tooltip'
import { AnalyticsTracker, Feature } from '../../../utils/AnalyticsTracker'
import { Button } from '../../ui/new/button'
import { Blobatar } from "@blobatar/react";
import "blobatar/motion.css";

/**
 * Sortable list of schedule options
 * Each option can be selected by clicking on it
 */
const OptionsController = () => {
  const { multipleOptions, selectedOption, setSelectedOption, setMultipleOptions } = useContext(MultipleOptionsContext)

  return (
    <ReactSortable
      className="m-y-2 flex flex-row justify-center gap-2 overflow-x-auto py-2 text-center w-full lg:justify-start"
      list={multipleOptions}
      setList={(newMultipleOptions) => {
        const prevId = multipleOptions[selectedOption].id
        setMultipleOptions(newMultipleOptions)
        if (newMultipleOptions[selectedOption].id !== prevId) {
          setSelectedOption(newMultipleOptions.findIndex((currentOption) => currentOption.id === prevId))
        }
      }}
      group="groupName"
      animation={200}
      delay={2}
      multiDrag
      onEnd={() => {
        AnalyticsTracker.trackFeature(Feature.OPTION_REORDER)
      }}
    >
      {multipleOptions.map((option: Option) => (
        <OptionButton
          key={multipleOptions.findIndex((currentOption) => currentOption.id === option.id)}
          option={option}
        />
      ))}
    </ReactSortable>
  )
}

type Props = {
  option: Option
}

const OptionButton = ({ option }: Props) => {
  const { multipleOptions, selectedOption, setSelectedOption } = useContext(MultipleOptionsContext)

  return (
    <Tooltip>
      <Tooltip.Trigger
        asChild
        onClick={() => {
          setSelectedOption(multipleOptions.findIndex((currentOption) => currentOption.id === option.id))
        }}
      >
        <Button
          square
          size="md"
          className={`p-2 hover:bg-primary/75 ${multipleOptions[selectedOption].id === option.id ? 'bg-primary/75 dark:bg-primary/50' : 'bg-lightish dark:bg-darkish'}`}
        >
          <Blobatar
            name={option.name}
            traits={{ "body.r": 0.999 }}
            animate="always"
          />
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Content className="truncate">{option.name}</Tooltip.Content>
    </Tooltip>
  )
}

export default OptionsController
