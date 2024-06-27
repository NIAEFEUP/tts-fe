import { useState } from "react";
import { MultipleOptions } from "../@types/new_index";
import { useDarkMode } from "../hooks";
import { ThemeContext } from "./ThemeContext";
import MultipleOptionsContext from "./MultipleOptionsContext";

const CombinedProvider = ({ children }) => {
    const [enabled, setEnabled] = useDarkMode()  // TODO: Stop using a hook here (who smoked here?)
    const [multipleOptions, setMultipleOptions] = useState<MultipleOptions>(null);
    const [selectedOption, setSelectedOption] = useState<number>(0);

    return (
        <ThemeContext.Provider value={{ enabled, setEnabled }}>
            <MultipleOptionsContext.Provider value={{ multipleOptions, setMultipleOptions, selectedOption, setSelectedOption }}>
                {children}
            </MultipleOptionsContext.Provider>
        </ThemeContext.Provider>
    );
};

export default CombinedProvider;