import { useContext } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { CourseInfo } from '../../../../../@types'
import CoursePickerContext from '../../../../../contexts/coursePicker/CoursePickerContext'
import MultipleOptionsContext from '../../../../../contexts/MultipleOptionsContext'
import { removeCourseOption } from '../../../../../utils'

type Props = {
  course: CourseInfo
}

const PickedCourse = ({ course }: Props) => {
  const { checkboxedCourses, setCheckboxedCourses } = useContext(CoursePickerContext)
  const { setMultipleOptions, multipleOptions } = useContext(MultipleOptionsContext)

  const removeCourse = () => {
    setMultipleOptions(removeCourseOption(course, multipleOptions))
    setCheckboxedCourses(checkboxedCourses.filter((pickedCourse) => pickedCourse.id !== course.id))
  }

  return (
    <div className="bg-lightish flex h-full grow items-center justify-between gap-2 rounded-md p-2 px-3">
      <span className="w-5 self-start text-center align-top text-sm font-light">{course.ects}</span>
      <div className="max-w-5/6 grow text-sm font-medium leading-tight">
        {course.name} <span className="w-full text-sm font-light">({course.acronym})</span>
      </div>
      <XMarkIcon className="w-5 justify-end self-center hover:cursor-pointer hover:opacity-70" onClick={removeCourse} />
    </div>
  )
}

export default PickedCourse
