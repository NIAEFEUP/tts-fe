import BackendAPI from '../api/backend'
import StorageAPI from '../api/storage'
import { useState, useEffect, useMemo } from 'react'
import {
  Schedule,
  SelectionModal,
  ScheduleListbox,
  ClassesTypeCheckboxes,
  MoreActionsButton,
  OptionsController,
  LessonTypesModal,
  HelpModal,
  ShareButtons,
} from '../components/planner'
import { CheckedCourse, Course, CourseOption, CourseSchedule, Major, MultipleOptions } from '../@types'
import { useShowGrid, useMajor, useCourses } from '../hooks'

const TimeTableSchedulerPage = () => {
  // add check property to courses
  const courseToCheckedCourse = (majorCourses: Course[][]): CheckedCourse[][] =>
    majorCourses.map((year: Course[]) =>
      year.map((item: Course) => ({
        checked: false,
        info: item,
      }))
    )

  /**
   * Considering that the yearCourses is sorted by the course_year field in ascending order, the function groups the major courses by year.
   * @param yearCourses All the courses in a major.
   * @returns The courses grouped by year.
   * @example input: [{ course: 1, year: 1 }, { course: 3, year: 1 }, { course: 2, year: 2 }]
   * @example output: [[{ course: 1, year: 1 }, { course: 3, year: 1 }], [{ course: 2, year: 2 }]]
   */
  const groupMajorCoursesByYear = (yearCourses: Course[]): Course[][] => {
    let majorCourses: Course[][] = []
    let currYear = 0
    for (let i = 0; i < yearCourses.length; i++) {
      if (yearCourses[i].course_year !== currYear) {
        currYear += 1
        majorCourses.push([yearCourses[i]])
      } else {
        majorCourses[currYear - 1].push(yearCourses[i])
      }
    }
    return majorCourses
  }

  const getEmptyCourseOption = (course: CheckedCourse, schedules: CourseSchedule[]): CourseOption => {
    return {
      shown: {
        T: true,
        TP: true,
      },
      course: course,
      option: null,
      schedules: schedules,
    }
  }

  // extract only the course with checked: true
  const getPickedCourses = (courses: CheckedCourse[][]) => courses.flat().filter((course) => course.checked)

  // fetch all schedules for the picked courses
  const fetchPickedSchedules = async (picked: CheckedCourse[]) => await BackendAPI.getCoursesSchedules(picked)

  // modal initial value
  const getModalIsOpenValue = (easy?: boolean) => (easy ? !major || getPickedCourses(checkedCourses).length < 3 : true)

  const [major, setMajor, majorChangedRef] = useMajor() // the picked major
  const [majors, setMajors] = useState<Major[]>([]) // all the majors
  const [showGrid, setShowGrid] = useShowGrid() // show the schedule grid or not
  const [checkedCourses, setCheckedCourses] = useCourses() // courses for the major with frontend properties
  const [multipleOptions, setMultipleOptions] = useState<MultipleOptions>({ index: 0, selected: [], options: [] }) // schedule options and selected schedule
  const totalSelected = useMemo(
    () => multipleOptions.options.map((co: CourseOption[]) => co.filter((item) => item.option !== null)).flat(),
    [multipleOptions]
  )

  const [classesT, setClassesT] = useState<boolean>(true)
  const [classesTP, setClassesTP] = useState<boolean>(true)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(() => getModalIsOpenValue(true))
  const [isImportedSchedule, setIsImportedSchedule] = useState<boolean>(false)


  useEffect(() => {
    if (totalSelected.length === 0) return
    StorageAPI.setOptionsStorage(multipleOptions)
  }, [multipleOptions, totalSelected])

  // fetch majors when component is ready
  useEffect(() => {
    document.getElementById('layout').scrollIntoView()
    BackendAPI.getMajors().then((majors: Major[]) => {
      setMajors(majors)
    })
  }, [])


  const updateCheckedCourses = (newCheckedCourses: CheckedCourse[][], importedCourses: CourseOption[]) => {
    
    for (let i = 0; i < newCheckedCourses.length; i++) {
      for (let j = 0; j < newCheckedCourses[i].length; j++) {
        
        for (let k = 0; k < importedCourses.length; k++) {
          if (importedCourses[k].course.info.course_unit_id === newCheckedCourses[i][j].info.course_unit_id) {
            newCheckedCourses[i][j].checked = true
            break
          }
        }
      }
    }
    
    
    return newCheckedCourses
  }

  // once a major has been picked => fetch courses for the major

  useEffect(() => {
    if (major === null || (majorChangedRef.current === false && checkedCourses.length > 0 && !isImportedSchedule)) {
      return
    }
    BackendAPI.getCourses(major).then((courses: Course[]) => {
      const majorCourses = groupMajorCoursesByYear(courses)
      const newCheckedCourses = courseToCheckedCourse(majorCourses)
      let uCC = updateCheckedCourses(newCheckedCourses, multipleOptions.selected)
      majorChangedRef.current = false
      setCheckedCourses([...uCC])
    })
  }, [major, majorChangedRef, checkedCourses, multipleOptions])

  // fetch schedules for the courses and preserve course options (once courses have been picked)
  useEffect(() => {
    const pickedCourses = getPickedCourses(checkedCourses)
    if (pickedCourses.length === 0) return

    const storedOptions = StorageAPI.getOptionsStorage()
    const storedOptionsNotNulls = storedOptions.options
      .map((co: CourseOption[]) => co.filter((item) => item.option !== null))
      .flat()

    const correctCourses =
      pickedCourses.map((item) => item.info.id).join('-') ===
      (storedOptions.options[0] !== undefined
        ? storedOptions.options[0].map((item) => item.course.info.id).join('-')
        : '')

    if (storedOptionsNotNulls.length > 0 && correctCourses) {
      setMultipleOptions(JSON.parse(JSON.stringify(storedOptions)))
      return
    }

    const findPreviousEntry = (prevSelected: CourseOption[], course: CheckedCourse) => {
      const value = prevSelected.find((item) => item.course.info.course_unit_id === course.info.course_unit_id)
      return value ? { shown: value.shown, option: value.option } : { shown: { T: true, TP: true }, option: null }
    }

    fetchPickedSchedules(pickedCourses).then((schedules: CourseSchedule[][]) => {
      setMultipleOptions((prev) => {
        let newCourseOptions: CourseOption[] = []
        const notNulls = prev.selected.filter((item) => item.option !== null)

        if (notNulls.length > 0) {
          for (let i = 0; i < pickedCourses.length; i++) {
            const co = findPreviousEntry(prev.selected, pickedCourses[i])
            newCourseOptions.push({
              shown: co.shown,
              course: pickedCourses[i],
              option: co.option,
              schedules: schedules[i],
            })
          }
        } else {
          for (let i = 0; i < pickedCourses.length; i++) {
            newCourseOptions.push(getEmptyCourseOption(pickedCourses[i], schedules[i]))
          }
        }

        let filler: CourseOption[] = []
        for (let i = 0; i < pickedCourses.length; i++) filler.push(getEmptyCourseOption(pickedCourses[i], schedules[i]))

        let newOptions: CourseOption[][] = []
        for (let i = 0; i < 10; i++) {
          if (i === prev.index) newOptions.push(newCourseOptions)
          else {
            if (prev.options.length === 0) newOptions.push(JSON.parse(JSON.stringify(filler))) // deep copy
            else {
              const innerNotNulls = prev.options[i].filter((item) => item.option !== null)
              if (innerNotNulls.length > 0) {
                let extraCourseOptions: CourseOption[] = []
                for (let j = 0; j < pickedCourses.length; j++) {
                  const co = findPreviousEntry(prev.options[i], pickedCourses[j])
                  extraCourseOptions.push({
                    shown: co.shown,
                    course: pickedCourses[j],
                    option: co.option,
                    schedules: schedules[j],
                  })
                }
                newOptions.push(JSON.parse(JSON.stringify(extraCourseOptions)))
              } else newOptions.push(JSON.parse(JSON.stringify(filler)))
            }
          }
        }

        return {
          index: prev.index,
          selected: newCourseOptions,
          options: newOptions,
        }
      })
    })
  }, [checkedCourses])

  return (
    <div className="grid w-full grid-cols-12 gap-x-4 gap-y-4 py-4 px-4">
      {/* Schedule Preview */}
      <div className="lg:min-h-adjusted order-1 col-span-12 min-h-min rounded bg-lightest px-3 py-3 dark:bg-dark lg:col-span-9 2xl:px-5 2xl:py-5">
        <div className="h-full w-full">
          <Schedule
            showGrid={showGrid}
            courseOptions={multipleOptions.selected}
            activeClassesT={classesT}
            activeClassesTP={classesTP}
          />
        </div>
      </div>

      {/* Sidebar */}
      <div className="lg:min-h-adjusted order-2 col-span-12 flex min-h-min flex-col justify-between rounded bg-lightest px-3 py-3 dark:bg-dark lg:col-span-3 2xl:px-4 2xl:py-4">
        <div className="space-y-2">
          <div className="flex flex-col flex-wrap items-center justify-start gap-x-2 gap-y-2 xl:flex-row">
            <OptionsController multipleOptionsHook={[multipleOptions, setMultipleOptions]} />
            
            <ShareButtons
            majorHook={[major, setMajor]}
            schedule={multipleOptions.selected}
            multipleOptionsHook={[multipleOptions, setMultipleOptions]}
            setIsImportedSchedule={setIsImportedSchedule}
            />

          
            <SelectionModal
              majors={majors}
              openHook={[isModalOpen, setIsModalOpen]}
              majorHook={[major, setMajor]}
              coursesHook={[checkedCourses, setCheckedCourses]}
            />
            <MoreActionsButton
              schedule={multipleOptions.selected}
              showGridHook={[showGrid, setShowGrid]}
              multipleOptions= {multipleOptions}
            />
            <ClassesTypeCheckboxes classesTPHook={[classesTP, setClassesTP]} classesTHook={[classesT, setClassesT]} />
          </div>
          <div className="flex flex-col gap-4 py-1 px-0">
            {multipleOptions.selected.length > 0 &&
              multipleOptions.selected.map((courseOption, courseOptionIdx) => (
                <ScheduleListbox
                  courseOption={courseOption}
                  multipleOptionsHook={[multipleOptions, setMultipleOptions]}
                  isImportedScheduleHook={[isImportedSchedule, setIsImportedSchedule]}
                  key={`course-schedule-listbox-${multipleOptions.index}-${courseOption.course.info.id}`}
                />
              ))}
          </div>
          <div className="mt-4 flex w-full flex-col items-center justify-center gap-2 2xl:flex-row">
        </div>
        </div>
        <div className="mt-4 flex w-full flex-col items-center justify-center gap-2 2xl:flex-row">
          <HelpModal />
          <LessonTypesModal />
        </div>
      </div>
    </div>
  )
}

export default TimeTableSchedulerPage
