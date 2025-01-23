import { DirectExchangePendingMotive } from "../utils/exchange"

enum lesson_type {
  T = "T",    // Ensino teórico
  TP = "TP",  // Ensino teórico-prático
  P = "P",    // Ensino prático
  PL = "PL",  // Ensino prático e laboratorial
  OT = "OT",  // Orientação tutorial
  O = "O",    // Outra
  E = "E"     // Estágio
}
// https://sigarra.up.pt/feup/pt/web_base.gera_pagina?p_pagina=h_ds_func_relatorios.querylist

/* Majors */
export type Major = {
  id: number
  faculty_id: string
  course_type: string
  acronym: string
  name: string
  url: string
  year: number
}

export type CourseInfo = {
  id: number,
  course_unit_year: number,
  course_unit_id: number,
  ects: number,
  acronym: string,
  name: string,
  url: string,
  hash: string,
  classes?: Array<ClassInfo>
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
  id: number,
  lesson_type: string,
  day: number,
  start_time: number,
  duration: number,
  location: string,
  professors_link: string,
  professors: Array<ProfessorInfo>,
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

export type ClassDescriptor = {
  classInfo: ClassInfo
  courseInfo: CourseInfo
  slotInfo?: SlotInfo // used for conflict calculation
}

export type ConflictInfo = {
  severe: boolean
  conflictingClasses: ClassDescriptor[]
}

export type Conflicts = Map<number, ConflictInfo>

export type ImportedCourses = {
  [key: string]: string
}

/* Exchange data types */

export type ExchangeOption = {
  course_info: CourseInfo,
  course_unit_id: number,
  class_issuer_goes_from: ClassInfo,
  class_issuer_goes_to: ClassInfo,
  other_student?: number // The current student will be determined by the backend depending on session data
}

export type CreateRequestCardMetadata = {
  courseUnitName: string,
  courseUnitAcronym: string,
  requesterClassName: string,
  availableClasses: Array<string> // Classes from the course unit
}

export type CreateRequestData = {
  courseUnitId: number,
  courseUnitName: string,
  classNameRequesterGoesFrom: string,
  classNameRequesterGoesTo: string,
  other_student?: Student
}

export type MarketplaceRequest = {
  id: number,
  type: string,
  issuer_name: string,
  issuer_nmec: string,
  date: string,
  options?: Array<ExchangeOption>,
  classes?: Array<ClassInfo>,
  accepted: boolean,
}

export type DirectExchangeRequest = {
  id: number,
  type: string,
  issuer_name: string,
  issuer_nmec: string,
  accepted: boolean,
  pending_motive: DirectExchangePendingMotive,
  options: DirectExchangeParticipant[],
  date: string
}

export type DirectExchangeParticipant = {
  id: number,
  course_info: CourseInfo,
  participant_name: string,
  participant_nmec: string,
  class_participant_goes_from: ClassInfo,
  class_participant_goes_to: ClassInfo,
  course_unit: string,
  course_unit_id: string,
  accepted: boolean
  date: string
}

export type Student = {
  name: string,
  mecNumber: number
}

export type Participant = {
  client_id: string
  name: string
}

// TODO(Process-ing): Maybe join Student and Participant into a single type

export type CollabSession = {
  id: string
  name: string
  lastEdited: number
  expirationTime: number
  link: string
  participants: Array<Participant>
}
