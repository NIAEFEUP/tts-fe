import { useState } from 'react'
import classNames from 'classnames'
import { coursesData } from '../utils/data'
import { Major, MajorCourses, TruncatedMajorCourses } from '../@types'
import SelectionModal from '../components/planner/SelectionModal'

const majors: Major[] = [
  { name: 'Licenciatura em Engenharia Informática e Computação' },
  { name: 'Licenciatura em Engenharia Eletrotécnica e de Computadores' },
  { name: 'Licenciatura em Engenharia Civil' },
  { name: 'Licenciatura em Engenharia Mecânica' },
  { name: 'Mestrado em Engenharia Informática e Computação' },
  { name: 'Mestrado em Engenharia Eletrotécnica e de Computadores' },
  { name: 'Mestrado em Engenharia Civil' },
  { name: 'Mestrado em Engenharia Química' },
  { name: 'Mestrado em Engenharia Mecânica' },
  { name: 'Mestrado em Engenharia do Ambiente' },
  { name: 'Mestrado em Engenharia e Gestão Industrial' },
]

const TimeTableSchedulerPage = () => {
  const [isOpen, setIsOpen] = useState(true)
  const [selectedMajor, setSelectedMajor] = useState('')
  const truncatedCourses = truncateCourses(coursesData)
  const [selectedCourses, setSelectedCourses] = useState<TruncatedMajorCourses>(truncatedCourses)

  function truncateCourses(courses: MajorCourses): TruncatedMajorCourses {
    return courses.map((year) =>
      year.map(({ acronym, course_unit_id }) => ({
        checked: false,
        acronym: acronym,
        course_unit_id: course_unit_id,
      }))
    )
  }

  return (
    <div className={classNames('grid w-full grid-cols-12', 'gap-x-0 gap-y-8 py-4 px-6 md:px-4 xl:gap-x-4 xl:gap-y-0')}>
      <div className="min-h-adjusted col-span-12 bg-lightest p-2 dark:bg-dark lg:col-span-9">
        <div className="w-full"></div>
      </div>
      <div className="min-h-adjusted col-span-12 bg-lightest p-2 dark:bg-dark lg:col-span-3">
        <div className="flex items-start justify-start">
          <SelectionModal
            majors={majors}
            truncatedCourses={truncatedCourses}
            openHook={[isOpen, setIsOpen]}
            selectedMajorHook={[selectedMajor, setSelectedMajor]}
            selectedCoursesHook={[selectedCourses, setSelectedCourses]}
          />
        </div>
        {selectedCourses
          .flat()
          .filter((course) => course.checked)
          .map((course, courseIdx) => (
            <div key={`selected-course-${courseIdx}`}>{course.acronym}</div>
          ))}
      </div>
    </div>
  )
}

export default TimeTableSchedulerPage
