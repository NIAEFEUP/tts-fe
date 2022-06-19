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

const useCourses = () => {
  const [courses, setCourses] = useLocalStorage('niaefeup-tts.courses', null)

  useEffect(() => {
    // add some logic here
  }, [courses])

  return [courses, setCourses]
}

export default useCourses