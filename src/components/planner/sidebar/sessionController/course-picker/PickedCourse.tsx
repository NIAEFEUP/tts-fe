import { useContext } from 'react'
import CourseContext from '../../../../../contexts/CourseContext'
import { CourseInfo } from '../../../../../@types/new_index'
import { Separator } from '../../../../ui/separator'
import { Button } from '../../../../ui/button'
import { XMarkIcon } from '@heroicons/react/24/solid'

type Props = {
  course: CourseInfo
}

const PickedCourse = ({ course }: Props) => {
  const { pickedCourses, setPickedCourses } = useContext(CourseContext)

  const removeCourse = () => {
    setPickedCourses(pickedCourses.filter((pickedCourse) => pickedCourse !== course))
  }

  return (
    <div className="flex items-stretch justify-between gap-2">
      <div className="my-2 flex h-full grow items-center justify-between rounded bg-lightish p-2">
        <span className="">{course.ects}</span>
        <Separator orientation="vertical" className="mx-2" />
        <div className="grow text-lg font-bold">
          {course.name} <span className="w-full text-sm font-light">({course.acronym})</span>
        </div>
      </div>
      <Button variant="icon" onClick={removeCourse} className="my-2 h-auto bg-lightish">
        <XMarkIcon className="h-5 w-5 text-primary" />
      </Button>
    </div>
  )
}

export default PickedCourse
