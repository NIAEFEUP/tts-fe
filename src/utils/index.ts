import { CourseSchedule, Lesson, LessonBoxRef } from '../@types'

const minHour = 8
const maxHour = 23
const lessonTypes = ['T', 'TP', 'PL', 'OT', 'L', 'P']
const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']
const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

const getDisplayDate = () => {
  const date = new Date()
  return `${dayNames[date.getDay()]}, ${date.getDate() + 1} ${monthNames[date.getMonth()]}`
}

const getSemester = () => {
  //jan-jul --> 2º Semestre
  const date = new Date()
  const month = date.getMonth()

  return month >= 0 && month <= 6 ? '2ºS' : '1ºS'
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
  return weekdays[dayNumber - 1]
}

const convertWeekdayLong = (dayNumber: number) => {
  if (dayNumber < 1 || dayNumber > 8) return null

  const weekdays = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo']
  return weekdays[dayNumber - 1]
}

const convertHour = (hourNumber: number) => {
  if (hourNumber < 0 || hourNumber > 24) return null

  const split = hourNumber.toString().split('.')
  const hour = split[0].padStart(2, '0')
  const minutes = split[1] === '0' || !split[1] ? '00' : '30'

  return `${hour}:${minutes}`
}

const timesCollide = (first: CourseSchedule, second: CourseSchedule) => {
  if (first.day !== second.day) return false
  return second.start_time < first.start_time + first.duration
}

const getScheduleOptionDisplayText = (option: CourseSchedule | null) => {
  const className = option.class_name !== null ? option.class_name : option.composed_class_name
  return [className, option.teacher_acronym, convertWeekday(option.day), getLessonBoxTime(option)].join(', ')
}

const getLessonBoxTime = (schedule: CourseSchedule) => {
  return [convertHour(schedule.start_time), convertHour(schedule.start_time + schedule.duration)].join('-')
}

const getLessonBoxStyles = (lesson: Lesson, maxHour: number, minHour: number) => {
  const step = (maxHour - minHour) * 2
  const top = (lesson.schedule.start_time - minHour) * 2
  const length = lesson.schedule.duration * 2

  return {
    top: `${(top * 100) / step}%`,
    left: `${((lesson.schedule.day - 1) * 100) / 6}%`,
    height: `${length * (100 / step)}%`,
  }
}

const getLessonBoxName = (lessonBoxRef: LessonBoxRef, prefix?: string): string => {
  const tokens: string[] = ['lesson', lessonBoxRef.type, lessonBoxRef.acronym, lessonBoxRef.id.toString()]
  return prefix ? [prefix, tokens].flat().join('-') : tokens.join('-')
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
}
