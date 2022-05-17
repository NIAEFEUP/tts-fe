/* General */
export type Student = {
  id: number
  name: string
  email: string
  picture?: string
}

/* Courses */
export type Course = {
  course_unit_id: number
  course: string
  name: string
  acronym: string
  url: string
  course_year: number
  semester: number
  year: number
  schedule_url: string
  last_updated: string
}
export type YearCourses = Course[]
export type MajorCourses = YearCourses[]

export type CheckedCourse = {
  checked: boolean
  info: Course
}
export type CheckedYearCourses = CheckedCourse[]
export type CheckedMajorCourses = CheckedYearCourses[]

/* Majors */
export type Major = {
  name: string
}
