import '../../styles/schedule.css'
import classNames from 'classnames'
import { useMemo } from 'react'
import { convertHour, convertWeekdayLong } from '../../utils'
import { Subject, CourseOptions, CourseSchedule } from '../../@types'

type Props = {
  showGrid: boolean
  activeClassesT: boolean
  activeClassesTP: boolean
  courseOptions: CourseOptions
}

type ClassesProps = {
  subject: Subject
  activeClassesT: boolean
  activeClassesTP: boolean
}

const minHour = 8
const maxHour = 23

const Schedule = ({ courseOptions, activeClassesT, activeClassesTP, showGrid }: Props) => {
  const dayValues = Array.from({ length: 6 }, (_, i) => i + 1)
  const hourValues = Array.from({ length: maxHour - minHour + 1 }, (_, i) => minHour + i)

  const subjects = useMemo(() => {
    const classes = courseOptions.filter((item) => item.option !== null)
    return classes.map((subject, subjectIdx) => ({
      course: subject.course.info,
      practicalLesson: subject.option,
      theoreticalLessons: classes.map((item) => item.schedules.filter((elem) => elem.lesson_type === 'T'))[subjectIdx],
    }))
  }, [courseOptions])

  const lessons = useMemo(() => {
    let lessonsAcc: CourseSchedule[] = []

    subjects.forEach((subject) => {
      lessonsAcc.push(subject.practicalLesson)
      lessonsAcc.push(...subject.theoreticalLessons)
    })

    lessonsAcc.sort((first, second) => {
      if (first.day === second.day) return first.start_time > second.start_time ? 1 : -1
      else return first.day > second.day ? 1 : -1
    })

    return lessonsAcc
  }, [subjects])

  const conflicts = useMemo(() => {
    let i = 0
    let j = 0
    let conflictsAcc = []

    while (i < lessons.length) {
      let acc = []
      while (j < lessons.length && lessons[i].day === lessons[j].day) {
        acc.push(lessons[j])
        j++
      }
      i = j
      conflictsAcc.push(acc)
    }

    return conflictsAcc
  }, [lessons])

  console.log(conflicts)

  return (
    <div className="schedule-area">
      <div className="schedule-top">
        <div className="schedule-top-empty">
          <span className="dummy">00:00</span>
        </div>
        <div className="schedule-top-days">
          {dayValues.map((day: number, dayLabelIdx: number) => (
            <span key={`day-label-${dayLabelIdx}`}>{convertWeekdayLong(day)}</span>
          ))}
        </div>
      </div>

      <div className="schedule-main">
        <div className="schedule-main-left">
          {hourValues.map((hour: number, hourLabelIdx: number) => (
            <span key={`hour-label-${hourLabelIdx}`}>{convertHour(hour)}</span>
          ))}
        </div>
        <div className="schedule-main-right">
          <div className="schedule-grid-wrapper">
            <ScheduleGrid showGrid={showGrid} />
            <div className="schedule-classes">
              {/* FIXME: Refactor this using conflicts and lessons */}
              {subjects.map((subject: Subject, subjectIdx: number) => (
                <Classes
                  key={`tp-${subjectIdx}`}
                  subject={subject}
                  activeClassesT={activeClassesT}
                  activeClassesTP={activeClassesTP}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const ScheduleGrid = ({ showGrid }: { showGrid: boolean }) => {
  const dayValues = Array.from({ length: 6 }, (_, i) => i + 1)
  const hourValues = Array.from({ length: (maxHour - minHour) * 2 }, (_, i) => minHour + i * 0.5)

  return (
    <div className="schedule-grid">
      {dayValues.map((dayValue: number, columnIdx: number) => (
        <div className={`schedule-column schedule-column-${columnIdx}`} key={`schedule-column-${columnIdx}`}>
          {hourValues.map((hourValue: number, rowIdx: number) => (
            <div
              key={`schedule-row-${rowIdx}`}
              className={classNames(
                'schedule-cell',
                rowIdx === hourValues.length - 1 ? 'schedule-cell-last-in-row' : '',
                columnIdx === dayValues.length - 1 ? 'schedule-cell-last-in-column' : '',
                hourValue >= 13 && hourValue < 14 ? 'schedule-class-lunch' : '',
                showGrid ? '' : 'no-borders'
              )}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

const Classes = ({ subject, activeClassesT, activeClassesTP }: ClassesProps) => {
  const getStyles = (startTime: number, duration: number, day: number) => {
    const step = (maxHour - minHour) * 2
    const top = (startTime - minHour) * 2
    const length = duration * 2

    return {
      top: `${(top * 100) / step}%`,
      left: `${((day - 1) * 100) / 6}%`,
      height: `${length * (100 / step)}%`,
    }
  }

  const TP = subject.practicalLesson
  const timeTP = `${convertHour(TP.start_time)}-${convertHour(TP.start_time + TP.duration)}`
  const stylesTP = getStyles(TP.start_time, TP.duration, TP.day)

  return (
    <>
      {/* Practical Class */}
      {activeClassesTP && (
        <div
          style={stylesTP}
          className={classNames(
            'schedule-class',
            TP.lesson_type === 'P' ? 'schedule-class-lab' : '',
            TP.lesson_type === 'TP' ? 'schedule-class-tp' : ''
          )}
        >
          {TP.duration > 1 ? (
            <div className="flex h-full w-full flex-col items-center justify-between p-1 text-xxs leading-none tracking-tighter text-white xl:text-sm 2xl:p-2 2xl:text-base">
              <div className="flex w-full items-center justify-between">
                <span>{timeTP}</span>
              </div>

              <div className="flex w-full items-center justify-between">
                <span className="font-semibold">{subject.course.acronym}</span>
                <span>{TP.class_name ? TP.class_name : TP.composed_class_name}</span>
              </div>

              <div className="flex w-full items-center justify-between">
                <span>{TP.location}</span>
                <span>{TP.teacher_acronym}</span>
              </div>
            </div>
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-between p-0.5 text-[0.5rem] tracking-tighter xl:text-xxs 2xl:p-1 2xl:text-xs">
              <div className="flex w-full items-center justify-between">
                <span>{timeTP}</span>
                <span className="font-semibold">{subject.course.acronym}</span>
              </div>

              <div className="flex w-full items-center justify-between">
                <span>{TP.location}</span>
                <span>{TP.class_name ? TP.class_name : TP.composed_class_name}</span>
                <span>{TP.teacher_acronym}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* All Theoretical Classes */}
      {activeClassesT &&
        subject.theoreticalLessons.map((schedule, scheduleIdx) => {
          const timeT = `${convertHour(schedule.start_time)}-${convertHour(schedule.start_time + schedule.duration)}`
          const stylesT = getStyles(schedule.start_time, schedule.duration, schedule.day)

          return (
            <div style={stylesT} key={scheduleIdx} className={classNames('schedule-class schedule-class-t')}>
              {schedule.duration > 1 ? (
                <div className="flex h-full w-full flex-col items-center justify-between p-1 text-xxs leading-none tracking-tighter text-white xl:text-sm 2xl:p-2 2xl:text-base">
                  <div className="flex w-full items-center justify-between">
                    <span>{timeT}</span>
                  </div>

                  <div className="flex w-full items-center justify-between">
                    <span className="font-semibold">{subject.course.acronym}</span>
                    <span>{schedule.class_name ? schedule.class_name : schedule.composed_class_name}</span>
                  </div>

                  <div className="flex w-full items-center justify-between">
                    <span>{schedule.location}</span>
                    <span>{schedule.teacher_acronym}</span>
                  </div>
                </div>
              ) : (
                <div className="flex h-full w-full flex-col items-center justify-between p-0.5 text-[0.5rem] tracking-tighter xl:text-xxs 2xl:p-1 2xl:text-xs">
                  <div className="flex w-full items-center justify-between">
                    <span>{timeT}</span>
                    <span className="font-semibold">{subject.course.acronym}</span>
                  </div>

                  <div className="flex w-full items-center justify-between">
                    <span>{schedule.location}</span>
                    <span>{schedule.class_name ? schedule.class_name : schedule.composed_class_name}</span>
                    <span>{schedule.teacher_acronym}</span>
                  </div>
                </div>
              )}
            </div>
          )
        })}
    </>
  )
}

export default Schedule
