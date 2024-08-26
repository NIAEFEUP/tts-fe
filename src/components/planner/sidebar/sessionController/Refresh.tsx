import { useContext, useState } from 'react';
import { ArrowPathIcon } from '@heroicons/react/24/solid';
import BackendAPI from '../../../../api/backend';
import StorageAPI from '../../../../api/storage';
import { Button } from '../../../ui/button';
import CourseContext from '../../../../contexts/CourseContext';
import useVerifyCourseUnitHashes from '../../../../hooks/useVerifyCourseUnitHashes';
import { useWarning } from '../../../../contexts/WarningContext';

const Refresh = () => {
  const { pickedCourses, setPickedCourses } = useContext(CourseContext);
  const { mismatchedMap } = useVerifyCourseUnitHashes(pickedCourses);
  const [isLoading, setIsLoading] = useState(false);
  const { setIsWarningVisible } = useWarning();
  if (mismatchedMap.size !==0) {
    setIsWarningVisible(true);
  }

  const updateCourses = async () => {
    setIsLoading(true);
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
    setIsLoading(false);
    setIsWarningVisible(false);
  };

  return (
    <Button
      variant="icon"
      className="bg-emerald-800"
      onClick={updateCourses}
      disabled={isLoading || mismatchedMap.size === 0}
    >
      <ArrowPathIcon
        className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`}
      />
    </Button>
  );
};

export default Refresh;
