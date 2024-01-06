import { Fragment, useState, useRef, useEffect } from 'react'
import { Transition, Menu } from '@headlessui/react'
import { CheckIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline'
import { MultipleOptions } from '../../@types'
import { ReactSortable, Sortable } from "react-sortablejs"
import {
  PencilAltIcon,
} from '@heroicons/react/solid'


type Props = {
  multipleOptionsHook: [MultipleOptions, React.Dispatch<React.SetStateAction<MultipleOptions>>]
}

interface Option {
  id: number;
  icon: string;
  name: string;
}

const Option = ({item, selectedHook, setOptionIndex, multipleOptionsHook}) => {
  const [selected, setSelected] = selectedHook   
  return (
      <div 
          onClick={() => {
            setSelected(item.id);
            setOptionIndex(item.id);
          }} 
          className={`box-border p-2 w-10 h-10 aspect-square rounded cursor-pointer border-2 border-transparent hover:border-primary/75 hover:dark:border-primary/50 dark:shadow transition-colors ease-in-out delay-150 ${selected === item.id ? "text-white bg-primary/75 dark:bg-primary/50" : "bg-lightish dark:bg-darkish"}`}
      >
          {item.icon}
      </div>
  )
}

const OptionsController = ({ multipleOptionsHook }: Props) => {
  const [multipleOptions, setMultipleOptions] = multipleOptionsHook
  const optionIndexes = Array.from({ length: 10 }, (_, i) => i)
  const [isInputFocused, setIsInputFocused] = useState(false);

  const [selected, setSelected] = useState(1);

  // Set default value of selected option
  useEffect(() => {
    const selectedOption = localStorage.getItem("niaefeup-tts.selected-option");

    if(!selectedOption) {
      setSelected(1);
    } else {
      setSelected(parseInt(selectedOption));
    }
  }, [])

  // Update local storage value when user selects a new option
  useEffect(() => {
    localStorage.setItem("niaefeup-tts.selected-option", selected.toString())
  }, [selected])

  const [optionsList, setOptionsList] = useState([]);

  // Load options list from local storage or set default values
  useEffect(() => {
    const optionsList: Array<Option> = JSON.parse(localStorage.getItem("niaefeup-tts.optionsList"));
    if(!optionsList) {
      setOptionsList([
        { id: 1, icon: "😊", name: "Horário 1" },
        { id: 2, icon: "🌟", name: "Horário 2" },
        { id: 3, icon: "🚀", name: "Horário 3" },
        { id: 4, icon: "📚", name: "Horário 4" },
        { id: 5, icon: "🎉", name: "Horário 5" },
        { id: 6, icon: "💻", name: "Horário 6" },
        { id: 7, icon: "🌈", name: "Horário 7" },
        { id: 8, icon: "🍀", name: "Horário 8" },
        { id: 9, icon: "🎓", name: "Horário 9" },
        { id: 10, icon: "🤖", name: "Horário 10" },
      ])
    } else {
      setOptionsList(optionsList)
    }
  }, [])

  // Update local storage value when user changes options list
  useEffect(() => {
    localStorage.setItem("niaefeup-tts.optionsList", JSON.stringify(optionsList));
  }, [optionsList])

  const setOptionIndex = (newIndex: number) => {
    setMultipleOptions((prev) => ({
      index: newIndex - 1,
      selected: prev.options[newIndex - 1],
      options: [...prev.options],
      names: prev.names
    }))
  }

  const getOptionById = (id: number) => {
    return optionsList.find((elem) => elem.id === id);
  };

  const renameOption = (event) => {
    const newName = event.target.value;
    setOptionsList((prevOptionsList) => {
      const updatedOptionsList = prevOptionsList.map((item) =>
        item.id === selected ? { ...item, name: newName } : item
      );
      localStorage.setItem("niaefeup-tts.optionsList", JSON.stringify(updatedOptionsList));
      return updatedOptionsList;
    });
  };

  const option = getOptionById(selected)

  return (
    <>
      <div className="flex flex-row items-center gap-3 w-full">
        <p className="text-xl">{option?.icon}</p>  
        <input 
          className="transition-all bg-inherit p-1 font-bold focus:font-normal w-full"
          maxLength={30}
          value={option ? option.name : ""}
          onChange={renameOption}
          onKeyDown={(e) => {
            if (e.key === 'Enter') 
              e.target.blur();          
          }}
        />
        {/* <PencilAltIcon id={`${selected}-name-edit-icon`} className="h-5 w-5"></PencilAltIcon> */}
      </div>
      <ReactSortable
        className="flex flex-row justify-start gap-2 overflow-x-auto text-center p-3 m-y-2"
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
            selectedHook={[selected, setSelected]}
            setOptionIndex={setOptionIndex}
            multipleOptionsHook={multipleOptionsHook}
        />
      ))}
      </ReactSortable>
    </>
  );
}

export default OptionsController
