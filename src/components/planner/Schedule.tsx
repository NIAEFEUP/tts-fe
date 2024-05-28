import '../../styles/schedule.css'
import classNames from 'classnames'
import { useMemo, useRef, useState } from 'react'
// import { Lesson, CourseOption } from '../../@types'
import { Option, CourseOption } from '../../@types/new_index'
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

  const scheduleRef = useRef(null)

  const dayValues = Array.from({ length: 6 }, (_, i) => i)
  const hourValues = Array.from({ length: maxHour - minHour + 1 }, (_, i) => minHour + i)

  const classes = useMemo(() => {
    let aux = [];
    const option = multipleOptions[selectedOption];

    console.log("Option: ", option);
    
    for (let i = 0; i < option.course_options.length; i++) {
      const course_info = pickedCourses.find((course) => course.id === option.course_options[i].course_id) 
      const class_info = course_info.classes?.find((class_info) => class_info.id === option.course_options[i].picked_class_id)

      if (course_info === undefined || class_info === undefined) continue;
      aux.push({
        course_info: course_info,
        class_info: class_info,
      })
    }
    
    return aux;
  }, [multipleOptions, pickedCourses, selectedOption]);

  console.log("Classes: ", classes);

  const slotTypes = useMemo(() => {
    let aux = []

    for (let i = 0; i < classes.length; i++) {
      const current_class = classes[i];
      const class_info = current_class?.class_info;

      class_info.slots.array.forEach(element => {
        aux.push(element.type);
      }); 
    }
    
    return aux
  }, [classes]);

  const [hiddenLessonsTypes, setHiddenLessonsTypes] = useState<String[]>([])

  // const subjects = useMemo(() => {
  //   const classes = courseOptions.filter((item) => item.option !== null)

  //   const chosenSubjects = classes.map((subject, subjectIdx) => ({
  //     shown: subject.shown,
  //     course: subject.course.info,
  //     // A course schedule, may have more than one practical class.
  //     practicalLesson: classes.map((item) =>
  //       item.schedules.filter((elem) => elem.lesson_type !== 'T' && elem.class_name === subject.option.class_name)
  //     )[subjectIdx],
  //     // A course schedule, may have more than one theoretical class.
  //     theoreticalLessons: classes.map((item) =>
  //       item.schedules.filter((elem) => elem.lesson_type === 'T' && elem.class_name === subject.option.class_name)
  //     )[subjectIdx],
  //   }))
  //   return chosenSubjects
  // }, [courseOptions])

  // const lessons = useMemo(() => {
  //   let lessonsAcc: Lesson[] = []

  //   // - Dá push a uma Lesson
  //   // - Dá sort
  //   subjects.forEach((subject) => {
  //     console.log('subject: ', subject) /*if (subject.shown.T) {
  //       subject.theoreticalLessons.forEach((lesson) => lessonsAcc.push({ course: subject.course, schedule: lesson }))
  //     }

  //     if (subject.shown.TP) {
  //       subject.practicalLesson.forEach((lesson) => lessonsAcc.push({ course: subject.course, schedule: lesson }))
  //     }*/
  //   })

  //   lessonsAcc.sort((first, second) => {
  //     if (first.schedule.day === second.schedule.day)
  //       return parseFloat(first.schedule.start_time) > parseFloat(second.schedule.start_time) ? -1 : 1
  //     else return first.schedule.day > second.schedule.day ? 1 : -1
  //   })
  //   return lessonsAcc
  // }, [subjects])

  // const lessonTypes = useMemo(() => {
  //   let lessonTypesAcc = []

  //   lessons.forEach((lesson) => {
  //     if (!lessonTypesAcc.includes(lesson.schedule.lesson_type)) {
  //       lessonTypesAcc.push(lesson.schedule.lesson_type)
  //     }
  //   })

  //   // Same order every time
  //   lessonTypesAcc.sort((first, second) => {
  //     return Object.keys(lessonTypesDic).indexOf(first) > Object.keys(lessonTypesDic).indexOf(second) ? 1 : -1
  //   })

  //   return lessonTypesAcc
  // }, [lessons, lessonTypesDic])

  /**
   * Find conflicts among classes between classes.
   * Consider that the classes are ordered in ascending order by the start_time.
   * The final result is a matrix o schedules, where conflictuos classes are grouped together.
   *
   * Example:
   * => AMAT:   09h00 ~ 11h00
   * => RC:     11h00 ~ 12h00
   * => TC:     11h00 ~ 13h00
   *
   * 1st iteraction: acc = [AMAT]
   * 2nd iteraction: acc = [RC], conflictsAcc = [[AMAT]]
   * 3rd iteraction: acc = [RC, TC], conflictsAcc = [[AMAT], [RC, TC]]
   */
  const lessonsGroupedByDays = useMemo(() => {
    let i = 0
    let j = 0
    let lessonsAcc = []

    for (let i = 0; i < classes.length; i++) {
      const current_class = classes[i];

      const class_info = current_class.class_info;
      const current_slots = class_info.slots

      while ( i < current_slots.length ) {
        let acc = []
        while (j < current_slots.length && current_slots[i].schedule.day === current_slots[j].schedule.day) {
          acc.unshift(current_slots[j])
          j++
        }
        i = j
        lessonsAcc.push(acc)
      }
    }

    return lessonsAcc
  }, [classes])

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
                {classes.map((c) => (
                  c.classInfo === undefined 
                  ? <></>
                   : <ClassBox 
                    key={`course[${c.course_info.id}]-class[${c.class_info.id}]`}
                    courseInfo={c.course_info}
                    classInfo={c.class_info ?? null}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* TODO: Create a component for this */}
        <div className="flex justify-between gap-5 pl-16">
          <div className="flex flex-wrap gap-4 gap-y-1 text-sm text-gray-600 dark:text-white 2xl:gap-y-2 2xl:text-base">
            {slotTypes.map((lessonType: string) => (
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

      {/* Schedule Mobile */}
      {/* <div className="flex h-full w-full flex-col items-center justify-start gap-2 space-y-2 lg:hidden">
        {lessonsGroupedByDays.length > 0 ? (
          lessonsGroupedByDays.map((lessons: Lesson[], dayNumber: number) => (
            <div className="flex w-full items-center justify-start gap-2" key={`responsive-lesson-row-${dayNumber}`}>
              <div className="flex h-full rounded bg-primary p-1">
                <strong className="text-xl text-white">{convertWeekdayLong(dayNumber)[0]}</strong>
              </div>
              <div className="flex w-full flex-row flex-wrap items-center justify-start gap-2">
                {lessons.map(
                  (lesson: Lesson, lessonIdx: number) =>
                    !hiddenLessonsTypes.includes(lesson.schedule.lesson_type) && (
                      <ResponsiveLessonBox
                        key={`responsive-lesson-box-${dayNumber}-${lessonIdx}`}
                        lesson={lesson}
                        conflict={false}
                      />
                    )
                )}
              </div>
            </div>
          ))
        ) : (
          <span>Nenhum horário selecionado</span>
        )}
      </div> */}
    </>
  )
}

export default Schedule
