import { MultipleOptions } from '../../../@types'
import { ReactSortable } from 'react-sortablejs'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../ui/tooltip'
import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline'

type Props = {
  multipleOptionsHook: [MultipleOptions, React.Dispatch<React.SetStateAction<MultipleOptions>>]
  optionsListHook: [Option[], React.Dispatch<React.SetStateAction<Option[]>>]
  selectedOptionHook: [number, React.Dispatch<React.SetStateAction<number>>]
}

interface Option {
  id: number
  icon: string
  name: string
}

const Option = ({ item, selectedHook, multipleOptionsHook }) => {
  const [selected, setSelected] = selectedHook
  const [_, setMultipleOptions] = multipleOptionsHook

  const setOptionIndex = (newIndex: number) => {
    setMultipleOptions((prev) => ({
      index: newIndex - 1,
      selected: prev.options[newIndex - 1],
      options: [...prev.options],
      names: prev.names,
    }))
  }

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger
          onClick={() => {
            setSelected(item.id)
            setOptionIndex(item.id)
          }}
          className={`
            group relative box-border flex aspect-square h-10 w-10 cursor-pointer flex-col
            items-center justify-center rounded border-2 border-transparent p-2
            dark:shadow hover:dark:border-primary/50 md:h-14 md:w-14 lg:h-10 lg:w-10 xl:h-14 xl:w-14
            ${selected === item.id ? 'bg-primary/75 dark:bg-primary/50' : 'bg-lightish dark:bg-darkish'}
            `}
        >
          <div
            className={`absolute inset-x-0 top-0 text-transparent transition-colors duration-300 dark:group-hover:text-white ${
              selected === item.id ? 'group-hover:text-white' : 'group-hover:text-slate-700'
            }`}
          >
            <EllipsisHorizontalIcon className="m-auto h-5 w-5" />
          </div>
          <img src={item.icon} className="h-8 w-8 transform duration-200 ease-in-out group-hover:mt-3" />
        </TooltipTrigger>
        <TooltipContent className="w-32 truncate">{item.name}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

/**
 * Sortable list of schedule options
 * Each option can be selected by clicking on it
 */
const OptionsController = ({ multipleOptionsHook, optionsListHook, selectedOptionHook }: Props) => {
  const [optionsList, setOptionsList] = optionsListHook
  const [selectedOption, setSelectedOption] = selectedOptionHook

  return (
    <ReactSortable
      className="m-y-2 flex flex-row justify-start gap-2 overflow-x-auto py-2 text-center"
      list={optionsList}
      setList={setOptionsList}
      group="groupName"
      animation={200}
      delay={2}
      multiDrag
    >
      {optionsList.map((item: Option) => (
        <Option
          item={item}
          key={item.id}
          selectedHook={[selectedOption, setSelectedOption]}
          multipleOptionsHook={multipleOptionsHook}
        />
      ))}
    </ReactSortable>
  )
}

export default OptionsController
