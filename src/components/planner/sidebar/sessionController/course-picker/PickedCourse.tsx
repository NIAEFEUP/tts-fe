import { useContext } from 'react'
import { CourseInfo } from '../../../../../@types/new_index'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../../../ui/card'
import { Separator } from '../../../../ui/separator'
import CourseContext from '../../../../../contexts/CourseContext'
import { XMarkIcon } from '@heroicons/react/24/outline'

type Props = {
  course: CourseInfo
}

const PickedCourse = ({ course }: Props) => {
  const { pickedCourses, setPickedCourses, coursesInfo, setCoursesInfo } = useContext(CourseContext)

  const removeCourse = () => {
    console.log('Removing course')
    setPickedCourses(pickedCourses.filter((pickedCourse) => pickedCourse !== course))
  }

  return (
    <div className="group my-2 flex rounded bg-lightish p-2">
      <div className="grow text-lg font-bold">
        {course.name} <span className="text-sm font-light">({course.acronym})</span>
      </div>
      <Separator orientation="vertical" className="bg-darkish" />
      <div>{course.ects} ECTS</div>
      <XMarkIcon
        className="hidden h-6 w-6 cursor-pointer text-red-600 group-hover:block"
        onClick={() => removeCourse()}
      />
    </div>
  )
  return (
    <Card className="my-2 flex justify-between">
      <CardHeader className="flex-row gap-2 p-2">
        <CardTitle className="text-lg">{course.name}</CardTitle>
        <CardDescription>({course.acronym})</CardDescription>
      </CardHeader>
      <CardContent className="justify-self-end py-2 px-0">
        <Separator orientation="vertical" className="bg-darkish" />
      </CardContent>
      <CardFooter className="justify-self-end p-2 text-sm">
        <p>{course.ects} ECTS</p>
      </CardFooter>
    </Card>
  )
}

export default PickedCourse
