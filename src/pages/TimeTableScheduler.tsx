import * as backendAPI from '../backend'
import { useState, useEffect, useMemo } from 'react'
import { useCourses, useMajor, useShowGrid } from '../hooks'
import { CheckedCourse, CheckedMajorCourses, Course, CourseOptions, Major, MajorCourses, YearCourses } from '../@types'
import {
  Schedule,
  SelectionModal,
  ScheduleListbox,
  ClassesTypeCheckboxes,
  ExportSchedule,
  TidySchedule,
} from '../components/planner'
import { ScheduleColorLabels } from '../components/planner/schedules'
import classNames from 'classnames'

const TimeTableSchedulerPage = () => {

  /**
   * Adds the checked and info property to the major courses.
   * @param majorCourses Courses in a major grouped by year. 
   * @returns MajorCourses with the checked and info properties. 
   */
  const majorCourses2CheckedMajor = (majorCourses: MajorCourses): CheckedMajorCourses => {
    return majorCourses.map((year: YearCourses) =>
      year.map((item: Course) => ({
        checked: false,
        info: item,
      }))
    )
  }

  /**
   * Considering that the yearCourses is sorted by the course_year field in ascending order, the function groups the major courses by year. 
   * @param yearCourses All the courses in a major. 
   * @returns The courses grouped by year. 
   * For examples: 
   * [{course:1, year:1}, {course:3, year:1 }, {course:2, year:2}]
   * Returns:
   * [[{course:1, year:1}, {course:3, year:1}], [{course:2, year:2}]]
   */
  const groupMajorCoursesByYear = (yearCourses: YearCourses): MajorCourses => {
    let majorCourses: MajorCourses = [];
    let currYear = 0;
    for (let i = 0; i < yearCourses.length; i++) {
      if (yearCourses[i].course_year !== currYear) {
        currYear += 1;
        majorCourses.push([yearCourses[i]]);
      } else {
        majorCourses[currYear - 1].push(yearCourses[i])
      }
    }
    console.log(majorCourses)
    return majorCourses

  }


  const getCheckedCourses = (courses: CheckedMajorCourses): CheckedCourse[] => {
    return courses.flat().filter((course) => course.checked)
  }


  const initializeSelected = (): CourseOptions => {
    const selectedCourses = getCheckedCourses(courses)
    return selectedCourses.map((course: CheckedCourse) => ({
      course: course,
      option: null,
      schedules: backendAPI.getCourseSchedule(course),
    }))
  }



  // FIXME: Possible overhaul: split all data variables from UI variables. Data variables would be wrapped in useMemo.
  const [majorLS, setMajorLS] = useMajor()
  const [coursesLS] = useCourses()
  const [showGrid, setShowGrid] = useShowGrid()
  const [major, setMajor] = useState<Major>(null)
  const [courses, setCourses] = useState<CheckedMajorCourses>([])
  const [classesT, setClassesT] = useState<boolean>(true)
  const [classesTP, setClassesTP] = useState<boolean>(true)
  const [selected, setSelected] = useState<CourseOptions>(() => initializeSelected())
  const [isModalOpen, setIsModalOpen] = useState<boolean>(() => !major || selected.length === 0)


  useEffect(() => {
    backendAPI.getMajors().then(function (result) {
      setMajorLS(result)
    });
  }, []);

  useEffect(() => {
    backendAPI.getCourses(major).then(function (courses) {
      const majorCourses: MajorCourses = groupMajorCoursesByYear(courses);
      const checkedMajorCourses: CheckedMajorCourses = majorCourses2CheckedMajor(majorCourses)
      setCourses(checkedMajorCourses)
    })
  }, [major])


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
    <div className="grid w-full grid-cols-12 gap-x-4 gap-y-4 py-4 px-4">
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
      <div
        className="lg:min-h-adjusted order-2 col-span-12 flex min-h-min flex-col justify-between 
        rounded bg-lightest px-3 py-3 dark:bg-dark lg:col-span-3 2xl:px-4 2xl:py-4"
      >
        <div className="space-y-2">
          <div className="flex flex-col flex-wrap items-center justify-start gap-3 xl:flex-row">
            <SelectionModal
              majors={majorLS}
              openHook={[isModalOpen, setIsModalOpen]}
              majorHook={[major, setMajor]}
              coursesHook={[courses, setCourses]}
            />
            <ExportSchedule schedule={selected} />
            <TidySchedule showGridHook={[showGrid, setShowGrid]} />
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
        <ScheduleColorLabels />
      </div>
    </div>
  )
}

export default TimeTableSchedulerPage
