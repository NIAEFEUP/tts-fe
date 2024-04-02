import config from '../config/prod.json'
import dev_config from '../config/local.json'
import { CourseSchedule, Lesson } from '../@types'
import { CourseInfo, CourseOption, Slot, MultipleOptions, selected_courses } from '../@types/new_index'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
const minHour = 8
const maxHour = 23
const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']
const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Get's the complete for a page.
 * @param simplePath Path withot a prefix.
 * @returns The complete path with the prefix.
 */
const getPath = (simplePath: string) => {
  return config.pathPrefix + simplePath
}

const getDisplayDate = () => {
  const date = new Date()
  return `${dayNames[date.getDay()]}, ${date.getDate() + 1} ${monthNames[date.getMonth()]}`
}

const getSemester = () => {
  //jan-jul --> 2º Semestre
  const date = new Date()
  const month = date.getMonth()

  return month >= 0 && month <= 6 ? 2 : 1
}

const getSchoolYear = () => {
  const date = new Date()
  const month = date.getMonth()
  const year = date.getFullYear()

  return month >= 0 && month <= 6
    ? `${year - 1}/${year.toString().slice(2, 4)}`
    : `${year}/${(year + 1).toString().slice(2, 4)}`
}

const convertWeekday = (dayNumber: number) => {
  if (dayNumber < 0 || dayNumber > 7) return null

  const weekdays = ['2ªf', '3ªf', '4ªf', '5ªf', '6ªf', 'Sáb', 'Dom']
  return weekdays[dayNumber]
}

const convertWeekdayLong = (dayNumber: number) => {
  if (dayNumber < 0 || dayNumber > 7) return null

  const weekdays = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo']
  return weekdays[dayNumber]
}

const convertHour = (hourNumber: string) => {
  if (parseFloat(hourNumber) < 0 || parseFloat(hourNumber) > 24) return null

  const split = hourNumber.split('.')
  const hour = split[0].padStart(2, '0')
  const minutes = split[1] === '0' || !split[1] ? '00' : '30'

  return `${hour}:${minutes}`
}

const timesCollide = (first: CourseSchedule, second: CourseSchedule) => {
  if (first.day !== second.day) return false
  return parseFloat(second.start_time) < parseFloat(first.start_time) + parseFloat(first.duration)
}

const schedulesConflict = (first, second) => {
  if (first.day !== second.day) return false

  const firstStart = parseFloat(first.start_time)
  const secondStart = parseFloat(second.start_time)
  const firstDuration = parseFloat(first.duration)
  const secondDuration = parseFloat(second.duration)
  const firstEnd = firstStart + firstDuration
  const secondEnd = secondStart + secondDuration

  return (firstStart < secondStart && firstEnd > secondStart) || (firstStart >= secondStart && firstStart < secondEnd)
}

const getClassDisplayText = (course: CourseInfo, picked_class_id: number) => {
  const classInfo = course.classes.find((classInfo) => classInfo.id === picked_class_id)
  if (!classInfo) return ''

  const classTitle = classInfo.name
  const professor_acronyms = classInfo.slots.flatMap((slot) => slot.professors.map((prof) => prof.acronym))
  const weekdays = classInfo.slots.map((slot) => convertWeekday(slot.day))

  return [classTitle, professor_acronyms, ...weekdays, ...professor_acronyms].join(', ')
}

const getLessonBoxTime = (slot: Slot) => {
  return [convertHour(slot.start_time.toString()), convertHour(addHour(slot.start_time.toString(), slot.duration.toString()))].join('-')
}

const addHour = (hour1: string, hour2: string): string => {
  return (parseFloat(hour1) + parseFloat(hour2)).toString()
}

const getLessonBoxStyles = (lesson: Lesson, maxHour: number, minHour: number) => {
  const step = (maxHour - minHour) * 2
  const top = (parseFloat(lesson.schedule.start_time) - minHour) * 2
  const length = parseFloat(lesson.schedule.duration) * 2

  return {
    top: `${(top * 100) / step}%`,
    left: `${(lesson.schedule.day * 100) / 6}%`,
    height: `${length * (100 / step)}%`,
  }
}

const getLessonTypeLongName = (type: string) => {
  switch (type) {
    case 'T':
      return 'Aula Teórica'

    case 'P':
      return 'Aula Prática'

    case 'TP':
      return 'Aula Teórico-Prática'

    case 'S':
      return 'Seminário'

    case 'TC':
      return 'Teórica de Campo'

    case 'PL':
      return 'Aula Prática Laboratorial'

    case 'OT':
      return 'Aula de Orientação'

    default:
      return 'Aula Desconhecida'
  }
}

const getClassTypeClassName = (type: string) => {
  switch (type) {
    case 'T':
      return 'schedule-class-t'

    case 'P':
      return 'schedule-class-p'

    case 'TP':
      return 'schedule-class-tp'

    case 'S':
      return 'schedule-class-s'

    case 'PL':
      return 'schedule-class-pl'

    case 'OT':
      return 'schedule-class-ot'

    case 'TC':
      return 'schedule-class-tc'

    default:
      return 'schedule-class-o'
  }
}

const getCourseTeachers = (courseInfo: CourseInfo) => {
  return courseInfo.classes.forEach(classInfo => 
    classInfo.slots.forEach(slot => slot.professors)  
  )
}

// const getCourseTeachers = (courseOption: CourseOption) => {
//   let teachers = []
//   courseOption.schedules.forEach((schedule, idx) => {
//     if (schedule.lesson_type !== 'T') {
//       schedule.professor_information.forEach((prof_info) => {
//         if (!teachers.some((other) => other.acronym === prof_info.acronym)) {
//           teachers.push(prof_info)
//         }
//       })
//     }
//   })

//   return teachers
// }

// const removeDuplicatesFromCourseOption = (courses: CourseOption[]): CourseOption[] => {
//   if (!courses) return []

//   let frequency: Map<number, number> = new Map()
//   let newCourseOptions: CourseOption[] = []

//   for (let courseOption of courses) {
//     if (!frequency.has(courseOption.course.info.id)) {
//       newCourseOptions.push(courseOption)
//       frequency.set(courseOption.course.info.id, 1)
//     }
//   }

//   return newCourseOptions
// }

/**
 * Considering that the yearCourses is sorted by the course_unit_year field in ascending order, the function groups the major courses by year.
 * @param yearCourses All the courses in a major.
 * @returns The courses grouped by year.
 * @example input: [{ course: 1, year: 1 }, { course: 3, year: 1 }, { course: 2, year: 2 }]
 * @example output: [[{ course: 1, year: 1 }, { course: 3, year: 1 }], [{ course: 2, year: 2 }]]
 */
const groupCoursesByYear = (yearCourses: CourseInfo[]): CourseInfo[][] => {
  let majorCourses: CourseInfo[][] = []
  let currYear = 0
  for (let i = 0; i < yearCourses.length; i++) {
    if (yearCourses[i].course_unit_year !== currYear) {
      currYear += 1
      majorCourses.push([yearCourses[i]])
    } else {
      majorCourses[currYear - 1].push(yearCourses[i])
    }
  }
  return majorCourses
}

const isSubset = (set1, set2, same) => {  
  for (let elem1 of set1) {
    let found = false
    for (let elem2 of set2) {
      if (same(elem1, elem2)) {
        found = true
        break
      }
    }
    if (!found) return false
  }
  return true
}

const defaultMultipleOptions = (selected_courses:selected_courses) : MultipleOptions => {
  const defaultCourseOption : CourseOption[] = selected_courses.map(course => (
    {
      course_id: course.id,
      picked_class_id: 0,
      locked: false,
      filteredTeachers: [],
      hide: []
    }
  ))
  
  return [
    {
      id: 1,
      icon: 'https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f60e.png',
      name: 'Horário 1',
      course_options: defaultCourseOption,
    },
    {
      id: 2,
      icon: 'https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f929.png',
      name: 'Horário 2',
      course_options: defaultCourseOption,
    },
    {
      id: 3,
      icon: 'https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f973.png',
      name: 'Horário 3',
      course_options: defaultCourseOption,
    },
    {
      id: 4,
      icon: 'https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f9d0.png',
      name: 'Horário 4',
      course_options: defaultCourseOption,
    },
    {
      id: 5,
      icon: 'https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f525.png',
      name: 'Horário 5',
      course_options: defaultCourseOption,
    },
    {
      id: 6,
      icon: 'https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f483.png',
      name: 'Horário 6',
      course_options: defaultCourseOption,
    },
    {
      id: 7,
      icon: 'https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f976.png',
      name: 'Horário 7',
      course_options: defaultCourseOption,
    },
    {
      id: 8,
      icon: 'https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f47b.png',
      name: 'Horário 8',
      course_options: defaultCourseOption,
    },
    {
      id: 9,
      icon: 'https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f425.png',
      name: 'Horário 9',
      course_options: defaultCourseOption,
    },
    {
      id: 10,
      icon: 'https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1fae1.png',
      name: 'Horário 10',
      course_options: defaultCourseOption,
    },
  ]
}


export {
  config,
  dev_config,
  getPath,
  minHour,
  maxHour,
  dayNames,
  monthNames,
  getDisplayDate,
  getSemester,
  getSchoolYear,
  convertWeekday,
  convertWeekdayLong,
  convertHour,
  timesCollide,
  schedulesConflict,
  getClassDisplayText,
  getLessonBoxTime,
  getLessonBoxStyles,
  getClassTypeClassName,
  getLessonTypeLongName,
  getCourseTeachers,
  cn,
  // removeDuplicatesFromCourseOption,
  groupCoursesByYear,
  isSubset,
  defaultMultipleOptions,
}
