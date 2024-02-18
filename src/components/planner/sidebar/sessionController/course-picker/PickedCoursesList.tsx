import { useContext } from 'react'
import CourseContext from '../../../../../contexts/CourseContext'
import { ScrollArea } from '../../../../ui/scroll-area'
import PickedCourse from './PickedCourse'
import Ects from './Ects'

const PickedCoursesList = () => {
  const { pickedCourses } = useContext(CourseContext)

  return pickedCourses.length > 0 ? (
    <div className="flex flex-col items-end gap-2">
      <ScrollArea className="h-64 w-[27.5rem]">
        {pickedCourses.map((course) => (
          <PickedCourse course={course} key={course.id} />
        ))}
      </ScrollArea>
      <Ects />
    </div>
  ) : (
    <div className="flex h-64 w-[27.5rem] items-center justify-center text-center dark:text-white">
      Ainda não escolheste nenhuma cadeira.
    </div>
  )
}

export default PickedCoursesList
