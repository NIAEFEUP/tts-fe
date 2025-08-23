import { MultipleOptions, Major, PickedCourses } from '../@types/index'
import API from './backend'
import { getSemester, getSchoolYear } from '../utils'
const storeCurrentVisit = () => {
  const currentSemester = getSemester()
  const currentYear = getSchoolYear()
  const storedVisit = JSON.parse(localStorage.getItem('niaefeup-tts.current-visit'))
  if (storedVisit == null || storedVisit.year !== currentYear || storedVisit.semester !== currentSemester) {
    localStorage.clear()
    localStorage.setItem('niaefeup-tts.current-visit', JSON.stringify({ year: currentYear, semester: currentSemester }))
  }
}
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

const getMultipleOptionsStorage = (): MultipleOptions => {
  const key = 'niaefeup-tts.multiple-options'
  const defaultValue = [
    {
      id: 0,
      icon: 'https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/0031-fe0f-20e3.png',
      name: 'Horário 1',
      course_options: [],
    },
    {
      id: 1,
      icon: 'https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/0032-fe0f-20e3.png',
      name: 'Horário 2',
      course_options: [],
    },
    {
      id: 2,
      icon: 'https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/0033-fe0f-20e3.png',
      name: 'Horário 3',
      course_options: [],
    },
    {
      id: 3,
      icon: 'https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/0034-fe0f-20e3.png',
      name: 'Horário 4',
      course_options: [],
    },
    {
      id: 4,
      icon: 'https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/0035-fe0f-20e3.png',
      name: 'Horário 5',
      course_options: [],
    },
    {
      id: 5,
      icon: 'https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/0036-fe0f-20e3.png',
      name: 'Horário 6',
      course_options: [],
    },
    {
      id: 6,
      icon: 'https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/0037-fe0f-20e3.png',
      name: 'Horário 7',
      course_options: [],
    },
    {
      id: 7,
      icon: 'https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/0038-fe0f-20e3.png',
      name: 'Horário 8',
      course_options: [],
    },
    {
      id: 8,
      icon: 'https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/0039-fe0f-20e3.png',
      name: 'Horário 9',
      course_options: [],
    },
    {
      id: 9,
      icon: 'https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f51f.png',
      name: 'Horário 10',
      course_options: [],
    },
  ];
  storeCurrentVisit();

  try {
    if (isStorageValid(key, 7)) {
      const multipleOptions: MultipleOptions = JSON.parse(localStorage.getItem(key))
      return multipleOptions;

    } else {
      writeStorageInvalid(key, defaultValue);
      return defaultValue;
    }
  } catch (error) {
    console.warn(error)
    return defaultValue;
  }
}

const setMultipleOptionsStorage = (multipleOptions: MultipleOptions) => {
  const key = 'niaefeup-tts.multiple-options';
  writeStorage(key, multipleOptions);
}

const getCourseFilteredTeachersStorage = (selectedOption: number, courseUnitId: number) => {
  return getMultipleOptionsStorage()[selectedOption].course_options.find((option) => option.course_id === courseUnitId).filteredTeachers;
}

const getSelectedOptionStorage = () => {
  const key = 'niaefeup-tts.selected-option';

  let selectedOption = parseInt(localStorage.getItem(key));
  if (isNaN(selectedOption)) {
    selectedOption = 0;
    writeStorageInvalid(key, selectedOption);
  }

  return selectedOption;
}

const setSelectedOptionStorage = (selectedOption: number) => {
  const key = 'niaefeup-tts.selected-option';
  writeStorage(key, selectedOption);
}

const getSelectedMajorStorage = (): Major => {
  const key = 'niaefeup-tts.selected-major';
  return JSON.parse(localStorage.getItem(key)) || null;
}

const setSelectedMajorStorage = (selectedMajor: Major): void => {
  const key = 'niaefeup-tts.selected-major'
  writeStorage(key, selectedMajor)
}

const getPickedCoursesStorage = (): PickedCourses => {
  const key = 'niaefeup-tts.picked-courses'
  return JSON.parse(localStorage.getItem(key)) || []
}

const setPickedCoursesStorage = (pickedCourses: any): void => {
  const key = 'niaefeup-tts.picked-courses'
  writeStorage(key, pickedCourses)
}

//TODO: Implement this function
const updateBackendDataVersion = async (): Promise<void> => {
  const key = 'niaefeup-tts.info'

  //const currentVersion = ;
  const liveVersion = await API.getInfo()
  // If != versions, invalidate the others storages
  writeStorage(key, liveVersion);
}

const StorageAPI = {
  getMultipleOptionsStorage,
  setMultipleOptionsStorage,
  getSelectedOptionStorage,
  setSelectedOptionStorage,
  updateBackendDataVersion,
  getSelectedMajorStorage,
  setSelectedMajorStorage,
  getPickedCoursesStorage,
  setPickedCoursesStorage,
  getCourseFilteredTeachersStorage,
  storeCurrentVisit
}

export default StorageAPI
