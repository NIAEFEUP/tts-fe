import { createContext, SetStateAction } from 'react'
import { CourseInfo } from '../@types/new_index'

interface MajorContextContent {
  pickedCourses: CourseInfo[]
  setPickedCourses: React.Dispatch<SetStateAction<CourseInfo[]>>
  coursesInfo: CourseInfo[]
  setCoursesInfo: React.Dispatch<SetStateAction<CourseInfo[]>>
}

const CourseContext = createContext({
  pickedCourses: [],
  setPickedCourses: (pickedCourses: CourseInfo[]) => {},
  coursesInfo: [],
  setCoursesInfo: (courseInfo: CourseInfo[]) => {},
})

export default CourseContext
