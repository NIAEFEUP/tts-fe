import { createContext, SetStateAction } from 'react'
import { CourseInfo } from '../@types/new_index'

interface MajorContextContent {
  pickedCourses: CourseInfo[]
  setPickedCourses: React.Dispatch<SetStateAction<CourseInfo[]>>
  courseInfo: CourseInfo[]
  setCourseInfo: React.Dispatch<SetStateAction<CourseInfo[]>>
}

const CourseContext = createContext({
  pickedCourses: [],
  setPickedCourses: (pickedCourses: CourseInfo[]) => {},
  courseInfo: [],
  setCourseInfo: (courseInfo: CourseInfo[]) => {},
})

export default CourseContext
