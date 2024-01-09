import { CheckedCourse, Major } from '../@types'
import { extraCoursesData } from '../utils/data'
import { getSemester, config, dev_config } from '../utils/utils'


const prod_val = process.env.REACT_APP_PROD
const BE_CONFIG = Number(prod_val) ? config : dev_config
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL || `${BE_CONFIG.api.protocol}://${BE_CONFIG.api.host}:${BE_CONFIG.api.port}${BE_CONFIG.api.pathPrefix}`
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
  return await apiRequest(`/course/${config.api.year}`)
}

/**
 * Retrieves all course units for a major in a given semester
 * @param major major to get course units from
 * @returns course units array
 */
const getCourses = async (major: Major) => {
  if (major === null) return []
  return await apiRequest(`/course_units/${major.id}/${config.api.year}/${SEMESTER}/`)
}

/**
 * Retrieves all schedule options for a given course unit
 * @param course course of which to retrieve schedule
 * @returns array of schedule options
 */
const getCourseSchedule = async (course: CheckedCourse) => {
  if (course === null) return []
  return await apiRequest(`/schedule/${course.info.id}/`)
}

/**
 * Retrieves all schedule options for a given course unit
 * @param courses course of which to retrieve schedule
 * @returns array of schedule options
 */
const getCoursesSchedules = async (courses: CheckedCourse[]) => {
  if (!courses || courses.length === 0) return []

  let schedules = []
  for (let course of courses) {
    const schedule = await getCourseSchedule(course)
    schedules.push(schedule)
  }

  return schedules
}

/**
 * Retrieves all schedule options for a given course unit
 * @param courses course of which to retrieve schedule
 * @returns array of schedule options
 */
const getMajorCoursesSchedules = async (courses: CheckedCourse[][]) => {
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
  getMajorCoursesSchedules,
  getExtraCourses,
}

export default api
