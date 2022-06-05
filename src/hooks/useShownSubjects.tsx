import { useEffect, useState } from 'react'

const useLocalStorage = (key: string, initialValue?: any) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : (initialValue ? initialValue : [])
    } catch (error) {
      console.warn(error)
      return initialValue
    }
  })

  const setValue = (value: any) => {
    // const converted = Object.keys(value).find(key => value[key] === false)
    try {
      // const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(value)
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.warn(error)
    }
  }
  return [storedValue, setValue]
}

const useShownSubjects = () => {
  const [shownSubjects, setShownSubjects] = useLocalStorage('niaefeup-tts.shown-subjects')

  useEffect(() => {
    // add some logic here
  }, [shownSubjects, setShownSubjects])

  return [shownSubjects, setShownSubjects]
}

export default useShownSubjects
