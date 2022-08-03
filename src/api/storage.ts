import { CheckedCourse, CourseOption } from '../@types'

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

const getCoursesStorage = (): CheckedCourse[][] => {
  const key = 'niaefeup-tts.courses'
  const initialValue = []
  try {
    if (isStorageValid(key, 7)) {
      const courses: CheckedCourse[][] = JSON.parse(localStorage.getItem(key))
      return courses
    } else {
      writeStorageInvalid(key, initialValue)
      return initialValue
    }
  } catch (error) {
    console.warn(error)
    return initialValue
  }
}

const setCoursesStorage = (courses: CheckedCourse[][]): void => {
  const key = 'niaefeup-tts.courses'
  writeStorage(key, courses)
}

const getCourseOptionsStorage = (): CourseOption[] => {
  const key = 'niaefeup-tts.options'
  const initialValue = []
  try {
    if (isStorageValid(key, 7)) {
      const courseOptions: CourseOption[] = JSON.parse(localStorage.getItem(key))
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

const setCourseOptionsStorage = (courseOptions: CourseOption[]): void => {
  const key = 'niaefeup-tts.options'
  writeStorage(key, courseOptions)
}

const StorageAPI = {
  getCoursesStorage,
  setCoursesStorage,
  getCourseOptionsStorage,
  setCourseOptionsStorage,
}

export default StorageAPI
