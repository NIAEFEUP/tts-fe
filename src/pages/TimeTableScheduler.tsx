import SelectionModal from '../components/planner/SelectionModal'
import ScheduleListbox from '../components/planner/ScheduleListbox'
import ClassesTypeCheckboxes from '../components/planner/ClassesTypeCheckboxes'
import { useState, useEffect } from 'react'
import { majorsData, coursesData, schedulesData } from '../utils/data'
import {
  CheckedCourse,
  CheckedMajorCourses,
  Course,
  CourseOptions,
  CourseSchedule,
  Major,
  MajorCourses,
  Schedules,
  YearCourses,
} from '../@types'

const TimeTableSchedulerPage = () => {
  function getMajors() {
    // TODO: replace majorsData with backend request
    return majorsData
  }

  function getCourses() {
    //TODO: replace courseData with backend request
    return coursesData
  }

  function getCourseSchedule(course) {
    // TODO: Replace schedulesData (static IART) with backend request
    return schedulesData
  }

  function initializeMajor(): Major {
    const storedMajor = JSON.parse(localStorage.getItem('niaefeup-tts.major'))
    if (storedMajor === null) return { name: '' }
    else return storedMajor
  }

  function getSchedulesOfSelectedCourses() {
    return selectedCourses.map((course) => getCourseSchedule(course))
  }

  function createSelectedSchedules() {
    return Array(selectedCourses.length).fill(null)
  }

  function coursesAddCheckProperty(majorCourses: MajorCourses): CheckedMajorCourses {
    return majorCourses.map((year: YearCourses) =>
      year.map((item: Course) => ({
        checked: false,
        info: item,
      }))
    )
  }

  function getCheckedCourses(courses: CheckedMajorCourses): CheckedCourse[] {
    return courses.flat().filter((course) => course.checked)
  }

  // majors
  const majors = getMajors()
  const [major, setMajor] = useState<Major>(initializeMajor())

  // courses
  const [courses, setCourses] = useState<CheckedMajorCourses>(coursesAddCheckProperty(getCourses()))
  const selectedCourses = getCheckedCourses(courses)

  // boolean controller properties
  const [classesT, setClassesT] = useState<boolean>(true)
  const [classesTP, setClassesTP] = useState<boolean>(true)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(true)

  // selected
  const [selected, setSelected] = useState<CourseOptions>([])
  const [schedules, setSchedules] = useState<Schedules>([[]]) // schecules[uc][horario]
  const [selectedSchedules, setSelectedSchedules] = useState<Array<CourseSchedule | null>>(createSelectedSchedules())

  useEffect(() => {
    localStorage.setItem('niaefeup-tts.major', JSON.stringify(major))
  }, [major])

  useEffect(() => {
    setSchedules(getSchedulesOfSelectedCourses())
  }, [courses, selectedSchedules])

  useEffect(() => {
    // let ola = checkedCourses.map((course) => ({
    //   course: course,
    //   option: null,
    //   schedules: 
    // }))
    // console.log(ola)
    console.log(selectedCourses)
  }, [selectedCourses])

  return (
    <div className="grid w-full grid-cols-12 gap-x-0 gap-y-8 py-4 px-6 md:px-4 xl:gap-x-6 xl:gap-y-0">
      {/* Schedule Preview */}
      <div className="min-h-adjusted col-span-12 bg-lightest p-3 dark:bg-dark lg:col-span-9">
        <div className="w-full">Schedule preview content</div>
      </div>

      {/* Sidebar */}
      <div className="min-h-adjusted col-span-12 bg-lightest p-3 dark:bg-dark lg:col-span-3">
        {/* Sidebar top */}
        <div className="flex flex-col items-start justify-start space-y-2 space-x-0 md:flex-row md:space-y-0 md:space-x-2">
          <SelectionModal
            majors={majors}
            openHook={[isModalOpen, setIsModalOpen]}
            majorHook={[major, setMajor]}
            coursesHook={[courses, setCourses]}
          />
          <ClassesTypeCheckboxes classesTPHook={[classesTP, setClassesTP]} classesTHook={[classesT, setClassesT]} />
        </div>

        {/* Dropdowns */}
        <div className="mt-3 flex flex-col space-y-4 border-t py-3 px-0">
          {schedules.length > 0
            ? selectedCourses.map((course, courseIdx) => (
                <ScheduleListbox
                  key={`course-schedule-listbox-${courseIdx}`}
                  course={course}
                  schedules={schedules[courseIdx]}
                  selectedSchedulesHook={[selectedSchedules, setSelectedSchedules]}
                />
              ))
            : null}
        </div>
      </div>
    </div>
  )
}

export default TimeTableSchedulerPage
