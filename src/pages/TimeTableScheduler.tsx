import { useState, useEffect } from 'react'
import { majorsData, coursesData, schedulesData } from '../utils/data'
import { CheckedCourse, CheckedMajorCourses, Course, CourseOptions, Major, MajorCourses, YearCourses } from '../@types'
import { SparklesIcon } from '@heroicons/react/outline'
import Schedule from '../components/planner/Schedule'
import SelectionModal from '../components/planner/SelectionModal'
import ScheduleListbox from '../components/planner/ScheduleListbox'
import ClassesTypeCheckboxes from '../components/planner/ClassesTypeCheckboxes'
import useShowGrid from '../hooks/useShowGrid'

const TimeTableSchedulerPage = () => {
  const getMajors = () => {
    // TODO: replace majorsData with backend request
    return majorsData
  }

  const getCourses = () => {
    //TODO: replace courseData with backend request
    return coursesData
  }

  const getCourseSchedule = (course) => {
    // TODO: Replace schedulesData (static IART) with backend request
    return schedulesData
  }

  const initializeMajor = (): Major => {
    const storedMajor = JSON.parse(localStorage.getItem('niaefeup-tts.major'))
    if (storedMajor === null) return null
    else return storedMajor
  }

  const coursesAddCheckProperty = (majorCourses: MajorCourses): CheckedMajorCourses => {
    return majorCourses.map((year: YearCourses) =>
      year.map((item: Course) => ({
        checked: false,
        info: item,
      }))
    )
  }

  const getCheckedCourses = (courses: CheckedMajorCourses): CheckedCourse[] => {
    return courses.flat().filter((course) => course.checked)
  }

  const initializeSelected = (): CourseOptions => {
    const selectedCourses = getCheckedCourses(courses)
    return selectedCourses.map((course: CheckedCourse) => ({
      course: course,
      option: null,
      schedules: getCourseSchedule(course),
    }))
  }

  const initializeModalState = () => {
    if (process.env.REACT_APP_DEVELOPMENT) {
      return major?.name === '' ? true : false
    } else if (process.env.REACT_APP_PRODUCTION) {
      return major?.name !== '' && selected.length > 0 ? false : true
    } else return true
  }

  const majors = getMajors()
  const [major, setMajor] = useState<Major>(() => initializeMajor())
  const [courses, setCourses] = useState<CheckedMajorCourses>(() => coursesAddCheckProperty(getCourses()))
  const [classesT, setClassesT] = useState<boolean>(true)
  const [classesTP, setClassesTP] = useState<boolean>(true)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(() => initializeModalState())
  const [selected, setSelected] = useState<CourseOptions>(() => initializeSelected())
  const [showGrid, setShowGrid] = useShowGrid()

  useEffect(() => {
    localStorage.setItem('niaefeup-tts.major', JSON.stringify(major))
  }, [major])

  useEffect(() => {
    // const findPreviousEntry = (prevSelected: CourseOptions, course: CheckedCourse) => {
    //   const value = prevSelected.find((item) => item.course.info.course_unit_id === course.info.course_unit_id)
    //   return value ? value.option : null
    // }

    setSelected((prevSelected) => [
      ...getCheckedCourses(courses).map((course: CheckedCourse) => ({
        course: course,
        option: null,
        schedules: getCourseSchedule(course),
      })),
    ])
  }, [courses])

  return (
    <div className="grid w-full grid-cols-12 gap-x-4 gap-y-4 py-4 px-8 md:px-8 xl:gap-x-8 xl:gap-y-0">
      {/* Schedule Preview */}
      <div className="lg:min-h-adjusted order-2 col-span-12 min-h-min rounded bg-lightest px-3 py-3 dark:bg-dark md:order-1 lg:col-span-9 lg:px-4 lg:py-4">
        <div className="h-full w-full">
          <Schedule
            showGrid={showGrid}
            courseOptions={selected}
            activeClassesT={classesT}
            activeClassesTP={classesTP}
          />
        </div>
      </div>

      {/* Sidebar */}
      <div className="min-h-adjusted order-1 col-span-12 flex flex-col justify-between space-y-2 rounded bg-lightest px-4 py-4 dark:bg-dark md:order-2 lg:col-span-3">
        <div className="space-y-3">
          <div className="flex flex-col items-center justify-center space-y-2 space-x-0 2xl:flex-row 2xl:space-y-0 2xl:space-x-3">
            <SelectionModal
              majors={majors}
              openHook={[isModalOpen, setIsModalOpen]}
              majorHook={[major, setMajor]}
              coursesHook={[courses, setCourses]}
            />
            <button
              type="button"
              onClick={() => setShowGrid(!showGrid)}
              className="flex h-auto w-full items-center justify-center space-x-2 rounded border-2 border-navy px-2 
              py-3 text-xs font-medium text-navy transition hover:bg-navy hover:text-white dark:text-white xl:px-4 xl:text-sm 2xl:w-min"
            >
              <SparklesIcon className="h-4 w-4 xl:h-5 xl:w-5" />
              <span className="flex 2xl:hidden">Tidy</span>
            </button>
            <ClassesTypeCheckboxes classesTPHook={[classesTP, setClassesTP]} classesTHook={[classesT, setClassesT]} />
          </div>
          <div className="flex flex-col space-y-6 border-t py-3 px-0">
            {selected.length > 0 &&
              selected.map((courseOption, courseOptionIdx) => (
                <ScheduleListbox
                  courseOption={courseOption}
                  selectedHook={[selected, setSelected]}
                  key={`course-schedule-listbox-${courseOptionIdx}`}
                />
              ))}
          </div>
        </div>

        <div className="flex flex-col space-y-2 text-xs lg:text-sm">
          <div className="inline-flex items-center space-x-1 lg:space-x-2">
            <span className="h-5 w-5 rounded bg-theoretical shadow" />
            <span>Teóricas</span>
          </div>
          <div className="inline-flex items-center space-x-1 lg:space-x-2">
            <span className="h-5 w-5 rounded bg-practical shadow" />
            <span>Práticas</span>
          </div>
          <div className="inline-flex items-center space-x-1 lg:space-x-2">
            <span className="h-5 w-5 rounded bg-labs shadow" />
            <span>Laboratório</span>
          </div>
          <div className="inline-flex items-center space-x-1 lg:space-x-2">
            <span className="h-5 w-5 rounded bg-teal-600/50 shadow" />
            <span>Almoço</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TimeTableSchedulerPage
