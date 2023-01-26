import { MultipleOptions } from '../@types'

const isStorageValid = (key: string, daysElapsed: number) => {
  const stored = JSON.parse(localStorage.getItem(key))
  const storedFetchDate = JSON.parse(localStorage.getItem(key + '.fetch-date'))

  if (storedFetchDate === null) return false

  const savedTime = new Date(storedFetchDate).getTime()
  const expiredStorage = Math.abs(new Date().getTime() - savedTime) / 36e5 > 24 * daysElapsed

  return stored !== null && savedTime !== null && !expiredStorage
}

const writeStorage = (key: string, value: any) => {
  localStorage.setItem(key, JSON.stringify(value))
  localStorage.setItem(key + '.fetch-date', JSON.stringify(new Date()))
}

const writeStorageInvalid = (key: string, initialValue?: any) => {
  localStorage.setItem(key, JSON.stringify(initialValue))
  localStorage.setItem(key + '.fetch-date', null)
}

const getOptionsStorage = (): MultipleOptions => {
  const key = 'niaefeup-tts.options'
  const initialValue = { index: 0, selected: [], options: [], names: Array.from({ length: 10 }, (_, i) => `Horário ${i + 1}`)}
  try {
    if (isStorageValid(key, 7)) {
      const courseOptions: MultipleOptions = JSON.parse(localStorage.getItem(key))
      // For older files (which don't have the attribute 'names')
      if (courseOptions.names == undefined) courseOptions.names = initialValue.names

      return courseOptions
    } else {
      writeStorageInvalid(key, initialValue)
      return initialValue
    }
  } catch (error) {
    console.warn(error)
    return initialValue
  }
}

const setOptionsStorage = (courseOptions: MultipleOptions): void => {
  const key = 'niaefeup-tts.options'
  writeStorage(key, courseOptions)
}

const deleteOptionsStorage = (): void => {
  const key = 'niaefeup-tts.options'
  const initialValue = { index: 0, selected: [], options: [], name: Array.from({ length: 10 }, (_, i) => `Horário ${i + 1}`) }
  writeStorageInvalid(key, initialValue)
}

const StorageAPI = {
  getOptionsStorage,
  setOptionsStorage,
  deleteOptionsStorage,
}

export default StorageAPI
