import classNames from 'classnames'
import SelectionModal from '../components/planner/SelectionModal'
import ScheduleListbox from '../components/planner/ScheduleListbox'
import { useState, useEffect } from 'react'
import { majorsData, coursesData, schedulesData } from '../utils/data'
import {
  MajorCourses,
  CheckedMajorCourses,
  YearCourses,
  Course,
  CourseSchedule,
  Schedules,
  CheckedCourse,
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

  function getSchedulesOfSelectedCourses() {
    let newSchedules = []
    selectedCourses.forEach((course) => {
      newSchedules.push(getCourseSchedule(course))
    })

    return newSchedules
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
  const [major, setMajor] = useState('')

  // courses
  const checkedCourses = coursesAddCheckProperty(getCourses())
  const [courses, setCourses] = useState<CheckedMajorCourses>(checkedCourses)
  const selectedCourses = getCheckedCourses(courses)

  // boolean controller properties
  const [classesT, setClassesT] = useState(true)
  const [classesTP, setClassesTP] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(true)

  // selected
  const [schedules, setSchedules] = useState<Schedules>([[]]) // schecules[uc][horario]
  const [selectedSchedules, setSelectedSchedules] = useState<Array<CourseSchedule | null>>(createSelectedSchedules())

  useEffect(() => {
    setSchedules(getSchedulesOfSelectedCourses())
  }, [courses, selectedSchedules])

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
            checkedCourses={checkedCourses}
            openHook={[isModalOpen, setIsModalOpen]}
            majorHook={[major, setMajor]}
            coursesHook={[courses, setCourses]}
          />
          <ClassesTypeCheckboxes classesTPHook={[classesTP, setClassesTP]} classesTHook={[classesT, setClassesT]} />
        </div>

        {/* Dropdowns */}
        <div className="mt-2 flex flex-col space-y-4 border-t py-3 px-0">
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

/* Sidebar Classes Type Checkboxes */
type ClassesTypeCheckboxesProps = {
  classesTHook: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
  classesTPHook: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
}

const ClassesTypeCheckboxes = ({ classesTHook, classesTPHook }: ClassesTypeCheckboxesProps) => {
  const [classesT, setClassesT] = classesTHook
  const [classesTP, setClassesTP] = classesTPHook

  return (
    <div className="flex flex-row items-center justify-start space-x-4 space-y-0 md:flex-col md:space-y-1 md:space-x-0">
      <div className="flex items-center justify-start">
        <input
          type="checkbox"
          id="checkbox-classesT"
          className="cursor-pointer rounded text-gray-800 hover:opacity-90 focus:ring-gray-800 dark:text-primary dark:focus:ring-primary"
          checked={classesT}
          onChange={(event) => setClassesT(event.target.checked)}
        />
        <label className="ml-1.5 cursor-pointer text-sm" htmlFor="checkbox-classesT">
          <span>Teóricas</span>
        </label>
      </div>
      <div className="flex items-center justify-start">
        <input
          type="checkbox"
          id="checkbox-classesTP"
          className="cursor-pointer rounded text-gray-800 hover:opacity-90 focus:ring-gray-800 dark:text-primary dark:focus:ring-primary"
          checked={classesTP}
          onChange={(event) => setClassesTP(event.target.checked)}
        />
        <label className="ml-1.5 cursor-pointer text-sm" htmlFor="checkbox-classesTP">
          <span>Práticas</span>
        </label>
      </div>
    </div>
  )
}

export default TimeTableSchedulerPage
