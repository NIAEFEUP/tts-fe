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

/* Schedule */
export type CourseSchedule = {
  day: number
  duration: number
  start_time: number
  location: string
  lesson_type: string
  teacher_acronym: string
  course_unit_id: number
  last_updated: string
  class_name: string // e.g. 1MIEIC01
  composed_class_name: string // e.g. COMP752
}

export type CourseSchedules = CourseSchedule[]
export type Schedules = CourseSchedules[]

/* Options */
export type CourseOption = {
  course: CheckedCourse
  option: CourseSchedule | null
  schedules: CourseSchedules
}
export type CourseOptions = CourseOption[]