import { useContext } from 'react'
import CourseContext from '../../../../../contexts/CourseContext'
import { CourseInfo } from '../../../../../@types/new_index'
import { Separator } from '../../../../ui/separator'
import { XMarkIcon } from '@heroicons/react/24/outline'

type Props = {
  course: CourseInfo
}

const PickedCourse = ({ course }: Props) => {
  const { pickedCourses, setPickedCourses } = useContext(CourseContext)

  const removeCourse = () => {
    setPickedCourses(pickedCourses.filter((pickedCourse) => pickedCourse !== course))
  }

  return (
    <div
      onClick={() => removeCourse()}
      className="group m-2 ml-0 mr-4 flex cursor-pointer items-center rounded bg-lightish p-2"
    >
      <div className="grow text-lg font-bold">
        {course.name} <span className="text-sm font-light">({course.acronym})</span>
      </div>
      <Separator orientation="vertical" className="mx-5" />
      <div className="text-nowrap min-w-fit">{course.ects} ECTS</div>
      <XMarkIcon className="hidden h-6 w-6 text-red-600 group-hover:block" />
    </div>
  )
}

export default PickedCourse
