import classNames from 'classnames'
import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { ScheduleGrid } from './schedules'
import ToggleScheduleGrid from './schedule/ToggleScheduleGrid'
import ScheduleTypes from './ScheduleType'
import { ClassDescriptor, SlotInfo } from '../../@types'
import { useShowGrid } from '../../hooks'
import { maxHour, minHour, convertWeekdayLong, convertHour } from '../../utils'
import SlotBoxes from './schedules/SlotBoxes'
import ScheduleContext from '../../contexts/ScheduleContext'
import { SyncLoader } from 'react-spinners'
import { ThemeContext } from '../../contexts/ThemeContext'

import ConflictsContext from '../../contexts/ConflictsContext'

const dayValues = Array.from({ length: 6 }, (_, i) => i)
const hourValues = Array.from({ length: maxHour - minHour + 1 }, (_, i) => minHour + i)

type Props = {
  classes: Array<ClassDescriptor>
  slots: Array<SlotInfo>
  refresh?: React.ReactNode
}

const Schedule = ({ classes, slots, refresh }: Props) => {
  const scheduleRef = useRef(null)

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
        return slot1.start_time - slot2.start_time
      }

      return slot1.day - slot2.day
    })
  }

  const groupSlotsByDay = (slots: Array<SlotInfo>): Record<number, Array<SlotInfo>> => {
    return slots.reduce(
      (acc, slot) => {
        if (!acc[slot.day]) {
          acc[slot.day] = []
        }
        acc[slot.day].push(slot)
        return acc
      },
      {} as Record<number, Array<SlotInfo>>,
    )
  }

  // Bottom Bar Configurations
  const [hiddenLessonsTypes, setHiddenLessonsTypes] = useState<string[]>([])
  const [showGrid, setShowGrid] = useShowGrid()

  const { loadingSchedule } = useContext(ScheduleContext)
  const { enabled } = useContext(ThemeContext)

  const { setConflictSeverity: contextSetConflictSeverity, setHasSomeConflict } = useContext(ConflictsContext)

  const [conflictsSeverities, setConflictsSeverities] = useState<Array<number>>([])

  useEffect(() => {
    setConflictsSeverities([])
  }, [slots])

  useEffect(() => {
    setHasSomeConflict(conflictsSeverities.some((val) => val >= 1))
    contextSetConflictSeverity(conflictsSeverities.some((val) => val === 2))
  }, [conflictsSeverities])

  return (
    <>
      {/*Schedule desktop*/}
      {/* .schedule-area: flex-none hidden w-full h-full lg:flex lg:flex-col */}
      <div ref={scheduleRef} className="schedule-area flex-none hidden w-full h-full lg:flex lg:flex-col gap-2">
        {/* Days Column Names */}
        {/* .schedule-top: flex w-full mb-2 space-x-3 xl:mb-1 xl:space-x-4 */}
        <div className="flex w-full mb-2 space-x-3 xl:mb-1 xl:space-x-4">
          {/* .schedule-top-empty: flex flex-col justify-between space-y-0 */}
          <div className="flex flex-col justify-between space-y-0">
            <span className="invisible text-[0.65rem] font-medium leading-none xl:text-sm">00:00</span>
          </div>
          {/* .schedule-top-days: flex flex-row items-center justify-between grow */}
          <div className="flex flex-row items-center justify-between grow">
            {dayValues.map((day: number, dayLabelIdx: number) => (
              <span
                key={`day-label-${dayLabelIdx}`}
                className="h-auto w-1/6 text-center text-[0.65rem] font-medium leading-none xl:text-sm"
              >
                {convertWeekdayLong(day)}
              </span>
            ))}
          </div>
        </div>

        {/* .schedule-main: flex w-full h-full space-x-3 xl:space-x-4 */}
        <div className="flex w-full h-full space-x-3 xl:space-x-4">
          {/* First Column with Hours — .schedule-main-left: flex flex-col justify-between h-full space-y-0 */}
          <div className="flex flex-col justify-between h-full space-y-0">
            {hourValues.map((hour: number, hourLabelIdx: number) => (
              <span
                key={`hour-label-${hourLabelIdx}`}
                className="h-auto text-[0.65rem] font-medium leading-none xl:text-sm"
              >
                {convertHour(hour.toString())}
              </span>
            ))}
          </div>

          {/* Slots — .schedule-main-right: w-full pt-0 xl:pt-1 */}
          <div className="w-full pt-0 xl:pt-1">
            {/* .schedule-grid-wrapper: relative w-full h-full rounded */}
            <div
              className={classNames(
                'relative w-full h-full rounded',
                showGrid
                  ? 'border-2 border-gray-200 shadow-sm dark:border-[#f0f0ff33]'
                  : 'border-2 border-transparent shadow-inner-xl',
              )}
            >
              <ScheduleGrid showGrid={showGrid} />
              {/* .schedule-classes: absolute top-0 w-full h-full */}
              <div className="absolute top-0 w-full h-full">
                {loadingSchedule ? (
                  <div className="flex flex-col justify-center items-center h-full w-full gap-8">
                    <p className="text-lg text-black dark:text-white">Carregando</p>
                    <SyncLoader color={enabled ? '#fff' : '#000'} size={8} />
                  </div>
                ) : (
                  <SlotBoxes
                    slots={slots}
                    hiddenLessonsTypes={hiddenLessonsTypes}
                    classes={classes}
                    setConflictsSeverities={setConflictsSeverities}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
        {/* Bottom bar */}
        <div className="flex justify-end gap-5 pl-16">
          <div className="flex gap-x-4">
            <ScheduleTypes
              types={slotTypes}
              hiddenLessonsTypes={hiddenLessonsTypes}
              setHiddenLessonsTypes={setHiddenLessonsTypes}
            />
            <div className="flex flex-row gap-x-2">
              {refresh}
              <ToggleScheduleGrid showGridHook={[showGrid, setShowGrid]} />
            </div>
          </div>
        </div>
      </div>

      {/*Schedule mobile*/}
      <div className="flex h-full w-full flex-col items-center justify-start space-y-4 lg:hidden">
        {slots.length === 0 ? (
          <p className="w-full p-4 text-center">Ainda não foram selecionadas turmas!</p>
        ) : (
          Object.entries(groupSlotsByDay(slotsOrderedByDay(slots))).map(([day, daySlots]) => (
            <div key={`mobile-day-${day}`} className="w-full">
              <div className="flex items-center gap-2 px-2 py-1">
                <div className="h-4 w-1 rounded-full bg-primary" />
                <h3 className="font-bold text-gray-800 dark:text-white">{convertWeekdayLong(parseInt(day))}</h3>
              </div>

              <div className="flex w-full items-start gap-2 pl-3">
                <div className="flex w-full flex-col gap-2">
                  <SlotBoxes
                    slots={daySlots}
                    classes={classes}
                    hiddenLessonsTypes={hiddenLessonsTypes}
                    setConflictsSeverities={setConflictsSeverities}
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
