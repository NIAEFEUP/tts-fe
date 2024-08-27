import '../../styles/schedule.css'
import classNames from 'classnames'
import { useEffect, useMemo, useRef, useState } from 'react'
import { ScheduleGrid, } from './schedules'
import ToggleScheduleGrid from './schedule/ToggleScheduleGrid'
import PrintSchedule from './schedule/PrintSchedule'
import { useContext } from 'react'
import ClassBox from './schedules/ClassBox'
import ScheduleTypes from './ScheduleType'
import { ClassDescriptor } from '../../@types'
import CourseContext from '../../contexts/CourseContext'
import MultipleOptionsContext from '../../contexts/MultipleOptionsContext'
import { useShowGrid } from '../../hooks'
import { maxHour, minHour, convertWeekdayLong, convertHour } from '../../utils'

const dayValues = Array.from({ length: 6 }, (_, i) => i)
const hourValues = Array.from({ length: maxHour - minHour + 1 }, (_, i) => minHour + i)

const Schedule = () => {
  const { pickedCourses } = useContext(CourseContext)
  const { multipleOptions, selectedOption } = useContext(MultipleOptionsContext)

  const [classes, setClasses] = useState<ClassDescriptor[]>([])
  const scheduleRef = useRef(null)

  useEffect(() => {
    //TODO: Improvements by functional programming
    let newClasses = []
    const option = multipleOptions[selectedOption]

    for (let i = 0; i < option.course_options.length; i++) {
      const course_info = pickedCourses.find((course) => course.id === option.course_options[i].course_id)
      if (!course_info) continue;
      const class_info = course_info.classes?.find(
        (class_info) => class_info.id === option.course_options[i].picked_class_id
      )

      if (course_info === undefined || class_info === undefined) continue
      newClasses.push({
        courseInfo: course_info,
        classInfo: class_info,
      })
    }

    setClasses(newClasses)
  }, [multipleOptions, pickedCourses, selectedOption])

  // TODO: Improvements by functional programming
  const slotTypes: string[] = useMemo(() => {
    let aux = new Set()

    for (const currentClass of classes) {
      const class_info = currentClass?.classInfo

      class_info.slots.forEach((element) => {
        aux.add(element.lesson_type)
      })
    }

    return Array.from(aux) as string[]
  }, [classes])

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
                {classes
                  .filter((c) => c.classInfo !== undefined)
                  .map((c) => (
                    <ClassBox
                      key={`course[${c.courseInfo.id}]-class[${c.classInfo.id}]`}
                      courseInfo={c.courseInfo}
                      classInfo={c.classInfo ?? null}
                      classes={classes}
                      hiddenLessonsTypes={hiddenLessonsTypes}
                    />
                  ))}
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
            {classes
              .filter((c) => c.classInfo !== undefined)
              .map((c) => (
                <ClassBox
                  key={`course[${c.courseInfo.id}]-class[${c.classInfo.id}]`}
                  courseInfo={c.courseInfo}
                  classInfo={c.classInfo ?? null}
                  classes={classes}
                  hiddenLessonsTypes={hiddenLessonsTypes}
                />
              ))}
          </div>
        </div>
      </div>

    </>
  )
}

export default Schedule
