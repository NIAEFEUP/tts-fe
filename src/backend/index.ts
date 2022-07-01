import { CheckedCourse, Major } from '../@types'
import { majorsData, coursesData, schedulesData, extraCoursesData } from '../utils/data'

const getMajors = () => {
  // TODO: replace majorsData with backend request
  return majorsData
}

const getCourses = (major: Major) => {
  // TODO: replace courseData with backend request
  return coursesData
}

const getCourseSchedule = (course: CheckedCourse) => {
  // TODO: Replace schedulesData (static IART) with backend request
  return schedulesData[Math.floor(Math.random() * schedulesData.length)]
}

const getExtraCourses = (major: Major) => {
  // TODO: get courses data from all majors other than major
  return extraCoursesData
}

export { getMajors, getCourses, getCourseSchedule, getExtraCourses }
