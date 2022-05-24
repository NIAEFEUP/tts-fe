import '../../styles/schedule.css'
import classNames from 'classnames'
import { convertHour, convertWeekdayLong } from '../../utils'
import { Course, CourseOptions, CourseSchedule, CourseSchedules } from '../../@types'

type Props = {
  courseOptions: CourseOptions
}

const minHour = 8
const maxHour = 23

const Schedule = ({ courseOptions }: Props) => {
  const dayValues = Array.from({ length: 6 }, (_, i) => i + 1)
  const hourValues = Array.from({ length: maxHour - minHour + 1 }, (_, i) => minHour + i)

  return (
    <div className="schedule-area">
      <div className="schedule-top">
        <div className="schedule-top-empty">
          <span>00:00</span>
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
            <ScheduleGrid />
            <ScheduleClasses courseOptions={courseOptions} />
          </div>
        </div>
      </div>
    </div>
  )
}

const ScheduleGrid = () => {
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
                columnIdx === dayValues.length - 1 ? 'schedule-cell-last-in-column' : ''
              )}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

const ScheduleClasses = ({ courseOptions }: Props) => {
  const classes = courseOptions.filter((item) => item.option !== null)
  const classesT = classes.map((item) => item.schedules.filter((item) => item.lesson_type === 'T'))

  return (
    <div className="schedule-classes">
      {classes.map((courseOption, courseOptionIdx) => (
        <Classes
          key={`tp-${courseOptionIdx}`}
          course={courseOption.course.info}
          schedule={courseOption.option}
          classesT={classesT[courseOptionIdx]}
        />
      ))}
    </div>
  )
}

type ClassesProps = {
  course: Course
  schedule: CourseSchedule
  classesT: CourseSchedules
}

const Classes = ({ course, schedule, classesT }: ClassesProps) => {
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

  const timeTP = `${convertHour(schedule.start_time)}-${convertHour(schedule.start_time + schedule.duration)}`
  const stylesTP = getStyles(schedule.start_time, schedule.duration, schedule.day)

  return (
    <>
      {/* Practical Class */}
      <div
        className={classNames(
          'schedule-class',
          schedule.lesson_type === 'P' ? 'schedule-class-lab' : '',
          schedule.lesson_type === 'TP' ? 'schedule-class-tp' : ''
        )}
        style={stylesTP}
      >
        {schedule.duration > 1 ? (
          <div className="flex h-full w-full flex-col items-center justify-between p-1 text-xxs tracking-tighter text-white xl:text-xs 2xl:p-2 2xl:text-base">
            <div className="flex w-full items-center justify-between">
              <span>{timeTP}</span>
            </div>

            <div className="flex w-full items-center justify-between">
              <span className="font-semibold">{course.acronym}</span>
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
              <span>{timeTP}</span>
              <span className="font-semibold">{course.acronym}</span>
            </div>

            <div className="flex w-full items-center justify-between">
              <span>{schedule.location}</span>
              <span>{schedule.class_name ? schedule.class_name : schedule.composed_class_name}</span>
              <span>{schedule.teacher_acronym}</span>
            </div>
          </div>
        )}
      </div>
      {/* All Theoretical Classes */}
      {classesT.map((schedule, scheduleIdx) => {
        const timeT = `${convertHour(schedule.start_time)}-${convertHour(schedule.start_time + schedule.duration)}`
        const stylesT = getStyles(schedule.start_time, schedule.duration, schedule.day)

        return (
          <div className={classNames('schedule-class schedule-class-t')} style={stylesT} key={scheduleIdx}>
            {schedule.duration > 1 ? (
              <div className="flex h-full w-full flex-col items-center justify-between p-1 text-xxs tracking-tighter text-white xl:text-xs 2xl:p-1 2xl:text-sm">
                <div className="flex w-full items-center justify-between">
                  <span>{timeT}</span>
                </div>

                <div className="flex w-full items-center justify-between">
                  <span className="font-semibold">{course.acronym}</span>
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
                  <span className="font-semibold">{course.acronym}</span>
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
