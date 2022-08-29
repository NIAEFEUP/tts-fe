import classNames from 'classnames'
import { useMemo } from 'react'
import { Lesson, CourseOption } from '../../@types'
import { ScheduleGrid, LessonBox, ResponsiveLessonBox } from './schedules'
import { minHour, maxHour, convertHour, convertWeekdayLong, timesCollide } from '../../utils'
import '../../styles/schedule.css'

type Props = {
  showGrid: boolean
  activeClassesT: boolean
  activeClassesTP: boolean
  courseOptions: CourseOption[]
}

const Schedule = ({ courseOptions, activeClassesT, activeClassesTP, showGrid }: Props) => {
  const dayValues = Array.from({ length: 6 }, (_, i) => i)
  const hourValues = Array.from({ length: maxHour - minHour + 1 }, (_, i) => minHour + i)

  const subjects = useMemo(() => {
    const classes = courseOptions.filter((item) => item.option !== null)

    const chosenSubjects =  classes.map((subject, subjectIdx) => ({
      shown: subject.shown,
      course: subject.course.info,
      // A course schedule, may have more than one practical class.
      practicalLesson: classes.map((item) => 
        item.schedules.filter((elem) => elem.lesson_type === 'TP' && elem.class_name === subject.option.class_name)
      )[subjectIdx],
      // A course schedule, may have more than one theoretical class. 
      theoreticalLessons: classes.map((item) =>
        item.schedules.filter((elem) => elem.lesson_type === 'T' && elem.class_name === subject.option.class_name)
      )[subjectIdx],
    }))
    return chosenSubjects;
  }, [courseOptions])


  const lessons = useMemo(() => {
    let lessonsAcc: Lesson[] = []

    subjects.forEach((subject) => {
      if (subject.shown.T) {
        subject.theoreticalLessons.forEach((lesson) => lessonsAcc.push({ course: subject.course, schedule: lesson }))
      }

      if (subject.shown.TP) {
        subject.practicalLesson.forEach((lesson) => lessonsAcc.push({ course: subject.course, schedule: lesson}))
      }
    })

    lessonsAcc.sort((first, second) => {
      if (first.schedule.day === second.schedule.day)
        return parseFloat(first.schedule.start_time) > parseFloat(second.schedule.start_time) ? -1 : 1
      else return first.schedule.day > second.schedule.day ? 1 : -1
    })
    return lessonsAcc
  }, [subjects])

  /**
   * Find conflicts among classes between classes.
   * Consider that the classes are ordered in ascending order by the start_time.
   * The final result is a matrix o schedules, where conflictuos classes are grouped together.
   *
   * Example:
   * => AMAT:   09h00 ~ 11h00
   * => RC:     11h00 ~ 12h00
   * => TC:     11h00 ~ 13h00
   *
   * 1st iteraction: acc = [AMAT]
   * 2nd iteraction: acc = [RC], conflictsAcc = [[AMAT]]
   * 3rd iteraction: acc = [RC, TC], conflictsAcc = [[AMAT], [RC, TC]]
   */
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
              <span key={`hour-label-${hourLabelIdx}`}>{convertHour(hour.toString())}</span>
            ))}
          </div>
          <div className="schedule-main-right">
            <div className={classNames('schedule-grid-wrapper', showGrid ? 'show-grid-yes' : 'show-grid-no')}>
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
                          key={`conflict-lesson-box-${lessonIdx}`}
                          lesson={lesson}
                          conflict={lessons.length > 1 ? true : false}
                          conflicts={lessons.length > 1 ? lessons : undefined}
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
              <div className="h-full w-1 rounded bg-primary" />
              <div className="flex w-full flex-row flex-wrap items-center justify-start gap-2">
                {lessons.map((lesson: Lesson, lessonIdx: number) =>
                  lesson.schedule.lesson_type === 'T'
                    ? activeClassesT && (
                        <ResponsiveLessonBox
                          key={`responsive-lesson-box-${dayNumber}-${lessonIdx}`}
                          lesson={lesson}
                          conflict={false}
                        />
                      )
                    : activeClassesTP && (
                        <ResponsiveLessonBox
                          key={`responsive-lesson-box-${dayNumber}-${lessonIdx}`}
                          lesson={lesson}
                          conflict={false}
                        />
                      )
                )}
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

export default Schedule
