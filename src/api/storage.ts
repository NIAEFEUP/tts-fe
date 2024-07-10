import { MultipleOptions, CourseInfo, Major } from '../@types/new_index'
import { getCourseTeachers } from '../utils'
import API from './backend'


const INITIAL_VALUE = { index: 0, selected: [], options: [] }

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

const writeStorageInvalid = (key: string, INITIAL_VALUE?: any) => {
  localStorage.setItem(key, JSON.stringify(INITIAL_VALUE))
  localStorage.setItem(key + '.fetch-date', null)
}

// const getOptionsStorage = (): MultipleOptions => {
//   const key = 'niaefeup-tts.options'
//   try {
//     if (isStorageValid(key, 7)) {
//       const courseOptions: MultipleOptions = JSON.parse(localStorage.getItem(key))

//       for (let i = 0; i < courseOptions.options.length; i++) {
//         for (let j = 0; j < courseOptions.options[i].length; j++) {
//           if (courseOptions.options[i][j].teachers === undefined) {
//             courseOptions.options[i][j].teachers = getCourseTeachers(courseOptions.options[i][j])
//           }
//           if (courseOptions.options[i][j].filteredTeachers === undefined) {
//             courseOptions.options[i][j].filteredTeachers = getCourseTeachers(courseOptions.options[i][j])
//           }
//         }
//       }

//       for (let i = 0; i < courseOptions.selected.length; i++) {
//           if (courseOptions.selected[i].teachers === undefined) {
//             courseOptions.selected[i].teachers = getCourseTeachers(courseOptions.selected[i])
//           }
//           if (courseOptions.selected[i].filteredTeachers === undefined) {
//             courseOptions.selected[i].filteredTeachers = getCourseTeachers(courseOptions.selected[i])
//           }
//       }

//       return courseOptions

//     } else {
//       writeStorageInvalid(key, INITIAL_VALUE)
//       return INITIAL_VALUE
//     }
//   } catch (error) {
//     console.warn(error)
//     return INITIAL_VALUE
//   }
// }

const setOptionsStorage = (multipleOptions: MultipleOptions) => {
  const key = 'niaefeup-tts.multiple-options'
  writeStorage(key, multipleOptions);
}

const removeOptionsStorage = () => {
  const key = 'niaefeup-tts.multiple-options'
  writeStorageInvalid(key)
}

const setMajorsStorage = (majors : Major[]) => {
  const key = 'niaefeup-tts.majors'
  writeStorage(key, majors)
}

const getMajorsStorage = () => {
  const key = 'niaefeup-tts.majors'
  return JSON.parse(localStorage.getItem(key))
}

const setSelectedMajorStorage = (selectedMajor: any): void => {
  const key = 'niaefeup-tts.selected-major'
  writeStorage(key, selectedMajor)
}

const setPickedCoursesStorage = (pickedCourses: any): void => {
  const key = 'niaefeup-tts.picked-courses'
  writeStorage(key, pickedCourses)
}

const setConflictsStorage = (conflicts: any): void => {
  const key = 'niaefeup-tts.conflict-info'
  writeStorage(key, conflicts)
}

const updateScrappeInfo = async () => {
  const key = 'niaefeup-tts.info'
  const info = await API.getInfo()
  writeStorage(key, info)
}


const StorageAPI = {
  // getOptionsStorage,
  setOptionsStorage,
  removeOptionsStorage,
  getMajorsStorage,
  setMajorsStorage,
  setConflictsStorage,
  updateScrappeInfo,
  setSelectedMajorStorage,
  setPickedCoursesStorage,
}

export default StorageAPI
