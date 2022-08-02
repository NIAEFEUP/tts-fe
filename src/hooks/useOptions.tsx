import { useEffect, useState } from 'react'
import { CourseOption } from '../@types'

const isStorageValid = (key: string, daysElapsed: number) => {
  const stored = JSON.parse(localStorage.getItem(key))
  const storedFetchDate = JSON.parse(localStorage.getItem(key + '.fetch-date'))

  if (storedFetchDate === null) return false

  const savedTime = new Date(storedFetchDate).getTime()
  const expiredStorage = Math.abs(new Date().getTime() - savedTime) / 36e5 > 24 * daysElapsed

  return stored !== null && savedTime !== null && !expiredStorage
}

const writeStorage = (key: string, options: CourseOption[]) => {
  localStorage.setItem(key, JSON.stringify(options))
  localStorage.setItem(key + '.fetch-date', JSON.stringify(new Date()))
}

const writeStorageInvalid = (key: string) => {
  localStorage.setItem(key + '.fetch-date', null)
}

const useLocalStorage = (key: string, initialValue?: any) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      if (isStorageValid(key, 7)) {
        const options: CourseOption[] = JSON.parse(localStorage.getItem(key))
        writeStorage(key, options)
        return options
      } else {
        writeStorageInvalid(key)
        return initialValue
      }
    } catch (error) {
      console.warn(error)
      return initialValue
    }
  })

  const setValue = (value: any) => {
    try {
      setStoredValue(value)
      writeStorage(key, value)
    } catch (error) {
      console.warn(error)
    }
  }
  return [storedValue, setValue]
}

const useOptions = (): [CourseOption[], React.Dispatch<React.SetStateAction<CourseOption[]>>] => {
  const key = 'niaefeup-tts.options'
  const [options, setOptions] = useLocalStorage(key, [])

  useEffect(() => {
    writeStorage(key, options)
  }, [options])

  return [options, setOptions]
}

export default useOptions