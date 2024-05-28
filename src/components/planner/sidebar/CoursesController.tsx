import { useContext } from 'react'
import CourseContext from '../../../contexts/CourseContext'
import ClassSelector from './CoursesController/ClassSelector'
import { NoMajorSelected } from '../../svgs'

const CoursesController = ({ multilpleOptionsHook, isImportedOptionHook }) => {
  const { pickedCourses } = useContext(CourseContext)

  console.log('pickedCourses', pickedCourses)

  const noCoursesPicked = pickedCourses.length === 0

  return (
    <div className={`flex ${noCoursesPicked ? 'h-max justify-center' : ''} w-full flex-col gap-4 px-0 py-2`}>
      {noCoursesPicked ? (
        <NoMajorSelected className="my-20 h-40 w-full" />
      ) : (
        pickedCourses
          .sort((course1, course2) => course1.id - course2.id)
          .map((course, courseIdx) => (
            <ClassSelector course={course} key={`course-schedule-${courseIdx}-${course.id}`} />
          ))
      )}
    </div>
  )
}

export default CoursesController
