import { MultipleOptions } from '../../../@types'
import { ReactSortable } from 'react-sortablejs'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../ui/tooltip'
import { EllipsisHorizontalIcon } from '@heroicons/react/24/outline'
import { useContext } from 'react'
import MultipleOptionsContext from '../../../contexts/MultipleOptionsContext'

type Props = {
  optionsListHook: [Option[], React.Dispatch<React.SetStateAction<Option[]>>]
}

interface Option {
  id: number
  icon: string
  name: string
}

const Option = ({ item, selectedHook }) => {
  const { multipleOptions, setMultipleOptions, selectedOption, setSelectedOption } = useContext(MultipleOptionsContext);

  console.log("ITEM IS: ", multipleOptions[selectedOption]);

   return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger
          onClick={() => {
            setSelectedOption(item.id)
            //setOptionIndex(item.id)
          }}
          className={`
            group relative box-border flex aspect-square h-10 w-10 cursor-pointer flex-col
            items-center justify-center rounded border-2 border-transparent p-2
            dark:shadow hover:dark:border-primary/50 md:h-14 md:w-14 lg:h-10 lg:w-10 xl:h-14 xl:w-14
            ${selectedOption === item.id ? 'bg-primary/75 dark:bg-primary/50' : 'bg-lightish dark:bg-darkish'}
            `}
        >
          <div
            className={`absolute inset-x-0 top-0 text-transparent transition-colors duration-300 dark:group-hover:text-white ${
              selectedOption === item.id ? 'group-hover:text-white' : 'group-hover:text-slate-700'
            }`}
          >
            <EllipsisHorizontalIcon className="m-auto h-5 w-5" />
          </div>
          <img src={item.icon} className="h-8 w-8 transform duration-200 ease-in-out group-hover:mt-3" alt={item.name} />
          {/** 
          <img src="https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f60e.png" className="h-8 w-8 transform duration-200 ease-in-out group-hover:mt-3" alt={item.name} />
          */} 
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
const OptionsController = ({ optionsListHook, selectedOptionHook }: Props) => {
  const [optionsList, setOptionsList] = optionsListHook

  return (
    <ReactSortable
      className="m-y-2 flex flex-row justify-center gap-2 overflow-x-auto py-2 text-center w-full lg:justify-start"
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
        />
      ))}
    </ReactSortable>
  )
}

export default OptionsController
