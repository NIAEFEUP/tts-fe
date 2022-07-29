import { CheckedCourse, Major } from '../@types'
import { extraCoursesData } from '../utils/data'
import { getSemester } from '../utils'

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:8000'
const SEMESTER = process.env.REACT_APP_SEMESTER || getSemester()

/**
 * Make a request to the backend server.
 * @param route route to be appended to backend url
 * @returns response from the backend
 */
const apiRequest = async (route: string) => {
  const slash = route[0] === '/' ? '' : '/'
  const url = BACKEND_URL + slash + route

  const data = await fetch(url)
    .then((response) => response.json())
    .catch((error) => console.error(error))

  return data
}

/**
 * Retrieves all UPorto majors.
 * @returns all majors from the backend
 */
const getMajors = async () => {
  return await apiRequest(`/course`)
}

/**
 * Retrieves all course units for a major in a given semester
 * @param major major to get course units from
 * @returns course units array
 */
const getCourses = async (major: Major) => {
  if (major === null) return []
  return await apiRequest(`/course_units/${major.id}/${SEMESTER}`)
}

/**
 * Retrieves all schedule options for a given course unit
 * @param course course of which to retrieve schedule
 * @returns array of schedule options
 */
const getCourseSchedule = async (course: CheckedCourse) => {
  if (course === null) return []
  return await apiRequest(`/schedule/${course.info.id}`)
}

/**
 * Retrieves all schedule options for a given course unit
 * @param courses course of which to retrieve schedule
 * @returns array of schedule options
 */
const getCoursesSchedules = async (courses: CheckedCourse[][]) => {
  if (!courses || courses.length === 0) return []

  let schedules = []
  for (let yearCourses of courses) {
    let yearSchedules = []
    for (let course of yearCourses) {
      const schedule = await getCourseSchedule(course)
      yearSchedules.push(schedule)
    }
    schedules.push(yearSchedules)
  }

  return schedules
}

/**
 * Retrieves all course units outside of a given major
 * @param major major to exclude course units from
 * @returns array of course units
 */
const getExtraCourses = (major: Major) => {
  // TODO: implement
  return extraCoursesData
}

const api = {
  getMajors,
  getCourses,
  getCourseSchedule,
  getCoursesSchedules,
  getExtraCourses,
}

export default api
