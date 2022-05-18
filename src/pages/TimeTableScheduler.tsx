import classNames from 'classnames'
import SelectionModal from '../components/planner/SelectionModal'
import ScheduleListbox from '../components/planner/ScheduleListbox'
import { useState, useEffect } from 'react'
import { majorsData, coursesData, schedulesData } from '../utils/data'
import { MajorCourses, CheckedMajorCourses, YearCourses, Course, CourseSchedule, Schedules } from '../@types'

const TimeTableSchedulerPage = () => {
  const majors = majorsData // TODO: replace majors with select all majors query
  const checkedCourses = coursesAddCheckProperty(coursesData) //TODO: replace courseData with select all courses in major
  const [isOpen, setIsOpen] = useState(true)
  const [classesT, setClassesT] = useState(true)
  const [classesTP, setClassesTP] = useState(true)
  const [major, setMajor] = useState('')
  const [courses, setCourses] = useState<CheckedMajorCourses>(checkedCourses)
  const [schedules, setSchedules] = useState<Schedules>([[]]) // schecules[uc][horario]

  function coursesAddCheckProperty(majorCourses: MajorCourses): CheckedMajorCourses {
    return majorCourses.map((year: YearCourses) =>
      year.map((item: Course) => ({
        checked: false,
        info: item,
      }))
    )
  }

  const getSchedulesOfSelectedCourses = () => {
    let newSchedules = []
    selectedCourses.forEach((course) => {
      newSchedules.push(schedulesData) // TODO: Replace schedulesData (static IART) with get schedules for course.course_unit_id
    })

    return newSchedules
  }

  const createSelectedSchedules = () => {
    return Array(selectedCourses.length).fill(null)
  }

  const selectedCourses = courses.flat().filter((course) => course.checked)
  const [selectedSchedules, setSelectedSchedules] = useState<Array<CourseSchedule | null>>(createSelectedSchedules())

  useEffect(() => {
    setSchedules(getSchedulesOfSelectedCourses())
  }, [courses, selectedSchedules])

  return (
    <div className={classNames('grid w-full grid-cols-12', 'gap-x-0 gap-y-8 py-4 px-6 md:px-4 xl:gap-x-4 xl:gap-y-0')}>
      {/* Schedule Preview */}
      <div className="min-h-adjusted col-span-12 bg-lightest p-3 dark:bg-dark lg:col-span-9">
        <div className="w-full">Schedule preview content</div>
      </div>

      {/* Sidebar */}
      <div className="min-h-adjusted col-span-12 bg-lightest p-3 dark:bg-dark lg:col-span-3">
        {/* Sidebar top */}
        <div className="flex flex-col items-start justify-start space-y-2">
          <SelectionModal
            majors={majors}
            checkedCourses={checkedCourses}
            openHook={[isOpen, setIsOpen]}
            majorHook={[major, setMajor]}
            selectedCoursesHook={[courses, setCourses]}
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
    <div className="flex items-center justify-start space-x-4">
      <div className="flex items-center justify-start">
        <input
          type="checkbox"
          id="checkbox-classesT"
          className="cursor-pointer rounded text-gray-800 focus:ring-gray-800 dark:text-primary dark:focus:ring-primary"
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
          className="cursor-pointer rounded text-gray-800 focus:ring-gray-800 dark:text-primary dark:focus:ring-primary"
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
