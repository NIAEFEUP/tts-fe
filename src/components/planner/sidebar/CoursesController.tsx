import { useContext } from 'react'
import CourseContext from '../../../contexts/CourseContext'
import ClassSelector from './ClassSelector'
import { NoMajorSelected } from '../../svgs'

const CoursesController = ({ multilpleOptionsHook, isImportedOptionHook }) => {
  const { pickedCourses } = useContext(CourseContext)

  console.log('pickedCourses', pickedCourses)

  return (
    <div className="flex w-full flex-col gap-4 px-0 py-2">
      {pickedCourses.length > 0 ? (
        pickedCourses
          .sort((course1, course2) => course1.id - course2.id)
          .map((course, courseIdx) => (
            <ClassSelector course={course} key={`course-schedule-${courseIdx}-${course.id}`} />
          ))
      ) : (
        <NoMajorSelected className="h-40 w-full" />
      )}
    </div>
  )
}

export default CoursesController
