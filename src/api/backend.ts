import { CheckedCourse, ClassExchange, Major } from '../@types'
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
const apiRequest = async (route: string, method: string, body: FormData | null) => {
    const slash = route[0] === '/' ? '' : '/'

    const url = BACKEND_URL + slash + route;

    const data = await fetch(url, { method: method, body: body, credentials: "include" })
        .then((response) => {
            if (response.ok) {
                return response.json()
            } else {
                return response
            }
        })
        .catch((error) => console.error(error))

    return data
}

/**
 * Retrieves all UPorto majors.
 * @returns all majors from the backend
 */
const getMajors = async () => {
    return await apiRequest(`/course/${config.api.year}`, "GET", null)
}

/**
 * Retrieves all course units for a major in a given semester
 * @param major major to get course units from
 * @returns course units array
 */
const getCourses = async (major: Major) => {
    if (major === null) return []
    return await apiRequest(`/course_units/${major.id}/${config.api.year}/${SEMESTER}/`, "GET", null)
}

/**
 * Retrieves all schedule options for a given course unit
 * @param course course of which to retrieve schedule
 * @returns array of schedule options
 */
const getCourseSchedule = async (course: CheckedCourse) => {
    if (course === null) return []
    return await apiRequest(`/schedule/${course.info.id}/`, "GET", null)
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

/**
 * Retrieves the scrappe info from the backend
 */
const getInfo = async () => {
    return await apiRequest('/info/', "GET", null)
}

/**
 * Authenticate with sigarra
 */
export const login = async (faculty: string, username: string, password: string) => {
    const loginData = new FormData();
    loginData.append("pv_login", username);
    loginData.append("pv_password", password);

    return await apiRequest("/login/", "POST", loginData);
}

/**
 * Logout from backend 
 */
export const logout = async () => {
    return await apiRequest("/logout/", "POST", null);
}

/**
 * Submit direct exchange request
*/
export const submitDirectExchange = async (exchangeChoices: ClassExchange[]) => {
    const formData = new FormData();
    for (const choice of exchangeChoices) {
        formData.append("exchangeChoices[]", JSON.stringify(choice));
    }

    return await apiRequest("/submit_direct_exchange/", "POST", formData);
}

/*
* Get student schedule from sigarra 
*/
export const getStudentSchedule = async (username: string) => {
    return await apiRequest(`/student_schedule/${username}/`, "GET", null);
}

/**
 * Get course unit schedules from sigarra
 */
export const getCourseScheduleSigarra = async (course_unit_id: string) => {
    return await apiRequest(`/schedule_sigarra/${course_unit_id}/`, "GET", null);
}

export const getClassScheduleSigarra = async (course_unit_id: string, class_name: string) => {
    return await apiRequest(`/class_sigarra_schedule/${course_unit_id}/${class_name}`, "GET", null);
}

export const getCourseStudents = async (course_unit_id: string) => {
    return await apiRequest(`/students_per_course_unit/${course_unit_id}/`, "GET", null);
}

const api = {
    getMajors,
    getCourses,
    getCourseSchedule,
    getCoursesSchedules,
    getMajorCoursesSchedules,
    getExtraCourses,
    getInfo
}

export default api
