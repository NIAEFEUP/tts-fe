import { Context, Dispatch, createContext, SetStateAction } from 'react'
import { CourseInfo } from '../@types/new_index'

interface CoursesContextContent {
  pickedCourses: CourseInfo[]
  setPickedCourses: Dispatch<SetStateAction<CourseInfo[]>>
  coursesInfo: CourseInfo[]
  setCoursesInfo: Dispatch<SetStateAction<CourseInfo[]>>
}

const CourseContext: Context<CoursesContextContent> = createContext({
  pickedCourses: [],
  setPickedCourses: (pickedCourses: CourseInfo[]) => {},
  coursesInfo: [],
  setCoursesInfo: (courseInfo: CourseInfo[]) => {},
})

export default CourseContext
