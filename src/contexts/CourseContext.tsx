import { Context, Dispatch, createContext, SetStateAction } from 'react'
import { CourseInfo } from '../@types'

interface CoursesContextContent {
  pickedCourses: CourseInfo[]
  setPickedCourses: Dispatch<SetStateAction<CourseInfo[]>>
  coursesInfo: CourseInfo[] // This array holds the CourseInfo objects returned from the backend after fetching from it in the CoursePicker
  setCoursesInfo: Dispatch<SetStateAction<CourseInfo[]>>
  checkboxedCourses: CourseInfo[]
  setCheckboxedCourses: Dispatch<SetStateAction<CourseInfo[]>>
  choosingNewCourse: boolean
  setChoosingNewCourse: Dispatch<SetStateAction<boolean>>
}

const CourseContext: Context<CoursesContextContent> = createContext({
  pickedCourses: [],
  setPickedCourses: (pickedCourses: CourseInfo[]) => { },
  coursesInfo: [],
  setCoursesInfo: (courseInfo: CourseInfo[]) => { },
  checkboxedCourses: [],
  setCheckboxedCourses: (courses: CourseInfo[]) => { },
  choosingNewCourse: false,
  setChoosingNewCourse: (choosingCourse: boolean) => { }
})

export default CourseContext
