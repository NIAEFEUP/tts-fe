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

export type CourseInfo = {
    id: number, // passa a ser o sigarra_id
    course_unit_year: number,
    ects: number,
    acronym: string,
    name: string,
    url: string,
    classes?: Array<Class>
    // last_updated: string, // remover ??
    // semester: number, // remover ??
    // year: number // remover ??
}

export type Class = {
    // course_unit_id: number, // é mesmo necessário ??
    name: string
    composed_name: string,
    slots: Array<Slot>
}

export type Slot = {
    lesson_type: string,
    day: number,
    start_time: number,
    duration: number,
    location: string,
    professors_link: string,
    professors: Array<ProfessorInformation>,
    // last_updated: string, (is it needed??)
}


// selected_major = {
//     id: number
// } // FICA APENAS COMO STATE (não é um type)

export type selected_courses = Array<CourseInfo>

export type MultipleOptions = Array<Option> 

export type Option = {
    id: number,
    icon: string,
    name: string,
    course_option: Array<CourseOption>
}

export type CourseOption = {
    course_id: number,
    locked: boolean,
    filteredTeachers: Array<ProfessorInformation>,
    hide: Array<lesson_type>,
}

export type ProfessorInformation = {
    acronym: string
    name: string
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

export type ImportedCourses = { 
    [key: string]: string 
}
