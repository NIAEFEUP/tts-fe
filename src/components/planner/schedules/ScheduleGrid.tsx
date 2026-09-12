import classNames from 'classnames'
import { maxHour, minHour } from '../../../utils'

// Column left-offset map (replaces .schedule-column-{n} classes)
const columnOffsets = ['left-0', 'left-1/6', 'left-1/3', 'left-1/2', 'left-2/3', 'left-5/6'] as const

type Props = {
  showGrid: boolean
}

const ScheduleGrid = ({ showGrid }: Props) => {
  const dayValues = Array.from({ length: 6 }, (_, i) => i + 1)
  const hourValues = Array.from({ length: (maxHour - minHour) * 2 }, (_, i) => minHour + i * 0.5)

  return (
    // .schedule-grid: absolute top-0 w-full h-full
    <div className="absolute top-0 w-full h-full">
      {dayValues.map((dayValue: number, columnIdx: number) => (
        // .schedule-column: absolute top-0 w-1/6 h-full + per-column left offset
        <div
          className={classNames('absolute top-0 w-1/6 h-full', columnOffsets[columnIdx])}
          key={`schedule-column-${columnIdx}`}
        >
          {hourValues.map((hourValue: number, rowIdx: number) => (
            <div
              key={`schedule-row-${rowIdx}`}
              className={classNames(
                // .schedule-cell base — height: calc(100%/30) lives in app.css,
                // nth-child even/odd borders also live in app.css (can't be inlined)
                'schedule-cell w-full border-r border-gray-200 dark:border-[#f0f0ff33]',
                rowIdx === hourValues.length - 1 ? 'border-b-0!' : '',
                columnIdx === dayValues.length - 1 ? 'border-r-0!' : '',
                hourValue >= 13 && hourValue < 14 ? 'bg-schedule-lunch/25' : '',
                !showGrid ? 'border-0!' : '',
              )}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

export default ScheduleGrid
