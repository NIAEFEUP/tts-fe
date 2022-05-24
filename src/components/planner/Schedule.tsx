import '../../styles/schedule.css'
import classNames from 'classnames'
import { convertHour, convertWeekdayLong } from '../../utils'
import { Course, CourseOption, CourseOptions, CourseSchedule } from '../../@types'

type Props = {
  courseOptions: CourseOptions
}

const minHour = 8
const maxHour = 23

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
  const classesTP = courseOptions.filter((item) => item.option !== null)
  const classesT = courseOptions
    .filter((item) => item.option !== null)
    .flatMap((item) => ({
      course: item.course,
      schedules: item.schedules.filter((item) => item.lesson_type === 'T'),
    }))

  return (
    <div className="schedule-classes">
      {classesTP.map((courseOption, courseOptionIdx) => (
        <ClassTP key={`tp-${courseOptionIdx}`} courseOption={courseOption} />
      ))}
      {classesT.map((courseX, courseXIdx) =>
        courseX.schedules.map((schedule, scheduleIdx) => (
          <ClassT key={`t-${courseXIdx}-${scheduleIdx}`} course={courseX.course.info} schedule={schedule} />
        ))
      )}
    </div>
  )
}

const ClassTP = ({ courseOption }: { courseOption: CourseOption }) => {
  const type = courseOption.option.lesson_type
  const time = `${convertHour(courseOption.option.start_time)}-${convertHour(
    courseOption.option.start_time + courseOption.option.duration
  )}`
  const styles = getStyles(courseOption.option.start_time, courseOption.option.duration, courseOption.option.day)

  return (
    <div
      className={classNames(
        'schedule-class',
        type === 'TP' ? 'schedule-class-tp' : '',
        type === 'P' ? 'schedule-class-lab' : ''
      )}
      style={styles}
    >
      {courseOption.option.duration > 1 ? (
        <div className="flex h-full w-full flex-col items-center justify-between p-1 text-xxs tracking-tighter xl:text-xs 2xl:p-2 2xl:text-base">
          <div className="flex w-full items-center justify-between">
            <span>{time}</span>
          </div>

          <div className="flex w-full items-center justify-between">
            <span className=" font-semibold">{courseOption.course.info.acronym}</span>
            <span>
              {courseOption.option.class_name
                ? courseOption.option.class_name
                : courseOption.option.composed_class_name}
            </span>
          </div>

          <div className="flex w-full items-center justify-between">
            <span>{courseOption.option.location}</span>
            <span>{courseOption.option.teacher_acronym}</span>
          </div>
        </div>
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-between p-0.5 text-[0.5rem] tracking-tighter xl:text-xxs 2xl:p-1 2xl:text-xs">
          <div className="flex w-full items-center justify-between">
            <span>{time}</span>
            <span className=" font-semibold">{courseOption.course.info.acronym}</span>
          </div>

          <div className="flex w-full items-center justify-between">
            <span>{courseOption.option.location}</span>
            <span>
              {courseOption.option.class_name
                ? courseOption.option.class_name
                : courseOption.option.composed_class_name}
            </span>
            <span>{courseOption.option.teacher_acronym}</span>
          </div>
        </div>
      )}
    </div>
  )
}

const ClassT = ({ course, schedule }: { course: Course; schedule: CourseSchedule }) => {
  const time = `${convertHour(schedule.start_time)}-${convertHour(schedule.start_time + schedule.duration)}`
  const styles = getStyles(schedule.start_time, schedule.duration, schedule.day)

  return (
    <div className={classNames('schedule-class schedule-class-t')} style={styles}>
      {schedule.duration > 1 ? (
        <div className="flex h-full w-full flex-col items-center justify-between p-1 text-xxs tracking-tighter xl:text-xs 2xl:p-1 2xl:text-sm">
          <div className="flex w-full items-center justify-between">
            <span>{time}</span>
          </div>

          <div className="flex w-full items-center justify-between">
            <span className=" font-semibold">{course.acronym}</span>
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
            <span>{time}</span>
            <span className=" font-semibold">{course.acronym}</span>
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
}

export default Schedule
