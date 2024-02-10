enum lesson_type {
    T = "T",
    TP = "TP",
    P = "P",
    PL = "PL",
    OT = "OT",
    O = "O",
    E = "E"
}

/* Majors */
export type Major = {
    id: number      // passa a ser o sigarra_id
    faculty: number
    acronym: string
    name: string
    url: string
    // year: number // remover ??
}

// selected_major = {
//     id: number
// } // FICA APENAS COMO STATE (não é um type)

export type CourseInfo = {
    id: number // passa a ser o sigarra_id
    course_unit_year: number
    ects: number,
    acronym: string,
    name: string,
    url: string,
    // last_updated: string, // remover ??
    // semester: number, // remover ??
    // year: number // remover ??
}

// selected_courses = CourseInfo[] // FICA APENAS COMO STATE (não é um type)

export type CourseOption = {
    course_id: number,
    locked: boolean,
    filteredTeachers: Array<ProfessorInformation>,
    hide: Array<lesson_type>,
}

export type Option = {
    id: number,
    icon: string,
    name: string,
    course_option: Array<CourseOption>
}

export type MultipleOptions = Array<Option> 

export type ProfessorInformation = {
    acronym: string
    name: string
}

export type Slot = {
    day: number,
    start_time: number,
    duration: number,
    location: string,
    lesson_type: string,
    // last_updated: string, (is it needed??)
}

export type Class = {
    name: string
    course_id: number,
    composed_name: string,
    professors: Array<ProfessorInformation>,
    professors_link: string,
    slots: Array<Slot>
}

export type Course = {
    course_id: number
    classes: Array<Class>
}

// |=============================================================|
// |         Ver se nao podemos apagar daqui para baixo:         |
// |=============================================================|

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
