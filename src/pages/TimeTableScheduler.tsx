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
  YearCourses,
} from '../@types'

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
    if (storedMajor === null) return { name: '' }
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

  const majors = getMajors()
  const [major, setMajor] = useState<Major>(initializeMajor())
  const [courses, setCourses] = useState<CheckedMajorCourses>(coursesAddCheckProperty(getCourses()))
  const [classesT, setClassesT] = useState<boolean>(true)
  const [classesTP, setClassesTP] = useState<boolean>(true)
  const [isModalOpen, setIsModalOpen] = useState<boolean>(true)
  const [selected, setSelected] = useState<CourseOptions>(initializeSelected())

  useEffect(() => {
    localStorage.setItem('niaefeup-tts.major', JSON.stringify(major))
  }, [major])

  useEffect(() => {
    // FIXME: Maybe move this logic to the handle check because otherwise this has infinite renders or missing deps
    const findPreviousEntry = (course: CheckedCourse): CourseSchedule | null => {
      const value = selected.find((item) => item.course.info.course_unit_id === course.info.course_unit_id)
      return value ? value.option : null
    }

    const resolveSelected = (): CourseOptions => {
      const selectedCourses = getCheckedCourses(courses)
      return selectedCourses.map((course: CheckedCourse) => ({
        course: course,
        option: findPreviousEntry(course),
        schedules: getCourseSchedule(course),
      }))
    }

    setSelected(resolveSelected())
  }, [courses])

  useEffect(() => {
    // console.log(selected)
  }, [selected])

  return (
    <div className="grid w-full grid-cols-12 gap-x-0 gap-y-8 py-4 px-6 md:px-4 xl:gap-x-6 xl:gap-y-0">
      {/* Schedule Preview */}
      <div className="min-h-adjusted order-2 col-span-12 bg-lightest p-3 dark:bg-dark md:order-1 lg:col-span-9">
        <div className="w-full">Schedule preview content</div>
      </div>

      {/* Sidebar */}
      <div className="min-h-adjusted order-1 col-span-12 bg-lightest p-3 dark:bg-dark md:order-2 lg:col-span-3">
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
    </div>
  )
}

export default TimeTableSchedulerPage
