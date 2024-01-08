import { Fragment, useState, useRef, useEffect } from 'react'
import { Transition, Menu, Popover } from '@headlessui/react'
import { CheckIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline'
import { MultipleOptions } from '../../@types'
import { ReactSortable, Sortable } from "react-sortablejs"
import EmojiPicker, { Theme, EmojiStyle, SuggestionMode, Emoji } from 'emoji-picker-react';
import { ThemeContext } from '../../contexts/ThemeContext'
import {
  PencilAltIcon,
} from '@heroicons/react/solid'

import { useContext } from 'react';

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

  const {enabled, setEnabled} = useContext(ThemeContext)

  const [selected, setSelected] = useState(() => {
    const selectedOption = localStorage.getItem("niaefeup-tts.selected-option");

    if(!selectedOption) {
      return 1;
    } else {
      return parseInt(selectedOption);
    }
  });

  // Update local storage value when user selects a new option
  useEffect(() => {
    localStorage.setItem("niaefeup-tts.selected-option", selected.toString())
  }, [selected])

  const [optionsList, setOptionsList] = useState(() => {
    const optionsList: Array<Option> = JSON.parse(localStorage.getItem("niaefeup-tts.optionsList"));

    if(!optionsList) {
      return [
        { id: 1, icon: "😊", name: "Horário 1" },
        { id: 2, icon: "🌟", name: "Horário 2" },
        { id: 3, icon: "🚀", name: "Horário 3" },
        { id: 4, icon: "📚", name: "Horário 4" },
        { id: 5, icon: "🎉", name: "Horário 5" },
        { id: 6, icon: "💻", name: "Horário 6" },
        { id: 7, icon: "🌈", name: "Horário 7" },
        { id: 8, icon: "🍀", name: "Horário 8" },
        { id: 9, icon: "🎓", name: "Horário 9" },
        { id: 10, icon: "🤖", name: "Horário 10" }
      ]
    } else {
      return optionsList;
    }
  });

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

  const changeOptionIcon = (newIcon) => {
    setOptionsList((prevOptionsList) => {
      const updatedOptionsList = prevOptionsList.map((item) =>
        item.id === selected ? { ...item, icon: newIcon } : item
      );
      localStorage.setItem("niaefeup-tts.optionsList", JSON.stringify(updatedOptionsList));
      return updatedOptionsList;
    });

  }

  const getBrowserEmojiStyle = () => {
    if (window.navigator.userAgent.indexOf("Chrome") !== -1) {
      return EmojiStyle.GOOGLE;
    }
    if (window.navigator.userAgent.indexOf("Safari") !== -1) {
      return EmojiStyle.APPLE;
    }
    return EmojiStyle.NATIVE;
  };
  

  const option = getOptionById(selected)

  return (
    <>
      <div className="flex flex-row items-center gap-3 w-full">
        <Popover id="option-header" className="relative">
          <>
            <Popover.Button 
              className="w-10 h-10 aspect-square rounded bg-lightish dark:bg-darkish text-xl"
              >
              {option?.icon}
            </Popover.Button>
            <Popover.Panel className="absolute translate-y-1 z-10">
              {({ close }) => (
                <EmojiPicker 
                  searchDisabled={true}
                  previewConfig={{showPreview: false}}
                  theme={enabled ? Theme.DARK : Theme.LIGHT}
                  suggestedEmojisMode={SuggestionMode.RECENT}
                  emojiStyle={getBrowserEmojiStyle()}
                  onEmojiClick={(emojiData, event) => {
                    changeOptionIcon(emojiData.emoji);
                    close();
                  }}
                />
              )}
            </Popover.Panel>
          </>
        </Popover>
        
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
        className="flex flex-row justify-start gap-2 overflow-x-auto text-center py-3 m-y-2"
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
