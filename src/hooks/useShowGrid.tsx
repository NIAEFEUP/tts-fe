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

const useShowGrid = () => {
  const [showGrid, setShowGrid] = useLocalStorage('niaefeup-tts.show-grid', true)

  useEffect(() => {
    // add some logic here
  }, [showGrid])

  return [showGrid, setShowGrid]
}

export default useShowGrid
