import '../../styles/schedule.css'
import { CourseOptions } from '../../@types'
import classNames from 'classnames'

type Props = {
  courseOptions: CourseOptions
}

const Schedule = ({ courseOptions }: Props) => {
  return (
    <div className="schedule">
      <ScheduleGrid courseOptions={courseOptions} />
    </div>
  )
}

const ScheduleGrid = ({ courseOptions }: Props) => {
  const minHour = 8
  const maxHour = 24
  const dayValues = Array.from({ length: 6 }, (_, i) => i + 1)
  const hourValues = Array.from({ length: (maxHour - minHour) * 2 }, (_, i) => minHour + i * 0.5)

  return (
    <div className="schedule-grid">
      {dayValues.map((dayValue, columnIdx) => (
        <div className={`schedule-column schedule-column-${columnIdx}`} key={`schedule-column-${columnIdx}`}>
          {hourValues.map((hourValue, rowIdx) => (
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

const SchedulesText = ({ courseOptions }: Props) => (
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
