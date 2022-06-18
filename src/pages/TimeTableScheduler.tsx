import { useState, useEffect } from 'react'
import { majorsData, coursesData, schedulesData } from '../utils/data'
import { CheckedCourse, CheckedMajorCourses, Course, CourseOptions, Major, MajorCourses, YearCourses } from '../@types'
import { SparklesIcon } from '@heroicons/react/outline'
import Schedule from '../components/planner/Schedule'
import SelectionModal from '../components/planner/SelectionModal'
import ScheduleListbox from '../components/planner/ScheduleListbox'
import ClassesTypeCheckboxes from '../components/planner/ClassesTypeCheckboxes'
import useShowGrid from '../hooks/useShowGrid'
import useMajor from '../hooks/useMajor'

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
  const [majorLS, setMajorLS] = useMajor()
  const [major, setMajor] = useState<Major>(majorLS)
  const [courses, setCourses] = useState<CheckedMajorCourses>(() => coursesAddCheckProperty(getCourses()))
  const [classesT, setClassesT] = useState<boolean>(true)
  const [classesTP, setClassesTP] = useState<boolean>(true)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(() => initializeModalState())
  const [selected, setSelected] = useState<CourseOptions>(() => initializeSelected())
  const [showGrid, setShowGrid] = useShowGrid()

  useEffect(() => {
    setMajorLS(major)
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
    <div className="grid w-full grid-cols-12 gap-x-6 gap-y-4 py-4 px-4">
      {/* Schedule Preview */}
      <div className="lg:min-h-adjusted order-1 col-span-12 min-h-min rounded bg-lightest px-3 py-3 dark:bg-dark lg:col-span-9 2xl:px-5 2xl:py-5">
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
      <div className="min-h-adjusted order-2 col-span-12 flex flex-col justify-between space-y-2 rounded bg-lightest px-3 py-3 dark:bg-dark lg:col-span-3 2xl:px-4 2xl:py-4">
        <div className="space-y-2">
          <div className="flex flex-col items-center justify-center space-y-3 space-x-0 xl:flex-row xl:space-y-0 xl:space-x-3">
            <SelectionModal
              majors={majors}
              openHook={[isModalOpen, setIsModalOpen]}
              majorHook={[major, setMajor]}
              coursesHook={[courses, setCourses]}
            />
            <button
              type="button"
              onClick={() => setShowGrid(!showGrid)}
              className="hidden h-auto w-full items-center justify-center space-x-2 rounded border-2 border-transparent bg-primary px-2 py-3 
              text-xs font-medium text-white transition hover:opacity-80 lg:flex xl:w-min xl:space-x-0 xl:px-4 xl:text-sm"
            >
              <span className="flex xl:hidden">Minimal</span>
              <SparklesIcon className="h-4 w-4 xl:h-5 xl:w-5" />
            </button>
            <ClassesTypeCheckboxes classesTPHook={[classesTP, setClassesTP]} classesTHook={[classesT, setClassesT]} />
          </div>
          <div className="flex flex-col space-y-4 py-2 px-0">
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

        <div className="flex flex-col space-y-1 text-xxs 2xl:space-y-2 2xl:text-xs">
          <div className="inline-flex items-center space-x-1 lg:space-x-2">
            <span className="h-3 w-3 rounded bg-theoretical shadow 2xl:h-4 2xl:w-4" />
            <span>Teóricas</span>
          </div>
          <div className="inline-flex items-center space-x-1 lg:space-x-2">
            <span className="h-3 w-3 rounded bg-practical shadow 2xl:h-4 2xl:w-4" />
            <span>Práticas</span>
          </div>
          <div className="inline-flex items-center space-x-1 lg:space-x-2">
            <span className="h-3 w-3 rounded bg-labs shadow 2xl:h-4 2xl:w-4" />
            <span>Laboratório</span>
          </div>
          <div className="inline-flex items-center space-x-1 lg:space-x-2">
            <span className="h-3 w-3 rounded bg-teal-600/50 shadow 2xl:h-4 2xl:w-4" />
            <span>Almoço</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TimeTableSchedulerPage
