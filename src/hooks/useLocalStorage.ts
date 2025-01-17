import { useEffect, useState } from "react"

const useLocalStorage = (key: string, initialValue?: any) => {
    const [value, setValue] = useState(() => {
      try {
        console.log(initialValue, window.localStorage.getItem(key) || JSON.stringify(initialValue))
        return JSON.parse(
          window.localStorage.getItem(key) || JSON.stringify(initialValue)
        );
      } catch (error) {
        console.warn(error);
        return initialValue;
      }
    })
  
    useEffect(() => {
      localStorage.setItem(key, JSON.stringify(value));
    }, [key, value]);

    return [value, setValue];
  }

export default useLocalStorage;