import { useContext } from 'react'
import CourseContext from '../../../../../contexts/CourseContext'
import { ScrollArea } from '../../../../ui/scroll-area'
import PickedCourse from './PickedCourse'
import { NoCourseSelectedPlaceholder } from '../../../../svgs'

const PickedCoursesList = () => {
  const { pickedCourses } = useContext(CourseContext)

  return pickedCourses.length > 0 ? (
    <ScrollArea className="h-64 w-full pr-4">
      {pickedCourses.map((course) => (
        <PickedCourse course={course} key={course.id} />
      ))}
    </ScrollArea>
  ) : (
    <div className="flex-col h-64 w-full items-center justify-center text-center text-sm dark:text-white">
      <div className='flex items-center justify-center pl-8'>
        <NoCourseSelectedPlaceholder />
      </div>
      <span>Ainda não escolheste nenhuma cadeira.</span>

    </div>
  )
}

export default PickedCoursesList
