import BackendAPI from '../backend'
import StorageAPI from '../utils/storage'
import { useState, useEffect, useRef } from 'react'
import { ScheduleColorLabels } from '../components/planner/schedules'
import {
  Schedule,
  SelectionModal,
  ScheduleListbox,
  ClassesTypeCheckboxes,
  MoreActionsButton,
} from '../components/planner'
import { CheckedCourse, Course, CourseOption, CourseSchedule, Major } from '../@types'
import { useMajor, useShowGrid } from '../hooks'

const TimeTableSchedulerPage = () => {
  const firstRenderRef = useRef(true)
  const [major, setMajor] = useMajor() // the picked major
  const [majors, setMajors] = useState<Major[]>([]) // all the majors
  const [showGrid, setShowGrid] = useShowGrid() // show the schedule grid or not
  const [courseOptions, setCourseOptions] = useState<CourseOption[]>([]) // the course options selected on the sidebar
  const [checkedCourses, setCheckedCourses] = useState<CheckedCourse[][]>([]) // courses for the major with frontend properties

  const [classesT, setClassesT] = useState<boolean>(true)
  const [classesTP, setClassesTP] = useState<boolean>(true)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(() => !major || checkedCourses.length === 0)

  /**
   * Adds the checked and info property to the major courses.
   * @param majorCourses Courses in a major grouped by year.
   * @returns Course[][] with the checked and info properties.
   */
  const majorCoursesToCheckedMajor = (majorCourses: Course[][]): CheckedCourse[][] =>
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

  // extract only the course with checked: true
  const getPickedCourses = (courses: CheckedCourse[][]) => courses.flat().filter((course) => course.checked)

  // fetch all schedules for the picked courses
  const fetchPickedSchedules = async (picked: CheckedCourse[]) => await BackendAPI.getCoursesSchedules(picked)

  // fetch majors when component is ready
  useEffect(() => {
    BackendAPI.getMajors().then((majors: Major[]) => {
      setMajors(majors)
    })
  }, [])

  // once a major has been picked => local storage or fetch courses for the major
  useEffect(() => {
    if (firstRenderRef.current === true) {
      firstRenderRef.current = false
    } else {
      StorageAPI.setCoursesStorage([])
      StorageAPI.setCourseOptionsStorage([])
    }

    const coursesStorage = StorageAPI.getCoursesStorage()
    if (coursesStorage.length > 0) {
      setCheckedCourses(coursesStorage)
      // setIsModalOpen(false) // FIXME: decide if we want to show the modal or not here
    } else {
      BackendAPI.getCourses(major).then((courses: Course[]) => {
        const majorCourses: Course[][] = groupMajorCoursesByYear(courses)
        setCheckedCourses((prev) => {
          const empty = prev?.length === 0
          const checks: boolean[] = prev.flat().map((course: CheckedCourse) => course.checked)

          if (empty || !checks.includes(true)) {
            return majorCoursesToCheckedMajor(majorCourses)
          }
        })
      })
    }
  }, [major])

  // fetch schedules for the courses and preserve course options (once courses have been picked)
  useEffect(() => {
    const findPreviousEntry = (prevSelected: CourseOption[], course: CheckedCourse) => {
      const value = prevSelected.find((item) => item.course.info.course_unit_id === course.info.course_unit_id)
      return value !== undefined ? value.option : null
    }

    StorageAPI.setCoursesStorage(checkedCourses)
    const pickedCourses = getPickedCourses(checkedCourses)
    if (pickedCourses.length === 0) return

    const courseOptionsStorage = StorageAPI.getCourseOptionsStorage()
    const notNulls = courseOptionsStorage.filter((item) => item.option !== null)

    if (notNulls.length > 0) {
      setCourseOptions(courseOptionsStorage)
    } else {
      fetchPickedSchedules(pickedCourses).then((schedules: CourseSchedule[]) => {
        setCourseOptions((prev) => {
          let newCourseOptions = []
          const notNulls = prev.filter((item) => item.option !== null)
          if (notNulls.length > 0) {
            for (let i = 0; i < pickedCourses.length; i++) {
              const option = findPreviousEntry(prev, pickedCourses[i])
              newCourseOptions.push({
                course: pickedCourses[i],
                option: option,
                schedules: schedules[i],
              })
            }
          } else {
            for (let i = 0; i < pickedCourses.length; i++) {
              newCourseOptions.push({
                course: pickedCourses[i],
                option: null,
                schedules: schedules[i],
              })
            }
          }

          return [...newCourseOptions]
        })
      })
    }
  }, [checkedCourses])

  useEffect(() => {
    const notNulls = courseOptions.filter((item) => item.option !== null)
    if (notNulls.length === 0) return
    StorageAPI.setCourseOptionsStorage(courseOptions)
  }, [courseOptions])

  return (
    <div className="grid w-full grid-cols-12 gap-x-4 gap-y-4 py-4 px-4">
      {/* Schedule Preview */}
      <div className="lg:min-h-adjusted order-1 col-span-12 min-h-min rounded bg-lightest px-3 py-3 dark:bg-dark lg:col-span-9 2xl:px-5 2xl:py-5">
        <div className="h-full w-full">
          <Schedule
            showGrid={showGrid}
            courseOptions={courseOptions}
            activeClassesT={classesT}
            activeClassesTP={classesTP}
          />
        </div>
      </div>

      {/* Sidebar */}
      <div
        className="lg:min-h-adjusted order-2 col-span-12 flex min-h-min flex-col justify-between 
        rounded bg-lightest px-3 py-3 dark:bg-dark lg:col-span-3 2xl:px-4 2xl:py-4"
      >
        <div className="space-y-2">
          <div className="flex flex-col flex-wrap items-center justify-start gap-3 xl:flex-row">
            <SelectionModal
              majors={majors}
              openHook={[isModalOpen, setIsModalOpen]}
              majorHook={[major, setMajor]}
              coursesHook={[checkedCourses, setCheckedCourses]}
            />
            <MoreActionsButton
              schedule={courseOptions}
              showGridHook={[showGrid, setShowGrid]}
              courseOptionsHook={[courseOptions, setCourseOptions]}
            />
            <ClassesTypeCheckboxes classesTPHook={[classesTP, setClassesTP]} classesTHook={[classesT, setClassesT]} />
          </div>
          <div className="flex flex-col gap-4 py-2 px-0">
            {courseOptions.length > 0 &&
              courseOptions.map((courseOption, courseOptionIdx) => (
                <ScheduleListbox
                  courseOption={courseOption}
                  courseOptionsHook={[courseOptions, setCourseOptions]}
                  key={`course-schedule-listbox-${courseOptionIdx}`}
                />
              ))}
          </div>
        </div>
        <ScheduleColorLabels />
      </div>
    </div>
  )
}

export default TimeTableSchedulerPage
