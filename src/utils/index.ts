import { CourseSchedule, Lesson, LessonBoxRef } from '../@types'

const minHour = 8
const maxHour = 23
const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']
const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

// FIXME: backend has to replace unwanted types (basically the ones not in this list)
// FIXME: perhaps a list of types of classes would be helpful
const lessonTypes = ['T', 'TP', 'PL', 'OT', 'P', 'TC', 'S', 'O']

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
  if (dayNumber < 1 || dayNumber > 8) return null

  const weekdays = ['2ªf', '3ªf', '4ªf', '5ªf', '6ªf', 'Sab', 'Dom']
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

const getScheduleOptionDisplayText = (option: CourseSchedule | null) => {
  // prioritize single class name
  const classTitle = option.class_name !== null ? option.class_name : option.composed_class_name
  return [classTitle, option.teacher_acronym, convertWeekday(option.day), getLessonBoxTime(option)].join(', ')
}

const getLessonBoxTime = (schedule: CourseSchedule) => {
  return [convertHour(schedule.start_time), convertHour(addHour(schedule.start_time, schedule.duration))].join('-')
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

const getLessonBoxName = (lessonBoxRef: LessonBoxRef, prefix?: string): string => {
  const tokens: string[] = ['lesson', lessonBoxRef.type, lessonBoxRef.acronym, lessonBoxRef.id.toString()]
  return prefix ? [prefix, tokens].flat().join('-') : tokens.join('-')
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
      return 'schedule-class-other'
  }
}

export {
  minHour,
  maxHour,
  lessonTypes,
  dayNames,
  monthNames,
  getDisplayDate,
  getSemester,
  getSchoolYear,
  convertWeekday,
  convertWeekdayLong,
  convertHour,
  timesCollide,
  getScheduleOptionDisplayText,
  getLessonBoxTime,
  getLessonBoxStyles,
  getLessonBoxName,
  getClassTypeClassName,
  getLessonTypeLongName,
}
