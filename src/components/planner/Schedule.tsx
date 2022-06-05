import '../../styles/schedule.css'
import classNames from 'classnames'
import { useMemo } from 'react'
import { convertHour, convertWeekdayLong, timesCollide } from '../../utils'
import { Lesson, CourseOptions } from '../../@types'

type Props = {
  showGrid: boolean
  activeClassesT: boolean
  activeClassesTP: boolean
  courseOptions: CourseOptions
}

type LessonBoxProps = {
  lesson: Lesson
  active: boolean
  conflict?: boolean
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
    let lessonsAcc: Lesson[] = []

    subjects.forEach((subject) => {
      lessonsAcc.push({ course: subject.course, schedule: subject.practicalLesson })
      subject.theoreticalLessons.forEach((lesson) => lessonsAcc.push({ course: subject.course, schedule: lesson }))
    })

    lessonsAcc.sort((first, second) => {
      if (first.schedule.day === second.schedule.day)
        return first.schedule.start_time > second.schedule.start_time ? -1 : 1
      else return first.schedule.day > second.schedule.day ? 1 : -1
    })

    return lessonsAcc
  }, [subjects])

  const conflicts = useMemo(() => {
    let acc = []
    let conflictsAcc = []

    for (let i = 0; i < lessons.length; i++) {
      const curLesson = lessons[i]
      if (acc.length === 0) {
        acc.push(curLesson)
        if (i === lessons.length - 1) {
          conflictsAcc.push(acc)
        }
        continue
      }

      let collidesWithAll = true
      for (let j = 0; j < acc.length; j++) {
        const curAccLesson = acc[j]
        if (!timesCollide(curLesson.schedule, curAccLesson.schedule)) {
          collidesWithAll = false
          break
        }
      }
      if (collidesWithAll) {
        acc.push(curLesson)
      } else {
        conflictsAcc.push(acc)
        acc = [curLesson]
      }
      if (i === lessons.length - 1) conflictsAcc.push(acc)
    }

    return conflictsAcc
  }, [lessons])

  const lessonsGroupedByDays = useMemo(() => {
    let i = 0
    let j = 0
    let lessonsAcc = []

    while (i < lessons.length) {
      let acc = []
      while (j < lessons.length && lessons[i].schedule.day === lessons[j].schedule.day) {
        acc.unshift(lessons[j])
        j++
      }
      i = j
      lessonsAcc.push(acc)
    }

    return lessonsAcc
  }, [lessons])

  return (
    <>
      {/* Schedule Desktop */}
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
                {lessons.length === conflicts.length
                  ? lessons.map((lesson: Lesson, lessonIdx: number) => (
                      <LessonBox
                        key={`lesson-box-${lessonIdx}`}
                        lesson={lesson}
                        active={lesson.schedule.lesson_type === 'T' ? activeClassesT : activeClassesTP}
                      />
                    ))
                  : conflicts.map((lessons: Lesson[]) =>
                      lessons.map((lesson: Lesson, lessonIdx: number) => (
                        <LessonBox
                          key={`lesson-box-${lessonIdx}`}
                          lesson={lesson}
                          conflict={lessons.length > 1 ? true : false}
                          active={lesson.schedule.lesson_type === 'T' ? activeClassesT : activeClassesTP}
                        />
                      ))
                    )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Schedule Mobile */}
      <div className="flex h-full w-full flex-col items-center justify-start space-y-2 lg:hidden">
        {lessonsGroupedByDays.length > 0 ? (
          lessonsGroupedByDays.map((lessons: Lesson[], dayNumber: number) => (
            <div className="flex w-full items-center justify-start gap-2" key={`responsive-lesson-row-${dayNumber}`}>
              <div className="h-full w-1 rounded-xl bg-primary">
                <span></span>
              </div>
              <div className="flex w-full flex-row flex-wrap items-center justify-start gap-2">
                {lessons.map((lesson: Lesson, lessonIdx: number) => (
                  <ResponsiveLessonBox
                    key={`responsive-lesson-box-${dayNumber}-${lessonIdx}`}
                    lesson={lesson}
                    conflict={false}
                    active={lesson.schedule.lesson_type === 'T' ? activeClassesT : activeClassesTP}
                  />
                ))}
              </div>
            </div>
          ))
        ) : (
          <span>Nenhum horário selecionado</span>
        )}
      </div>
    </>
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

const LessonBox = ({ lesson, active, conflict }: LessonBoxProps) => {
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

  // prettier-ignore
  const time = `${convertHour(lesson.schedule.start_time)}-${convertHour(lesson.schedule.start_time + lesson.schedule.duration)}`
  const styles = getStyles(lesson.schedule.start_time, lesson.schedule.duration, lesson.schedule.day)

  return (
    active && (
      <div
        style={styles}
        className={classNames(
          'schedule-class',
          conflict ? 'schedule-class-conflict' : '',
          lesson.schedule.lesson_type === 'T' ? 'schedule-class-t' : '',
          lesson.schedule.lesson_type === 'P' ? 'schedule-class-lab' : '',
          lesson.schedule.lesson_type === 'TP' ? 'schedule-class-tp' : ''
        )}
      >
        {lesson.schedule.duration > 1 ? (
          <div className="flex h-full w-full flex-col items-center justify-between p-1 text-xxs leading-none tracking-tighter text-white xl:text-sm 2xl:p-2 2xl:text-base">
            <div className="flex w-full items-center justify-between">
              <span>{time}</span>
            </div>

            <div className="flex w-full items-center justify-between">
              <span className="font-semibold">{lesson.course.acronym}</span>
              <span>
                {lesson.schedule.class_name ? lesson.schedule.class_name : lesson.schedule.composed_class_name}
              </span>
            </div>

            <div className="flex w-full items-center justify-between">
              <span>{lesson.schedule.location}</span>
              <span>{lesson.schedule.teacher_acronym}</span>
            </div>
          </div>
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-between p-0.5 text-[0.5rem] tracking-tighter xl:text-xxs 2xl:p-1 2xl:text-xs">
            <div className="flex w-full items-center justify-between">
              <span>{time}</span>
              <span className="font-semibold">{lesson.course.acronym}</span>
            </div>

            <div className="flex w-full items-center justify-between">
              <span>{lesson.schedule.location}</span>
              <span>
                {lesson.schedule.class_name ? lesson.schedule.class_name : lesson.schedule.composed_class_name}
              </span>
              <span>{lesson.schedule.teacher_acronym}</span>
            </div>
          </div>
        )}
      </div>
    )
  )
}

const ResponsiveLessonBox = ({ lesson, active, conflict }: LessonBoxProps) => {
  // prettier-ignore
  const time = `${convertHour(lesson.schedule.start_time)}-${convertHour(lesson.schedule.start_time + lesson.schedule.duration)}`

  return (
    active && (
      <div
        className={classNames(
          'schedule-class-responsive',
          conflict ? 'schedule-class-conflict' : '',
          lesson.schedule.lesson_type === 'T' ? 'schedule-class-t' : '',
          lesson.schedule.lesson_type === 'P' ? 'schedule-class-lab' : '',
          lesson.schedule.lesson_type === 'TP' ? 'schedule-class-tp' : ''
        )}
      >
        <div className="flex h-full w-full flex-col items-center justify-between space-y-4 p-1.5 text-xxs leading-none tracking-tighter text-white xl:text-sm 2xl:p-2 2xl:text-base">
          <div className="flex w-full flex-col justify-between space-y-0.5">
            <span className="font-bold">{convertWeekdayLong(lesson.schedule.day)}</span>
            <span>{time}</span>
          </div>

          <div className="flex w-full flex-col items-start space-y-1">
            <span className="font-bold">{lesson.course.acronym}</span>
            <span>{lesson.schedule.class_name ? lesson.schedule.class_name : lesson.schedule.composed_class_name}</span>
          </div>

          <div className="flex w-full items-center justify-between">
            <span>{lesson.schedule.location}</span>
            <span>{lesson.schedule.teacher_acronym}</span>
          </div>
        </div>
      </div>
    )
  )
}

export default Schedule
