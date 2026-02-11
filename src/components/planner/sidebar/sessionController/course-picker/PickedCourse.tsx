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
    <div className="flex w-full gap-2 items-start rounded-md bg-lightish p-2 px-3 justify-between">
      <span className="font-light align-top self-start text-sm w-5 text-center shrink-0">{course.ects}</span>
      <div className="grow text-sm font-medium leading-tight min-w-0 break-words">
        {course.name} <span className="text-sm font-light">({course.acronym})</span>
      </div>
      <XMarkIcon className="w-5 shrink-0 hover:cursor-pointer hover:opacity-70 self-start justify-end" onClick={removeCourse} />
    </div>
  )
}

export default PickedCourse
