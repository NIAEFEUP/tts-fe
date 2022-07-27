import { useEffect, useState } from 'react'
import { CheckedMajorCourses } from '../@types'

const useLocalStorage = (key: string, initialValue?: any) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      console.log(JSON.parse(item))
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
  const key = 'niaefeup-tts.courses'
  const [courses, setCourses] = useLocalStorage(key, [])

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(courses))
  }, [courses])

  return [courses, setCourses]
}

export default useCourses
