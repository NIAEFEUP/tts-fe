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

const ScheduleClassBoxes = ({ courseOptions }: Props) => (
  <>
    {courseOptions.map((courseOption, courseOptionIdx) => (
      <div key={courseOptionIdx}>
        <span>{courseOption.course.info.acronym}</span>
        {courseOption.option && (
          <span>
            : <strong>{courseOption.option.class_name}</strong>
          </span>
        )}
      </div>
    ))}
  </>
)

export default Schedule
