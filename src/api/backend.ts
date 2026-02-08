import { Major, CourseInfo } from "../@types"
import { dev_config, getSemester, config } from "../utils"
import Cookies from 'js-cookie'

const prod_val = import.meta.env.VITE_APP_PROD
const BE_CONFIG = Number(prod_val) ? config : dev_config
const BACKEND_URL = import.meta.env.VITE_APP_BACKEND_URL || `${BE_CONFIG.api.protocol}://${BE_CONFIG.api.host}:${BE_CONFIG.api.port}${BE_CONFIG.api.pathPrefix}`
const OIDC_LOGIN_URL = `${BACKEND_URL}/oidc-auth/authenticate/`
const OIDC_LOGOUT_URL = `${BACKEND_URL}/oidc-auth/logout/`
const SEMESTER = import.meta.env.VITE_APP_SEMESTER || getSemester()

// If we are in september 2024 we use 2024, if we are january 2025 we use 2024 because the first year of the academic year (2024/2025)
const CURRENT_YEAR = ((new Date()).getMonth() + 1) < 8 ? (new Date()).getFullYear() - 1 : (new Date()).getFullYear()

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
  return await apiRequest(`/course/${CURRENT_YEAR}`)
}

/**
 * Retrieves all course units for a major in a given semester
 * @param major major to get course units from
 * @returns course units array
 */
const getCourses = async (major: Major) => {
  if (major === null) return []
  return getCoursesByMajorId(major.id);
}

const getCoursesByMajorId = async (id: number) => {
  return await apiRequest(`/course_units/${id}/${CURRENT_YEAR}/${SEMESTER}/`)
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

const createCourseClass = async (course: CourseInfo) => {
  if (course.classes) return course;

  course.classes = await getCourseClass(course);
  course.classes = course.classes.map((c) => {
    return {
      ...c,
      filteredTeachers: c.slots.flatMap((s) => s.professors.flatMap(p => p.id))
    }
  })
  return course;
}

const getCoursesClasses = async (courses: CourseInfo[]): Promise<CourseInfo[]> => {
  const newCourses = [...courses];

  return Promise.all(newCourses.map(course => createCourseClass(course))).then(() => {
    return newCourses;
  }).catch((e) => {
    console.error(e);
    return []
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


/**
 * Retrieves hashes for a list of course unit IDs.
 * @param ids Array of course unit IDs
 * @returns Object mapping course unit IDs to their hashes
 */
const getCourseUnitHashes = async (ids: number[]) => {
  if (ids.length === 0) return {};

  try {
    const queryString = ids.join(',');
    const response = await fetch(`${BACKEND_URL}/course_unit/hash?ids=${queryString}`);
    if (!response.ok) throw new Error('Network response was not ok');
    return await response.json();
  } catch (error) {
    console.error('Error fetching course unit hashes:', error);
    throw error;
  }
};

/**
 * Retrieves the groups of a course
 * @param courseId ID of the course
 * @returns List of groups
 */
const getCourseGroups = async (courseId: number) => {
  if (!courseId) return Promise.resolve([]);
  return await apiRequest(`/course/${courseId}/groups`);
}

/**
 * Retrieves the course units of a group
 * @param groupId ID of the group
 * @returns List of course units
 */
const getCourseGroupUnits = async (groupId: number) => {
  if (!groupId) return Promise.resolve([]);
  return await apiRequest(`/course_group/${groupId}/course_units`);
}

const getCSRFToken = () => {
  return Cookies.get('csrftoken');
}

const csrfTokenName = (): string => {
  return "X-CSRFToken";
}

const api = {
  getMajors,
  getCourses,
  getCoursesByMajorId,
  getCourseClass,
  getCoursesClasses,
  getCourseUnit,
  getCourseGroups,
  getCourseGroupUnits,
  getInfo,
  getCourseUnitHashes,
  getCSRFToken,
  csrfTokenName,
  BACKEND_URL,
  OIDC_LOGIN_URL,
  OIDC_LOGOUT_URL
}

export default api
