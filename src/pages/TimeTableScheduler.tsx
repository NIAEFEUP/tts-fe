import BackendAPI from '../backend'
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
// import { useCourses, useMajor, useShowGrid } from '../hooks'

const TimeTableSchedulerPage = () => {
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
   * Example input:
   * [{ course: 1, year: 1}, { course: 3, year: 1 }, { course: 2, year: 2}]
   * Returns:
   * [[{ course: 1, year: 1}, { course: 3, year: 1}], [{ course: 2, year: 2}]]
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

  const getCheckedCourses = (courses: CheckedCourse[][]) => courses.flat().filter((course) => course.checked)
  const getSchedule = async (checkedCourse: CheckedCourse, prevOption: CourseSchedule = null): Promise<CourseOption> =>
    await BackendAPI.getCourseSchedule(checkedCourse).then((schedulesRes: CourseSchedule[]) => ({
      course: checkedCourse,
      option: prevOption,
      schedules: schedulesRes,
    }))

  const [major, setMajor] = useState<Major>(null) // the picked major
  const [majors, setMajors] = useState<Major[]>([]) // all the majors
  const [checkedCourses, setCheckedCourses] = useState<CheckedCourse[][]>([]) // courses for the major with frontend properties
  const [showGrid, setShowGrid] = useState(true)
  const [courseOptions, setCourseOptions] = useState<CourseOption[]>(() =>
    getCheckedCourses(checkedCourses).map((course: CheckedCourse) => ({
      course: course,
      option: null,
      schedules: [],
    }))
  )

  const [classesT, setClassesT] = useState<boolean>(true)
  const [classesTP, setClassesTP] = useState<boolean>(true)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(() => !major || courseOptions.length === 0)

  // fetch majors
  useEffect(() => {
    BackendAPI.getMajors().then((majors: Major[]) => {
      setMajors(majors)
    })
  }, [])

  // fetch courses for the major (once one has been picked)
  useEffect(() => {
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
  }, [major])

  // fetch schedules for the courses (once courses have been picked)
  useEffect(() => {
    const findPreviousEntry = (prevSelected: CourseOption[], course: CheckedCourse) => {
      const value = prevSelected.find((item) => item.course.info.course_unit_id === course.info.course_unit_id)
      return value !== undefined ? value.option : null
    }

    setCourseOptions((prev) => {
      let newCourseOptions = []
      const onlyPickedCourses = getCheckedCourses(checkedCourses)

      for (let i = 0; i < onlyPickedCourses.length; i++) {
        const option = findPreviousEntry(prev, onlyPickedCourses[i])
        getSchedule(onlyPickedCourses[i], option).then((schedule) => {
          newCourseOptions.push(schedule)
        })
      }

      return newCourseOptions
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
            <MoreActionsButton schedule={courseOptions} showGridHook={[showGrid, setShowGrid]} />
            <ClassesTypeCheckboxes classesTPHook={[classesTP, setClassesTP]} classesTHook={[classesT, setClassesT]} />
          </div>
          <div className="flex flex-col gap-4 py-2 px-0">
            {courseOptions.length > 0 &&
              courseOptions.map((courseOption, courseOptionIdx) => (
                <ScheduleListbox
                  courseOption={courseOption}
                  selectedHook={[courseOptions, setCourseOptions]}
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
