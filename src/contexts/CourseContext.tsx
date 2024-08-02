import { Context, Dispatch, createContext, SetStateAction } from 'react'
import { CourseInfo } from '../@types'

interface CoursesContextContent {
  pickedCourses: CourseInfo[]
  setPickedCourses: Dispatch<SetStateAction<CourseInfo[]>>
  coursesInfo: CourseInfo[]
  setCoursesInfo: Dispatch<SetStateAction<CourseInfo[]>>
  choosingNewCourse: boolean
  setChoosingNewCourse: Dispatch<SetStateAction<boolean>>
}

const CourseContext: Context<CoursesContextContent> = createContext({
  pickedCourses: [],
  setPickedCourses: (pickedCourses: CourseInfo[]) => { },
  coursesInfo: [],
  setCoursesInfo: (courseInfo: CourseInfo[]) => { },
  choosingNewCourse: false,
  setChoosingNewCourse: (choosingCourse: boolean) => { }
})

export default CourseContext
