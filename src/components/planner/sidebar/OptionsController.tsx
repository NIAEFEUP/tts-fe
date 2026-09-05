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
      className="m-y-2 flex flex-row justify-center gap-2 py-2 px-1 text-center w-full overflow-x-auto lg:justify-start !overflow-y-visible"
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
  const index = multipleOptions.findIndex((currentOption) => currentOption.id === option.id)

  const isSelected = multipleOptions[selectedOption].id === option.id

  return (
    <Tooltip>
      <Tooltip.Trigger
        asChild
        onClick={() => {
          setSelectedOption(index)
        }}
      >
        <Button
          square
          size="md"
          aria-label={option.name}
          className={`relative p-1 shrink-0 ${isSelected ? 'bg-primary/75 hover:bg-primary/90 dark:bg-primary/50 dark:hover:bg-primary/60' : 'bg-lightish hover:bg-black/10 dark:bg-darkish dark:hover:bg-black/20'}`}
        >
          <Blobatar
            name={option.name}
            traits={{
                shape: [0.11, 0.35, 0.54, 0.65, 0.825, 0.888, 0.933, 0.965, 0.99],
              }}
            animate="always"
          />
          <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-4 h-4 rounded-lg  bg-secondary text-[10px] font-bold text-white dark:text-gray-900 leading-none z-10 shadow-md">
            {index + 1}
          </span>
        </Button>
      </Tooltip.Trigger>
      <Tooltip.Content className="truncate">{option.name}</Tooltip.Content>
    </Tooltip>
  )
}

export default OptionsController
