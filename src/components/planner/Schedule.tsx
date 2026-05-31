import '../../styles/schedule.css'
import classNames from 'classnames'
import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { ScheduleGrid, } from './schedules'
import ToggleScheduleGrid from './schedule/ToggleScheduleGrid'
import PrintSchedule from './schedule/PrintSchedule'
import ScheduleTypes from './ScheduleType'
import { ClassDescriptor, SlotInfo } from '../../@types'
import { useShowGrid } from '../../hooks'
import { maxHour, minHour, convertWeekdayLong, convertHour } from '../../utils'
import SlotBoxes from './schedules/SlotBoxes'
import ScheduleContext from '../../contexts/ScheduleContext'
import { SyncLoader } from 'react-spinners'
import { ThemeContext } from '../../contexts/ThemeContext'
import MultipleOptionsContext from '../../contexts/MultipleOptionsContext'

import ConflictsContext from '../../contexts/ConflictsContext'
import DownloadSchedule from './schedule/DownloadSchedule'

const dayValues = Array.from({ length: 6 }, (_, i) => i)
const hourValues = Array.from({ length: maxHour - minHour + 1 }, (_, i) => minHour + i)

type Props = {
  classes: Array<ClassDescriptor>,
  slots: Array<SlotInfo>,
  refresh?: React.ReactNode
}

const Schedule = ({
  classes,
  slots,
  refresh
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

  const { loadingSchedule } = useContext(ScheduleContext);
  const { enabled } = useContext(ThemeContext);
  const { multipleOptions, selectedOption } = useContext(MultipleOptionsContext);

  const { setConflictSeverity: contextSetConflictSeverity, setHasSomeConflict } = useContext(ConflictsContext);

  // Get the current option name
  const currentOptionName = multipleOptions?.[selectedOption]?.name;

  const [conflictsSeverities, setConflictsSeverities] = useState<Array<number>>([]);

  useEffect(() => {
    setConflictsSeverities([])
  }, [slots]);

  useEffect(() => {
    setHasSomeConflict(conflictsSeverities.some(val => val >= 1));
    contextSetConflictSeverity(conflictsSeverities.some(val => val === 2));
  }, [conflictsSeverities])

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
                {loadingSchedule ? (
                  <div className="flex flex-col justify-center items-center h-full w-full gap-8">
                    <p className="text-lg text-black dark:text-white">Carregando</p>
                    <SyncLoader color={enabled ? "#fff" : "#000"} size={8} />
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
        <div className="flex justify-end gap-5 pl-16 schedule-bottom-bar">
          <div className="flex gap-x-4">
            <ScheduleTypes types={slotTypes} hiddenLessonsTypes={hiddenLessonsTypes} setHiddenLessonsTypes={setHiddenLessonsTypes} />
            <div className="flex flex-row gap-x-2">
              {refresh}
              <ToggleScheduleGrid showGridHook={[showGrid, setShowGrid]} />
              <PrintSchedule component={scheduleRef} optionName={currentOptionName} />
              <DownloadSchedule classes={classes}/>
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
