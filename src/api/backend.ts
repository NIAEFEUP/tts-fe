import { Major, CourseInfo } from '../@types/new_index'
import { getSemester, config, dev_config } from '../utils'


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
const getCourseClass = async (course: CourseInfo) => {
  if (course === null) return []
  return await apiRequest(`/class/${course.id}/`)
}

const getCoursesClasses = async (courses: CourseInfo[]) => {
  return courses.map(async (course) => {
    course.classes = await getCourseClass(course)
    course.classes = course.classes.map((c) => {
      return {
        ...c,
        filteredTeachers: c.slots.flatMap((s) => s.professors.flatMap(p => p.id))
      }
    })
    return course
  })
}

/**
 * Retrieves full class information with classes
 * @param id class id
 * @returns CourseInfo
 */
const getCourseUnit = async (id: number) => {
  if (id === null) return []
  const class_info = (await apiRequest(`course_unit/${id}/`));
  class_info['classes'] = await getCourseClass(class_info);
  return class_info;
}

/**
 * Retrieves the scrappe info from the backend
 */
const getInfo = async () => {
  return await apiRequest('/info/')
}

const api = {
  getMajors,
  getCourses,
  getCourseClass,
  getCoursesClasses,
  getCourseUnit,
  getInfo
}

export default api