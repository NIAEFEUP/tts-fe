import { useContext } from 'react'
import CourseContext from '../../../../../contexts/CourseContext'
import { ScrollArea } from '../../../../ui/scroll-area'
import PickedCourse from './PickedCourse'
import { NoCourseSelected } from '../../../../svgs'

const PickedCoursesList = () => {
  const { pickedCourses } = useContext(CourseContext)

  return pickedCourses.length > 0 ? (
    <ScrollArea className="h-64 w-full pr-4">
      {pickedCourses.map((course) => (
        <PickedCourse course={course} key={course.id} />
      ))}
    </ScrollArea>
  ) : (
    <div className="flex h-64 items-center justify-center">
      <NoCourseSelected />
    </div>
  )
}

export default PickedCoursesList
