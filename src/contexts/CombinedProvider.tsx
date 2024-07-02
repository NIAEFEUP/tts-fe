import { useState } from "react";
import { MultipleOptions } from "../@types/new_index";
import { useDarkMode } from "../hooks";
import { ThemeContext } from "./ThemeContext";
import MultipleOptionsContext from "./MultipleOptionsContext";
import StorageAPI from "../api/storage";

const CombinedProvider = ({ children }) => {
  const [enabled, setEnabled] = useDarkMode()  // TODO (Process-ing): Stop using a hook (who smoked here?)
  const [multipleOptions, setMultipleOptionsState] = useState<MultipleOptions>(StorageAPI.getMultipleOptionsStorage());  // TODO (Process-ing): Investigate integrating localStorage directly in the state (like in useLocalStorage)
  const [selectedOption, setSelectedOptionState] = useState<number>(StorageAPI.getSelectedOptionStorage());

  const setMultipleOptions = (newMultipleOptions: MultipleOptions | ((prevMultipleOptions: MultipleOptions) => MultipleOptions)) => {
    if (newMultipleOptions instanceof Function)
      newMultipleOptions = newMultipleOptions(multipleOptions);

    setMultipleOptionsState(newMultipleOptions);
    StorageAPI.setMultipleOptionsStorage(newMultipleOptions);
  }

  const setSelectedOption = (newOption: number | ((prevOption: number) => number)) => {
    if (newOption instanceof Function)
      newOption = newOption(selectedOption);

    setSelectedOptionState(newOption);
    StorageAPI.setSelectedOptionStorage(newOption);
  }

  return (
    <ThemeContext.Provider value={{ enabled, setEnabled }}>
      <MultipleOptionsContext.Provider value={{ multipleOptions, setMultipleOptions, selectedOption, setSelectedOption }}>
        {children}
      </MultipleOptionsContext.Provider>
    </ThemeContext.Provider>
  );
};

export default CombinedProvider;