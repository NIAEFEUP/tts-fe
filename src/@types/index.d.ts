export type Student = {
  id: number
  name: string
  email: string
  picture?: string
}

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

export type TruncatedCourse = {
  acronym: string
  course_unit_id: number
}

export type Major = {
  name: string
}
