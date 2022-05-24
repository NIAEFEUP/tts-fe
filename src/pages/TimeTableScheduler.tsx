import Schedule from '../components/planner/Schedule'
import SelectionModal from '../components/planner/SelectionModal'
import ScheduleListbox from '../components/planner/ScheduleListbox'
import ClassesTypeCheckboxes from '../components/planner/ClassesTypeCheckboxes'
import { useState, useEffect } from 'react'
import { majorsData, coursesData, schedulesData } from '../utils/data'
import { CheckedCourse, CheckedMajorCourses, Course, CourseOptions, Major, MajorCourses, YearCourses } from '../@types'

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
  const [major, setMajor] = useState<Major>(initializeMajor())
  const [courses, setCourses] = useState<CheckedMajorCourses>(coursesAddCheckProperty(getCourses()))
  const [classesT, setClassesT] = useState<boolean>(true)
  const [classesTP, setClassesTP] = useState<boolean>(true)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(initializeModalState())
  const [selected, setSelected] = useState<CourseOptions>(initializeSelected())

  useEffect(() => {
    localStorage.setItem('niaefeup-tts.major', JSON.stringify(major))
  }, [major])

  useEffect(() => {
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
      <div className="min-h-adjusted order-2 col-span-12 rounded bg-lightest px-8 py-4 dark:bg-dark md:order-1 lg:col-span-9">
        <div className="h-full w-full">
          <Schedule courseOptions={selected} />
        </div>
      </div>

      {/* Sidebar */}
      <div className="min-h-adjusted order-1 col-span-12 flex flex-col justify-between rounded bg-lightest px-4 py-4 dark:bg-dark md:order-2 lg:col-span-3">
        <div>
          <div className="flex flex-col items-center justify-center space-y-2 space-x-0 md:flex-row md:space-y-0 md:space-x-3">
            <SelectionModal
              majors={majors}
              openHook={[isModalOpen, setIsModalOpen]}
              majorHook={[major, setMajor]}
              coursesHook={[courses, setCourses]}
            />
            <ClassesTypeCheckboxes classesTPHook={[classesTP, setClassesTP]} classesTHook={[classesT, setClassesT]} />
          </div>
          <div className="mt-3 flex flex-col space-y-4 border-t py-3 px-0">
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
          <div className="inline-flex items-center space-x-1">
            <span className="h-5 w-5 rounded border bg-theoretical shadow" />
            <span>Teóricas</span>
          </div>
          <div className="inline-flex items-center space-x-1">
            <span className="h-5 w-5 rounded border bg-practical shadow" />
            <span>Práticas</span>
          </div>
          <div className="inline-flex items-center space-x-1">
            <span className="h-5 w-5 rounded border bg-labs shadow" />
            <span>Laboratório</span>
          </div>
          <div className="inline-flex items-center space-x-1">
            <span className="h-5 w-5 rounded border bg-teal-600/50 shadow" />
            <span>Almoço</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TimeTableSchedulerPage
