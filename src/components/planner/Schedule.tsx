import '../../styles/schedule.css'
import classNames from 'classnames'
import { useEffect, useMemo, useRef, useState } from 'react'
// import { Lesson, CourseOption } from '../../@types'
import { Option, CourseOption, ConflictInfo, ClassDescriptor } from '../../@types/new_index'
import { ScheduleGrid, LessonBox, ResponsiveLessonBox } from './schedules'
import { minHour, maxHour, convertHour, convertWeekdayLong, timesCollide, getClassType } from '../../utils'
import { useShowGrid } from '../../hooks'
import ToggleScheduleGrid from './schedule/ToggleScheduleGrid'
import PrintSchedule from './schedule/PrintSchedule'
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline'

import { useContext } from 'react'
import MultipleOptionsContext from '../../contexts/MultipleOptionsContext'
import CourseContext from '../../contexts/CourseContext'
import ClassBox from './schedules/ClassBox'

const Schedule = () => {
  const { pickedCourses } = useContext(CourseContext)
  const { multipleOptions, selectedOption } = useContext(MultipleOptionsContext)

  console.log("current picked courses: ", pickedCourses);
  console.log("current multiple options: ", multipleOptions);

  const scheduleRef = useRef(null)

  const dayValues = Array.from({ length: 6 }, (_, i) => i)
  const hourValues = Array.from({ length: maxHour - minHour + 1 }, (_, i) => minHour + i)
  const [classes, setClasses] = useState<ClassDescriptor[]>([])
  const [conflictInfo, setConflictInfo] = useState<ConflictInfo[]>([]);

  useEffect(() => {
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

    //setConflictInfo(computeConflicts(newClasses))
    setClasses(newClasses)
  }, [multipleOptions, pickedCourses, selectedOption])

  const slotTypes = useMemo(() => {
    let aux = new Set()

    for (const currentClass of classes) {
      const class_info = currentClass?.classInfo
      console.log("current classes is: ", currentClass);

      class_info.slots.forEach((element) => {
        aux.add(element.lesson_type)
      })
    }

    return aux
  }, [classes])

  const [hiddenLessonsTypes, setHiddenLessonsTypes] = useState<String[]>([])

  const [showGrid, setShowGrid] = useShowGrid()

  return (
    <>
      {/* Schedule Desktop */}
      <div ref={scheduleRef} className="schedule-area gap-2">
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
          <div className="schedule-main-left">
            {hourValues.map((hour: number, hourLabelIdx: number) => (
              <span key={`hour-label-${hourLabelIdx}`}>{convertHour(hour.toString())}</span>
            ))}
          </div>
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
                    />
                  ))}
              </div>
            </div>
          </div>
        </div>

        {/* TODO: Create a component for this */}
        <div className="flex justify-between gap-5 pl-16">
          <div className="flex flex-wrap gap-4 gap-y-1 text-sm text-gray-600 dark:text-white 2xl:gap-y-2 2xl:text-base">
            {[...slotTypes].map((lessonType: string) => (
              <label
                className="group relative flex items-center gap-1.5 overflow-x-hidden rounded-lg hover:cursor-pointer lg:gap-1"
                key={`lesson-type-${lessonType}`}
              >
                <input
                  type="checkbox"
                  className="peer hidden"
                  checked={hiddenLessonsTypes.includes(lessonType)}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setHiddenLessonsTypes((prev) => [...prev, lessonType])
                    } else {
                      setHiddenLessonsTypes((prev) => prev.filter((type) => type !== lessonType))
                    }
                  }}
                />

                <span
                  className={`flex h-4 w-4 items-center justify-center rounded 2xl:h-4 2xl:w-4 
                ${'bg-schedule-' + lessonType.toLowerCase() + '/80'}`}
                  style={{ marginRight: '5px' }}
                >
                  {hiddenLessonsTypes.find((lesson) => lesson === lessonType) ? (
                    <EyeSlashIcon className={`h-3 w-3 text-white`} />
                  ) : (
                    <EyeIcon className={`h-3 w-3 text-white`} />
                  )}
                </span>

                <span className="cursor-pointer select-none peer-checked:line-through">{getClassType(lessonType)}</span>

                {/* Shine box */}
                <div className="z-5 absolute -inset-full top-0 block h-full w-1/2 -skew-x-12 transform bg-gradient-to-r from-transparent to-white opacity-40 group-hover:animate-shine" />
              </label>
            ))}
          </div>
          <div className="flex gap-2">
            <ToggleScheduleGrid showGridHook={[showGrid, setShowGrid]} />
            <PrintSchedule component={scheduleRef} />
          </div>
        </div>
      </div>
    </>
  )
}

export default Schedule
