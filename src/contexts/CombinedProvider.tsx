import { useDarkMode } from "../hooks";
import { ThemeContext } from "./ThemeContext";

const CombinedProvider = ({ children }) => {
    const [enabled, setEnabled] = useDarkMode()  // TODO: Stop using a hook here (who smoked here?)

    return (
        <ThemeContext.Provider value={{ enabled, setEnabled }}>
            {children}
        </ThemeContext.Provider>
    );
};

export default CombinedProvider;