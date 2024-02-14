import { useContext, useEffect } from 'react'
import CourseContext from '../../../../../contexts/CourseContext'
import { ScrollArea } from '../../../../ui/scroll-area'
import PickedCourse from './PickedCourse'

const PickedCoursesList = () => {
  const { pickedCourses, setPickedCourses, coursesInfo, setCoursesInfo } = useContext(CourseContext)

  return pickedCourses.length > 0 ? (
    <ScrollArea className="h-64 w-[27.5rem]">
      {pickedCourses.map((course) => (
        <PickedCourse course={course} key={course.id} />
      ))}
    </ScrollArea>
  ) : (
    <div className="flex h-64 w-[27.5rem] items-center justify-center text-center dark:text-white">
      Ainda não escolheste nenhuma cadeira.
    </div>
  )
}

export default PickedCoursesList
