import * as backendAPI from '../backend'
import { useState, useEffect } from 'react'
import { SparklesIcon } from '@heroicons/react/outline'
import { useCourses, useMajor, useShowGrid } from '../hooks'
import { CheckedCourse, CheckedMajorCourses, Course, CourseOptions, Major, MajorCourses, YearCourses } from '../@types'
import { Schedule, SelectionModal, ScheduleListbox, ClassesTypeCheckboxes, ExportSchedule } from '../components/planner'

const TimeTableSchedulerPage = () => {
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

  const initializeCourses = (major: Major) => {
    return coursesLS !== null ? coursesLS : coursesAddCheckProperty(backendAPI.getCourses(major))
  }

  const initializeSelected = (): CourseOptions => {
    const selectedCourses = getCheckedCourses(courses)
    return selectedCourses.map((course: CheckedCourse) => ({
      course: course,
      option: null,
      schedules: backendAPI.getCourseSchedule(course),
    }))
  }

  const majors = backendAPI.getMajors()
  const [majorLS, setMajorLS] = useMajor()
  const [coursesLS] = useCourses()
  const [showGrid, setShowGrid] = useShowGrid()
  const [major, setMajor] = useState<Major>(majorLS)
  const [courses, setCourses] = useState<CheckedMajorCourses>(() => initializeCourses(major))
  const [classesT, setClassesT] = useState<boolean>(true)
  const [classesTP, setClassesTP] = useState<boolean>(true)
  const [selected, setSelected] = useState<CourseOptions>(() => initializeSelected())
  const [isModalOpen, setIsModalOpen] = useState<boolean>(() => !major || selected.length === 0)

  useEffect(() => {
    setMajorLS(major)
  }, [major, setMajorLS])

  useEffect(() => {
    const findPreviousEntry = (prevSelected: CourseOptions, course: CheckedCourse) => {
      const value = prevSelected.find((item) => item.course.info.course_unit_id === course.info.course_unit_id)
      return value !== undefined ? value.option : null
    }

    // FIXME: for some reason this doesn't work properly
    setSelected((prevSelected) => [
      ...getCheckedCourses(courses).map((course: CheckedCourse) => ({
        course: course,
        option: findPreviousEntry(prevSelected, course),
        schedules: backendAPI.getCourseSchedule(course),
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
          <div className="flex flex-col flex-wrap items-center justify-start gap-3 xl:flex-row">
            <SelectionModal
              majors={majors}
              openHook={[isModalOpen, setIsModalOpen]}
              majorHook={[major, setMajor]}
              coursesHook={[courses, setCourses]}
            />
            <ExportSchedule schedule={selected} />
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
