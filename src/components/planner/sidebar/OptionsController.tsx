import { Option } from '../../../@types/index'
import { ReactSortable } from 'react-sortablejs'
import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline'
import { useContext } from 'react'
import MultipleOptionsContext from '../../../contexts/MultipleOptionsContext'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../ui/tooltip'
import { AnalyticsTracker, Feature } from '../../../utils/AnalyticsTracker'
import { Button } from '../../ui/new/newButton'

/**
 * Sortable list of schedule options
 * Each option can be selected by clicking on it
 */
const OptionsController = () => {
  const { multipleOptions, selectedOption, setSelectedOption, setMultipleOptions } = useContext(MultipleOptionsContext)

  return (
    <ReactSortable
      className="m-y-2 flex flex-row justify-center gap-2 overflow-x-auto py-2 text-center w-full lg:justify-start border-red-500 border-2"
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
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger
          onClick={() => {
            setSelectedOption(multipleOptions.findIndex((currentOption) => currentOption.id === option.id))
          }}
        >
          <Button square size="md" className="p-2 bg-lightish hover:bg-primary/50 dark:bg-darkish">
            <img src={option.icon} alt={option.name} />{' '}
          </Button>
        </TooltipTrigger>
        <TooltipContent className="w-32 truncate">{option.name}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default OptionsController
