import { useState, useEffect } from 'react'
import { MultipleOptions } from '../../../@types'
import { ReactSortable } from 'react-sortablejs'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../ui/tooltip'

type Props = {
  multipleOptionsHook: [MultipleOptions, React.Dispatch<React.SetStateAction<MultipleOptions>>]
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
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          onClick={() => {
            setSelected(item.id)
            setOptionIndex(item.id)
          }}
          className={`
            box-border aspect-square h-12 w-12 cursor-pointer rounded border-2 
            border-transparent p-2 transition-colors delay-150 
            ease-in-out hover:border-primary/75 dark:shadow hover:dark:border-primary/50
            ${selected === item.id ? 'bg-primary/75 text-white dark:bg-primary/50' : 'bg-lightish dark:bg-darkish'}
            `}
        >
          <img src={item.icon} className="h-auto w-auto" />
        </TooltipTrigger>
        <TooltipContent>
          <p>{item.name}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

/**
 * Sortable list of schedule options
 * Each option can be selected by clicking on it
 */
const OptionsController = ({ multipleOptionsHook, optionsListHook, selectedOptionHook }) => {
  const [optionsList, setOptionsList] = optionsListHook
  const [selectedOption, setSelectedOption] = selectedOptionHook

  return (
    <ReactSortable
      className="m-y-2 flex flex-row justify-start gap-2 overflow-x-auto py-3 text-center"
      list={optionsList}
      setList={setOptionsList}
      group="groupName"
      animation={200}
      delay={2}
      multiDrag
    >
      {optionsList.map((item) => (
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
