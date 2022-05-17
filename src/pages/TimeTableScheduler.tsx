import { useState } from 'react'
import classNames from 'classnames'
import { coursesData } from '../utils/data'
import { Major, MajorCourses, CheckedMajorCourses } from '../@types'
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
  const checkedCourses = coursesAddCheckProperty(coursesData)
  const [selectedCourses, setSelectedCourses] = useState<CheckedMajorCourses>(checkedCourses)

  function coursesAddCheckProperty(courses: MajorCourses): CheckedMajorCourses {
    return courses.map((year) =>
      year.map((item) => ({
        checked: false,
        info: item,
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
            checkedCourses={checkedCourses}
            openHook={[isOpen, setIsOpen]}
            selectedMajorHook={[selectedMajor, setSelectedMajor]}
            selectedCoursesHook={[selectedCourses, setSelectedCourses]}
          />
        </div>
        {selectedCourses
          .flat()
          .filter((course) => course.checked)
          .map((course, courseIdx) => (
            <div key={`selected-course-${courseIdx}`}>{course.info.acronym}</div>
          ))}
      </div>
    </div>
  )
}

export default TimeTableSchedulerPage
