import { useEffect, useState, useRef } from 'react'
import { Major } from '../@types'

const isStorageValid = (key: string, daysElapsed: number) => {
  const stored = JSON.parse(localStorage.getItem(key))
  const storedFetchDate = JSON.parse(localStorage.getItem(key + '.fetch-date'))

  if (storedFetchDate === null) return false

  const savedTime = new Date(storedFetchDate).getTime()
  const expiredStorage = Math.abs(new Date().getTime() - savedTime) / 36e5 > 24 * daysElapsed

  return stored !== null && savedTime !== null && !expiredStorage
}

const writeStorage = (key: string, major: Major) => {
  localStorage.setItem(key, JSON.stringify(major))
  localStorage.setItem(key + '.fetch-date', JSON.stringify(new Date()))
}

const writeStorageInvalid = (key: string) => {
  localStorage.setItem(key + '.fetch-date', null)
}

const useLocalStorage = (key: string, initialValue?: any) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      if (isStorageValid(key, 7)) {
        const major: Major = JSON.parse(localStorage.getItem(key))
        writeStorage(key, major)
        return major
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

// prettier-ignore
const useMajor = (key: string): [Major | null, React.Dispatch<React.SetStateAction<Major | null>>, React.MutableRefObject<boolean>] => {
  const firstRenderRef = useRef(true)
  const changedMajorRef = useRef(false)
  const [major, setMajor] = useLocalStorage(key, null)

  useEffect(() => {
    writeStorage(key, major)

    if (firstRenderRef.current === true) {
      firstRenderRef.current = false
      return
    }
    
    changedMajorRef.current = true
  }, [major])

  return [major, setMajor, changedMajorRef]
}

export default useMajor
