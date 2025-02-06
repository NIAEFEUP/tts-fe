import { useEffect, useState } from "react"

function useLocalStorage<S>(key: string, initialValue?: S) {
    const [value, setValue] = useState(() => {
      try {
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