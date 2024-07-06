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
  id: number
  faculty: number
  acronym: string
  name: string
  url: string
  // year: number // remover ??
}

export type CourseInfo = {
  id: number,
  course_unit_year: number,
  course_unit_id: number,
  ects: number,
  acronym: string,
  name: string,
  url: string,
  classes: Array<ClassInfo>
  // last_updated: string, // remover ??
  // semester: number, // remover ??
  // year: number // remover ??
}

export type ClassInfo = {
  // course_unit_id: number, // é mesmo necessário ??
  // composed_name: string,
  id: number,
  name: string,
  filteredTeachers: Array<number>,
  slots: Array<SlotInfo>
}

export type SlotInfo = {
  lesson_type: string,
  day: number,
  start_time: number,
  duration: number,
  location: string,
  professors_link: string,
  professors: Array<ProfessorInfo>,
  // last_updated: string, (is it needed??)
}

export type ProfessorInfo = {
  id: number
  acronym: string
  name: string
}

export type PickedCourses = Array<CourseInfo>

export type MultipleOptions = Array<Option>

export type Option = {
  id: number,
  icon: string,
  name: string,
  course_options: Array<CourseOption>
}

export type CourseOption = {
  course_id: number,
  picked_class_id: number,
  locked: boolean,
  filteredTeachers: Array<number>,
  hide: Array<lesson_type>,
}

// export type ClassDescriptor = {
//   classInfo: ClassInfo
//   courseInfo: CourseInfo
// }

// export type ConflictInfo = {
//     classDescriptor: ClassDescriptor
//     slotInfo: SlotInfo
// }

export type ClassDescriptor = {
  classInfo: ClassInfo
  courseInfo: CourseInfo
  slotInfo?: SlotInfo
}

export type ConflictsInfo = {
  severe: boolean
  classDescriptors: ClassDescriptor[]
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
