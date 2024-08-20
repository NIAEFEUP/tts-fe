import { useContext, useEffect } from 'react'
import ClassSelector from './CoursesController/ClassSelector'
import CourseContext from '../../../contexts/CourseContext'
import { NoMajorSelectedSVG } from '../../svgs'
import useVerifyCourseUnitHashes from '../../../hooks/useVerifyCourseUnitHashes'
import BackendAPI from '../../../api/backend'
import StorageAPI from '../../../api/storage'


const CoursesController = () => {
  const { pickedCourses , setPickedCourses} = useContext(CourseContext)

  const noCoursesPicked = pickedCourses.length === 0
  const { mismatchedIds, error } = useVerifyCourseUnitHashes(pickedCourses);
  useEffect(() => {
    const updateCourses = async () => {
      if (mismatchedIds.size > 0) {
        console.log('Invalid courses detected:', mismatchedIds);

        const updatedCourses = await Promise.all(
          pickedCourses.map(async (course) => {
            if (mismatchedIds.has(course.id)) {
              const updatedCourse = await BackendAPI.getCourseUnit(course.id);
              const updatedCoursesWithClasses = await BackendAPI.getCoursesClasses([updatedCourse]);
              return updatedCoursesWithClasses[0]; // Assuming getCoursesClasses returns an array
            }
            return course; // Return the original course if it's valid
          })
        );

        setPickedCourses(updatedCourses);
        StorageAPI.setPickedCoursesStorage(updatedCourses);
      }
    };

    updateCourses();
  }, [mismatchedIds]);


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
