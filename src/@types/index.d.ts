/* General */
export type Student = {
    id: number
    name: string
    email: string
    picture?: string
}

/* Courses */
export type Course = {
    id: number
    course_id: number
    course_unit_id: number
    sigarra_id: number
    course: string
    name: string
    acronym: string
    url: stringid
    course_unit_year: number
    semester: number
    year: number
    schedule_url: string
    ects: number
    last_updated: string
}

export type CheckedCourse = {
    checked: boolean
    info: Course
}

/* Majors */
export type Major = {
    id: number
    name: string
    sigarra_id: number
    faculty: number
    acronym: string
    course_type: string
    year: number
    url: string
    plan_url: string
    last_updated: string
}

/* Schedule */
// export type CourseSchedule = {
//   day: number
//   duration: string
//   start_time: string
//   location: string
//   lesson_type: string
//   teacher_acronym: string
//   course_unit_id: number
//   last_updated: string
//   class_name: string // e.g. 1MIEIC01
//   composed_class_name: string // e.g. COMP752
// }

export type ProfessorInformation = {
    acronym: string
    name: string
}

export type CourseSchedule = {
    day: number
    duration: string
    start_time: string
    location: string
    lesson_type: string
    is_composed: boolean
    course_unit_id: number
    last_updated: string
    class_name: string // e.g. 1MIEIC01
    composed_class_name: string // e.g. COMP752
    // professor_sigarra_id: string
    // professor_acronyms: Array<string>                           // eliminar
    professors_link: string
    professor_information: Array<ProfessorInformation> // new
}

/* Options */
export type CourseOption = {
    shown?: {
        T: boolean
        TP: boolean
    }
    locked: boolean
    course: CheckedCourse
    option: CourseSchedule | null
    schedules: CourseSchedule[]
    teachers: ProfessorInformation[]
    filteredTeachers: ProfessorInformation[]
}

export type Subject = {
    course: Course
    practicalLesson: CourseSchedule[]
    theoreticalLessons: CourseSchedule[]
}

export type Lesson = {
    course: Course
    schedule: CourseSchedule
}

export type MultipleOptions = {
    index: number
    selected: CourseOption[]
    options: CourseOption[][]
}

export type ImportedCourses = {
    [key: string]: string
}

export type ClassExchange = {
    course_unit: string,
    old_class: string,
    new_class: string,
    other_student: string // If the user didn't specify a student, it will be none
}

export type ExchangeCourseUnit = {
    sigla: string,
    name: string,
    class: string,
    code: string
}
