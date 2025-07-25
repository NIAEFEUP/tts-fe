import { Context, Dispatch, createContext, SetStateAction } from 'react'
import { CourseInfo, Major } from '../../@types'

interface CoursePickerContextContent {
  coursesStorage: CourseInfo[]
  setCoursesStorage: Dispatch<SetStateAction<CourseInfo[]>>
  coursesInfo: CourseInfo[] // This array holds the CourseInfo objects returned from the backend after fetching from it in the CoursePicker
  setCoursesInfo: Dispatch<SetStateAction<CourseInfo[]>>
  checkboxedCourses: CourseInfo[]
  setCheckboxedCourses: Dispatch<SetStateAction<CourseInfo[]>>
  choosingNewCourse: boolean
  setChoosingNewCourse: Dispatch<SetStateAction<boolean>>
  ucsModalOpen: boolean
  setUcsModalOpen: Dispatch<SetStateAction<boolean>>
  selectedMajor: Major
  setSelectedMajor: Dispatch<SetStateAction<Major>>
}

const CoursePickerContext: Context<CoursePickerContextContent> = createContext({
  coursesStorage: [],
  setCoursesStorage: () => { },
  checkboxedCourses: [],
  setCheckboxedCourses: () => { },
  choosingNewCourse: false,
  setChoosingNewCourse: () => { },
  ucsModalOpen: false,
  setUcsModalOpen: () => { },
  coursesInfo: [],
  setCoursesInfo: () => { },
  selectedMajor: null,
  setSelectedMajor: () => { }
})

export default CoursePickerContext
