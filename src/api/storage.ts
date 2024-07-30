import { MultipleOptions, CourseInfo, Major, PickedCourses } from '../@types/new_index'
import API from './backend'

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
      icon: 'https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f60e.png',
      name: 'Horário 1',
      course_options: [],
    },
    {
      id: 1,
      icon: 'https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f929.png',
      name: 'Horário 2',
      course_options: [],
    },
    {
      id: 2,
      icon: 'https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f973.png',
      name: 'Horário 3',
      course_options: [],
    },
    {
      id: 3,
      icon: 'https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f9d0.png',
      name: 'Horário 4',
      course_options: [],
    },
    {
      id: 4,
      icon: 'https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f525.png',
      name: 'Horário 5',
      course_options: [],
    },
    {
      id: 5,
      icon: 'https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f483.png',
      name: 'Horário 6',
      course_options: [],
    },
    {
      id: 6,
      icon: 'https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f976.png',
      name: 'Horário 7',
      course_options: [],
    },
    {
      id: 7,
      icon: 'https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f47b.png',
      name: 'Horário 8',
      course_options: [],
    },
    {
      id: 8,
      icon: 'https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f425.png',
      name: 'Horário 9',
      course_options: [],
    },
    {
      id: 9,
      icon: 'https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1fae1.png',
      name: 'Horário 10',
      course_options: [],
    },
  ];

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

const removeOptionsStorage = () => {
  const key = 'niaefeup-tts.multiple-options'
  writeStorageInvalid(key)
}

const setMajorsStorage = (majors : Major[]) => {
  const key = 'niaefeup-tts.majors'
  writeStorage(key, majors)
}

const getMajorsStorage = (): Major[] => {
  const key = 'niaefeup-tts.majors'
  return JSON.parse(localStorage.getItem(key))
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

const setConflictsStorage = (conflicts: any): void => {
  const key = 'niaefeup-tts.conflict-info'
  writeStorage(key, conflicts)
}

const getCoursesInfoStorage = (): CourseInfo[] => {
  const key = 'niaefeup-tts.courses-info';
  return JSON.parse(localStorage.getItem(key)) || [];
}

const setCoursesInfoStorage = (coursesInfo: CourseInfo[]): void => {
  const key = 'niaefeup-tts.courses-info';
  writeStorage(key, coursesInfo)
}

const updateScrappeInfo = async (): Promise<void> => {
  const key = 'niaefeup-tts.info'
  const info = await API.getInfo()
  writeStorage(key, info)
}

const StorageAPI = {
  // getOptionsStorage,
  getMultipleOptionsStorage,
  setMultipleOptionsStorage,
  getSelectedOptionStorage,
  setSelectedOptionStorage,
  removeOptionsStorage,
  getMajorsStorage,
  setMajorsStorage,
  setConflictsStorage,
  updateScrappeInfo,
  getSelectedMajorStorage,
  setSelectedMajorStorage,
  getPickedCoursesStorage,
  setPickedCoursesStorage,
  getCoursesInfoStorage,
  setCoursesInfoStorage,
}

export default StorageAPI
