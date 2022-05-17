import { useState } from 'react'
import classNames from 'classnames'
import { coursesData } from '../utils/data'
import { Major, MajorCourses, CheckedMajorCourses, YearCourses, Course } from '../@types'
import SelectionModal from '../components/planner/SelectionModal'

// TODO: replace majors with select all majors query
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
  //TODO: replace courseData with select all courses in selectedMajor
  const checkedCourses = coursesAddCheckProperty(coursesData)

  const [isOpen, setIsOpen] = useState(true)
  const [classesT, setClassesT] = useState(true)
  const [classesTP, setClassesTP] = useState(true)
  const [selectedMajor, setSelectedMajor] = useState('')
  const [selectedCourses, setSelectedCourses] = useState<CheckedMajorCourses>(checkedCourses)

  function coursesAddCheckProperty(courses: MajorCourses): CheckedMajorCourses {
    return courses.map((year: YearCourses) =>
      year.map((item: Course) => ({
        checked: false,
        info: item,
      }))
    )
  }

  return (
    <div className={classNames('grid w-full grid-cols-12', 'gap-x-0 gap-y-8 py-4 px-6 md:px-4 xl:gap-x-4 xl:gap-y-0')}>
      {/* Schedule Preview */}
      <div className="min-h-adjusted col-span-12 bg-lightest p-3 dark:bg-dark lg:col-span-9">
        <div className="w-full">
          Schedule preview content
        </div>
      </div>

      {/* Sidebar */}
      <div className="min-h-adjusted col-span-12 bg-lightest p-3 dark:bg-dark lg:col-span-3">
        {/* Sidebar top */}
        <div className="flex flex-col items-start justify-start space-y-2">
          <SelectionModal
            majors={majors}
            checkedCourses={checkedCourses}
            openHook={[isOpen, setIsOpen]}
            selectedMajorHook={[selectedMajor, setSelectedMajor]}
            selectedCoursesHook={[selectedCourses, setSelectedCourses]}
          />
          <ClassesTypeCheckboxes classesTPHook={[classesTP, setClassesTP]} classesTHook={[classesT, setClassesT]} />
        </div>

        {/* Dropdowns */}
        <div className="mt-2 flex flex-col space-y-2">
          {selectedCourses
            .flat()
            .filter((course) => course.checked)
            .map((course, courseIdx) => (
              <div key={`selected-course-${courseIdx}`}>
                {course.info.acronym}
              </div>
            ))}
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
      <div className="flex">
        <input
          type="checkbox"
          id="checkbox-classesT"
          className="cursor-pointer rounded text-gray-800 focus:ring-gray-800"
          checked={classesT}
          onChange={(event) => setClassesT(event.target.checked)}
        />
        <label className="ml-1.5 cursor-pointer text-sm" htmlFor="checkbox-classesTP">
          <span>Teóricas</span>
        </label>
      </div>
      <div className="flex">
        <input
          type="checkbox"
          id="checkbox-classesTP"
          className="cursor-pointer rounded text-gray-800 focus:ring-gray-800"
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
