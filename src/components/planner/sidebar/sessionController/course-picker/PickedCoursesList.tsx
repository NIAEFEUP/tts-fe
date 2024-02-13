import { useContext } from 'react'
import CourseContext from '../../../../../contexts/CourseContext'
import { ScrollArea } from '../../../../ui/scroll-area'
import PickedCourse from './PickedCourse'

const PickedCoursesList = () => {
  const { pickedCourses, setPickedCourses, coursesInfo, setCoursesInfo } = useContext(CourseContext)

  return (
    <ScrollArea className="h-[300px]">
      {pickedCourses.map((course) => (
        <PickedCourse course={course} key={course.id} />
      ))}
    </ScrollArea>
  )
}

export default PickedCoursesList
