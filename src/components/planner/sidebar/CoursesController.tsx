import { useContext, useEffect } from 'react'
import ClassSelector from './CoursesController/ClassSelector'
import CourseContext from '../../../contexts/CourseContext'
import { NoMajorSelectedSVG } from '../../svgs'
import useVerifyCourseUnitHashes from '../../../hooks/useVerifyCourseUnitHashes'
import BackendAPI from '../../../api/backend'
import StorageAPI from '../../../api/storage'
import { Button } from '../../ui/button'


const CoursesController = () => {
  const { pickedCourses, setPickedCourses,setUcsModalOpen } = useContext(CourseContext);

  const noCoursesPicked = pickedCourses.length === 0;
  const { mismatchedMap, error } = useVerifyCourseUnitHashes(pickedCourses);

  const updateCourses = async () => {
    if (mismatchedMap.size > 0) {
      const coursesToUpdate = pickedCourses.filter((course) =>
        mismatchedMap.has(course.id)
      );
      const updatedCoursesWithClasses = await Promise.all(
        coursesToUpdate.map(async (course) => {
          const updatedClasses = await BackendAPI.getCourseClass(course);
          return {
            ...course,
            hash: mismatchedMap.get(course.id) as string,
            classes: updatedClasses,
          };
        })
      );
      const finalCourses = pickedCourses.map((course) =>
        mismatchedMap.has(course.id)
          ? updatedCoursesWithClasses.find(
              (updated) => updated.id === course.id
            ) || course
          : course
      );
      StorageAPI.setPickedCoursesStorage(finalCourses);
      setPickedCourses(finalCourses);
      mismatchedMap.clear();
    }
  };

  useEffect(() => {
    if (!noCoursesPicked) {
      updateCourses();
    }
  }, [mismatchedMap, pickedCourses, setPickedCourses]);

  return (
    <div className={`flex ${noCoursesPicked ? 'h-max justify-center' : ''} w-full flex-col gap-4 px-0 py-2`}>
      {noCoursesPicked ? (
        <div className="my-20 w-full flex flex-col items-center gap-3 justify-center mt-5">
          <NoMajorSelectedSVG className="h-32" />
          <div className="text-center text-md">
            Ainda sem nenhuma unidade curricular selecionada
          </div>
          <Button variant="icon" className="flex-grow gap-2 bg-primary" title="Selecionar Unidades Curriculares" onClick={() => setUcsModalOpen(true)}>
            <span>Selecionar</span>
          </Button>
        </div>
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
