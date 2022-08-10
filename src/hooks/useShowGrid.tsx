import { useEffect, useState } from 'react'

const useLocalStorage = (key: string, initialValue?: any) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.warn(error)
      return initialValue
    }
  })

  const setValue = (value: any) => {
    try {
      setStoredValue(value)
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch (error) {
      console.warn(error)
    }
  }
  return [storedValue, setValue]
}

const useShowGrid = (): [boolean, React.Dispatch<React.SetStateAction<boolean>>] => {
  const key = 'niaefeup-tts.show-grid'
  const [showGrid, setShowGrid] = useLocalStorage(key, true)

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(showGrid))
  }, [showGrid])

  return [showGrid, setShowGrid]
}

export default useShowGrid
