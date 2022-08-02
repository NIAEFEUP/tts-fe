import BackendAPI from '../api/backend'
import { useState, useEffect } from 'react'
import { ScheduleColorLabels } from '../components/planner/schedules'
import {
  Schedule,
  SelectionModal,
  ScheduleListbox,
  ClassesTypeCheckboxes,
  MoreActionsButton,
} from '../components/planner'
import { CheckedCourse, Course, CourseOption, CourseSchedule, Major } from '../@types'
import { useShowGrid, useMajor, useCourses, useOptions } from '../hooks'

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

  // extract only the course with checked: true
  const getPickedCourses = (courses: CheckedCourse[][]) => courses.flat().filter((course) => course.checked)

  // fetch all schedules for the picked courses
  const fetchPickedSchedules = async (picked: CheckedCourse[]) => await BackendAPI.getCoursesSchedules(picked)

  // modal initial value
  const getModalIsOpenValue = (easy?: boolean) => (easy ? !major || getPickedCourses(checkedCourses).length < 3 : true)

  const [major, setMajor] = useMajor() // the picked major
  const [majors, setMajors] = useState<Major[]>([]) // all the majors
  const [showGrid, setShowGrid] = useShowGrid() // show the schedule grid or not
  const [courseOptions, setCourseOptions] = useState<CourseOption[]>([]) // the course options selected on the sidebar
  const [checkedCourses, setCheckedCourses] = useCourses() // courses for the major with frontend properties
  const [classesT, setClassesT] = useState<boolean>(true)
  const [classesTP, setClassesTP] = useState<boolean>(true)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(() => getModalIsOpenValue(false))

  // fetch majors when component is ready
  useEffect(() => {
    BackendAPI.getMajors().then((majors: Major[]) => {
      setMajors(majors)
    })
  }, [])

  // once a major has been picked => fetch courses for the major
  useEffect(() => {
    if (checkedCourses.length > 0) return

    const pickedCourses = getPickedCourses(checkedCourses)
    if (pickedCourses.length > 0) return

    BackendAPI.getCourses(major).then((courses: Course[]) => {
      const majorCourses = groupMajorCoursesByYear(courses)
      const newCheckedCourses = courseToCheckedCourse(majorCourses)
      setCheckedCourses([...newCheckedCourses])
    })
  }, [major, checkedCourses, setCheckedCourses])

  // fetch schedules for the courses and preserve course options (once courses have been picked)
  useEffect(() => {
    const findPreviousEntry = (prevSelected: CourseOption[], course: CheckedCourse) => {
      const value = prevSelected.find((item) => item.course.info.course_unit_id === course.info.course_unit_id)
      return value ? value.option : null
    }

    const pickedCourses = getPickedCourses(checkedCourses)

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
  }, [checkedCourses])

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
                  key={`course-schedule-listbox-${courseOption.course.info.id}`}
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
