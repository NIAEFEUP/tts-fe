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
const daysOfWeek = [ 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado' , 'Domingo' ]
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

  const groupSlotsByDay = (slots: Array<SlotInfo>): Record<number, Array<SlotInfo>> => {
    return slots.reduce((acc, slot) => {
      if (!acc[slot.day]) {
        acc[slot.day] = [];
      }
      acc[slot.day].push(slot);
      return acc;
    }, {} as Record<number, Array<SlotInfo>>);
  };

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
      <div className="flex h-full w-full flex-col items-center justify-start space-y-4 md:hidden">
        {slots.length === 0 ? (
          <p className="w-full p-4 text-center">Ainda não foram selecionadas turmas!</p>
        ) : (
          Object.entries(groupSlotsByDay(slotsOrderedByDay(slots))).map(([day, daySlots]) => (
            <div key={`mobile-day-${day}`} className="w-full">
              <div className="flex items-center gap-2 px-2 py-1">
                <div className="h-4 w-1 rounded-full bg-primary" />
                <h3 className="font-bold text-gray-800 dark:text-white">
                  {convertWeekdayLong(parseInt(day))}
                </h3>
              </div>
              
              <div className="flex w-full items-start gap-2 pl-3">
                <div className="flex w-full flex-col gap-2">
                  <SlotBoxes
                    slots={daySlots}
                    classes={classes}
                    hiddenLessonsTypes={hiddenLessonsTypes}
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>

    </>
  )
}

export default Schedule
