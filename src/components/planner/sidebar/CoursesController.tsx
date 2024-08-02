import { useContext } from 'react'
import ClassSelector from './CoursesController/ClassSelector'
import CourseContext from '../../../contexts/CourseContext'
import { NoMajorSelectedSVG } from '../../svgs'

const CoursesController = () => {
  const { pickedCourses } = useContext(CourseContext)

  const noCoursesPicked = pickedCourses.length === 0

  return (
    <div className={`flex ${noCoursesPicked ? 'h-max justify-center' : ''} w-full flex-col gap-4 px-0 py-2`}>
      {noCoursesPicked ? (
        <NoMajorSelectedSVG className="my-20 h-40 w-full" />
      ) : (
        pickedCourses
          .sort((course1, course2) => course1.id - course2.id) // Same order as Sigarra
          .map((course, courseIdx) => (
            <ClassSelector course={course} key={`course-schedule-${courseIdx}-${course.id}`} />
          ))
      )}
    </div>
  )
}

export default CoursesController
