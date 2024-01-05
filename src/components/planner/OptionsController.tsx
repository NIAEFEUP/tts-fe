import { Fragment, useState, useRef, useEffect } from 'react'
import { Transition, Menu } from '@headlessui/react'
import { CheckIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline'
import { MultipleOptions } from '../../@types'
import { ReactSortable, Sortable } from "react-sortablejs"

type Props = {
  multipleOptionsHook: [MultipleOptions, React.Dispatch<React.SetStateAction<MultipleOptions>>]
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
          {item.name}
      </div>
  )
}

const OptionsController = ({ multipleOptionsHook }: Props) => {
  const [multipleOptions, setMultipleOptions] = multipleOptionsHook
  const optionIndexes = Array.from({ length: 10 }, (_, i) => i)
  const [isEditingName, setIsEditingName] = useState(false)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const [selected, setSelected] = useState(1);
  const [optionsList, setOptionsList] = useState([
    { id: 1, name: "😊" },
    { id: 2, name: "🌟" },
    { id: 3, name: "🚀" },
    { id: 4, name: "📚" },
    { id: 5, name: "🎉" },
    { id: 6, name: "💻" },
    { id: 7, name: "🌈" },
    { id: 8, name: "🍀" },
    { id: 9, name: "🎓" },
    { id: 10, name: "🤖" },
  ]);

  console.log(optionsList, selected);

  const getOptionById = (id: number) => {
    return optionsList.find((elem) => elem.id === id);
  };
  

  const setOptionIndex = (newIndex: number) => {
    setMultipleOptions((prev) => ({
      index: newIndex - 1,
      selected: prev.options[newIndex - 1],
      options: [...prev.options],
      names: prev.names
    }))
  }

  const renameOption = (newName: string) => {
    if (newName === "") return
    const newNames = [...multipleOptions.names]
    newNames[multipleOptions.index] = newName
    setMultipleOptions((prev) => ({
      index: prev.index,
      selected: prev.options[prev.index],
      options: [...prev.options],
      names: newNames
    }))
    setIsEditingName(false)
  }

  const chooseAndStopEditing = (index: number) => {
    setOptionIndex(index)
    setIsEditingName(false)
  }

  useEffect(() => {
    const handkeClick = (event: MouseEvent) => {
      if (!menuButtonRef.current || !menuButtonRef.current.contains(event.target as Node)) {
        setIsEditingName(false)
      }
    }
  
    document.addEventListener('click', handkeClick)
    return () => {
      document.removeEventListener('click', handkeClick)
    }
  }, [menuButtonRef, setIsEditingName])

  return (
    <>
      <b>{getOptionById(selected).name} PEQUENA DESCRIÇÃO</b>
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
