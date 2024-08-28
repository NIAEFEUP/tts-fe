import { Option } from '../../../@types/index'
import { ReactSortable } from 'react-sortablejs'
import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline'
import { useContext } from 'react'
import MultipleOptionsContext from '../../../contexts/MultipleOptionsContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../ui/tooltip';
import { AnalyticsTracker, Feature } from '../../../utils/AnalyticsTracker';

/**
 * Sortable list of schedule options
 * Each option can be selected by clicking on it
 */
const OptionsController = () => {
  const { multipleOptions, setMultipleOptions, selectedOption, setSelectedOption } = useContext(MultipleOptionsContext);

  return (
    <ReactSortable
      className="m-y-2 flex flex-row justify-center gap-2 overflow-x-auto py-2 text-center w-full lg:justify-start"
      list={multipleOptions}
      setList={setMultipleOptions}
      group="groupName"
      animation={200}
      delay={2}
      multiDrag
      onEnd={() => {
        AnalyticsTracker.trackFeature(Feature.OPTION_REORDER);
      }}
    >
      {multipleOptions.map((option: Option) => (
        <OptionButton
          key={option.id}
          option={option}
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
        />
      ))}
    </ReactSortable>
  )
}

type Props = {
  option: Option
  selectedOption: number
  setSelectedOption: (id: number) => void
}

const OptionButton = ({ option, selectedOption, setSelectedOption }: Props) => {
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger
          onClick={() => {
            setSelectedOption(option.id)
          }}
          className={`
            group relative box-border flex aspect-square h-10 w-15 cursor-pointer flex-col
            items-center justify-center rounded-md border-2 border-transparent p-2
            dark:shadow hover:dark:border-primary/50
            ${selectedOption === option.id ? 'bg-primary/75 dark:bg-primary/50' : 'bg-lightish dark:bg-darkish'}
            `}
        >
          <div
            className={`absolute inset-x-0 top-0 text-transparent transition-colors duration-300 dark:group-hover:text-white ${selectedOption === option.id ? 'group-hover:text-white' : 'group-hover:text-slate-700'
              }`}
          >
            <EllipsisHorizontalIcon className="m-auto h-5 w-5 cursor-grab" />
          </div>
          <img src={option.icon} className="h-9 w-9 transform duration-200 ease-in-out group-hover:mt-3" alt={option.name} />
        </TooltipTrigger>
        <TooltipContent className="w-32 truncate">{option.name}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default OptionsController
