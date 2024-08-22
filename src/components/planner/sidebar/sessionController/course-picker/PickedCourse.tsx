import { useContext } from 'react'
import { XMarkIcon } from '@heroicons/react/24/solid'
import { CourseInfo } from '../../../../../@types'
import CourseContext from '../../../../../contexts/CourseContext'
import MultipleOptionsContext from '../../../../../contexts/MultipleOptionsContext'
import { removeCourseOption } from '../../../../../utils'
import { Button } from '../../../../ui/button'
import { Separator } from '../../../../ui/separator'

type Props = {
  course: CourseInfo
}

const PickedCourse = ({ course }: Props) => {
  const { checkboxedCourses, setCheckboxedCourses } = useContext(CourseContext)
  const { setMultipleOptions, multipleOptions } = useContext(MultipleOptionsContext)

  const removeCourse = () => {
    setMultipleOptions(removeCourseOption(course, multipleOptions))
    setCheckboxedCourses(checkboxedCourses.filter((pickedCourse) => pickedCourse.id !== course.id))
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
