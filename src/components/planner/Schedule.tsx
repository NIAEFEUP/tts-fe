import '../../styles/schedule.css'
import classNames from 'classnames'
import { useMemo, useRef, useState } from 'react'
import { ScheduleGrid, } from './schedules'
import ToggleScheduleGrid from './schedule/ToggleScheduleGrid'
import PrintSchedule from './schedule/PrintSchedule'
import ScheduleTypes from './ScheduleType'
import { ClassDescriptor, SlotInfo } from '../../@types'
import { useShowGrid } from '../../hooks'
import { maxHour, minHour, convertWeekdayLong, convertHour } from '../../utils'
import SlotBoxes from './schedules/SlotBoxes'

const dayValues = Array.from({ length: 6 }, (_, i) => i)
const hourValues = Array.from({ length: maxHour - minHour + 1 }, (_, i) => minHour + i)

type Props = {
  classes: Array<ClassDescriptor>,
  slots: Array<SlotInfo>
}

const Schedule = ({
  classes,
  slots
}: Props) => {
  const scheduleRef = useRef(null);

  // TODO: Improvements by functional programming
  const slotTypes: string[] = useMemo(() => {
    const aux = new Set()

    for (const currentClass of classes) {
      const class_info = currentClass?.classInfo

      class_info.slots.forEach((element) => {
        aux.add(element.lesson_type)
      })
    }

    return Array.from(aux) as string[]
  }, [classes])

  const slotsOrderedByDay = (slots: Array<SlotInfo>): Array<SlotInfo> => {
    return slots.sort((slot1, slot2) => {
      if (slot1.day === slot2.day) {
        return slot1.start_time - slot2.start_time;
      }

      return slot1.day - slot2.day
    });
  }

  // Bottom Bar Configurations
  const [hiddenLessonsTypes, setHiddenLessonsTypes] = useState<string[]>([])
  const [showGrid, setShowGrid] = useShowGrid()

  return (
    <>
      {/*Schedule desktop*/}
      <div ref={scheduleRef} className="schedule-area gap-2">
        {/* Days Column Names */}
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
          {/* First Column with Hours */}
          <div className="schedule-main-left">
            {hourValues.map((hour: number, hourLabelIdx: number) => (
              <span key={`hour-label-${hourLabelIdx}`}>{convertHour(hour.toString())}</span>
            ))}
          </div>

          {/* Slots */}
          <div className="schedule-main-right">
            <div className={classNames('schedule-grid-wrapper', showGrid ? 'show-grid-yes' : 'show-grid-no')}>
              <ScheduleGrid showGrid={showGrid} />
              <div className="schedule-classes">
                <SlotBoxes
                  slots={slots}
                  hiddenLessonsTypes={hiddenLessonsTypes}
                  classes={classes}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex justify-between gap-5 pl-16">
          <div className="flex flex-wrap gap-4 gap-y-1 text-sm text-gray-600 dark:text-white 2xl:gap-y-2 2xl:text-base">
            <ScheduleTypes types={slotTypes} hiddenLessonsTypes={hiddenLessonsTypes} setHiddenLessonsTypes={setHiddenLessonsTypes} />
          </div>
          <div className="flex gap-2">
            <ToggleScheduleGrid showGridHook={[showGrid, setShowGrid]} />
            <PrintSchedule component={scheduleRef} />
          </div>
        </div>
      </div>

      {/*Schedule mobile*/}
      <div className="flex h-full w-full flex-col items-center justify-start space-y-2 lg:hidden">
        <div className="flex w-full items-center justify-start gap-2" key={`responsive-lesson-row-${""}`}>
          <div className="h-full w-1 rounded bg-primary" />
          <div className="flex w-full flex-row flex-wrap items-center justify-start gap-2">
            {slots.length === 0 && <p>Ainda não foram selecionadas turmas!</p>}
            <SlotBoxes
              slots={slotsOrderedByDay(slots)}
              classes={classes}
              hiddenLessonsTypes={hiddenLessonsTypes}
            />
          </div>
        </div>
      </div>

    </>
  )
}

export default Schedule
