import '../../styles/schedule.css'
import classNames from 'classnames'
import { CourseOptions } from '../../@types'
import { convertHour, convertWeekdayLong } from '../../utils'

type Props = {
  courseOptions: CourseOptions
}

const minHour = 8
const maxHour = 24

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
            <ScheduleGrid courseOptions={courseOptions} />
            <ScheduleClasses courseOptions={courseOptions} />
          </div>
        </div>
      </div>
    </div>
  )
}

const ScheduleGrid = ({ courseOptions }: Props) => {
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
  const getStyles = (startTime: number, duration: number, day: number) => {
    const top = (startTime - minHour) * 2
    const length = duration * 2

    const styles = {
      top: `${(top * 100) / 32}%`,
      left: `${((day - 1) * 100) / 6}%`,
      height: `${length * 3.125}%`,
    }

    return styles
  }

  return (
    <div className="schedule-classes">
      {courseOptions
        .filter((item) => item.option !== null)
        .map((courseOption, courseOptionIdx) => (
          <div
            key={courseOptionIdx}
            className={classNames(
              'schedule-class',
              courseOption.option.lesson_type === 'TP' ? 'schedule-class-tp' : '',
              courseOption.option.lesson_type === 'P' ? 'schedule-class-lab' : ''
            )}
            style={getStyles(courseOption.option.start_time, courseOption.option.duration, courseOption.option.day)}
          ></div>
        ))}
    </div>
  )
}

export default Schedule
