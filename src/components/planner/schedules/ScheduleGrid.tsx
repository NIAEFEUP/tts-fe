import classNames from 'classnames'
import { maxHour, minHour } from '../../../utils/utils'

type Props = {
  showGrid: boolean
}

const ScheduleGrid = ({ showGrid }: Props) => {
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
                hourValue >= 13 && hourValue < 14 ? 'schedule-class-schedule-lunch' : '',
                showGrid ? '' : 'no-borders'
              )}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export default ScheduleGrid
