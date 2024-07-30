import { MultipleOptions, Option } from '../../../@types/new_index'
import { ReactSortable } from 'react-sortablejs'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../ui/tooltip'
import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline'
import { useContext } from 'react'
import MultipleOptionsContext from '../../../contexts/MultipleOptionsContext'

type Props = {
  option: Option
  multipleOptions: MultipleOptions
  selectedOption: number
  setSelectedOption: (id: number) => void
}

const OptionButton = ({ option, multipleOptions, selectedOption, setSelectedOption }: Props) => {
  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger
          onClick={() => {
            setSelectedOption(option.id)
          }}
          className={`
            group relative box-border flex aspect-square h-10 w-10 cursor-pointer flex-col
            items-center justify-center rounded border-2 border-transparent p-2
            dark:shadow hover:dark:border-primary/50 md:h-14 md:w-14 lg:h-10 lg:w-10 xl:h-14 xl:w-14
            ${selectedOption === option.id ? 'bg-primary/75 dark:bg-primary/50' : 'bg-lightish dark:bg-darkish'}
            `}
        >
          <div
            className={`absolute inset-x-0 top-0 text-transparent transition-colors duration-300 dark:group-hover:text-white ${
              selectedOption === option.id ? 'group-hover:text-white' : 'group-hover:text-slate-700'
            }`}
          >
            <EllipsisHorizontalIcon className="m-auto h-5 w-5" />
          </div>
          <img src={option.icon} className="h-8 w-8 transform duration-200 ease-in-out group-hover:mt-3" alt={option.name} />
        </TooltipTrigger>
        <TooltipContent className="w-32 truncate">{option.name}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

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
    >
      {multipleOptions.map((option: Option) => (
        <OptionButton
          key={option.id}
          option={option}
          multipleOptions={multipleOptions}
          selectedOption={selectedOption}
          setSelectedOption={setSelectedOption}
        />
      ))}
    </ReactSortable>
  )
}

export default OptionsController
