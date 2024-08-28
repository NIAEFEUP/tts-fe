import { useContext, useState } from 'react';
import { ArrowPathIcon } from '@heroicons/react/24/solid';
import BackendAPI from '../../../../api/backend';
import StorageAPI from '../../../../api/storage';
import { Button } from '../../../ui/button';
import CourseContext from '../../../../contexts/CourseContext';
import useVerifyCourseUnitHashes from '../../../../hooks/useVerifyCourseUnitHashes';
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '../../../ui/tooltip';
import { useToast } from '../../../ui/use-toast';

const Refresh = () => {
  const { pickedCourses, setPickedCourses } = useContext(CourseContext);
  const { mismatchedMap } = useVerifyCourseUnitHashes(pickedCourses);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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

      toast({
        title: 'Informação atualizada',
        description: 'A informação das UCs foi atualizada com sucesso!',
        position: 'top-right',
      });
    }
    setIsLoading(false);
  };

  if (mismatchedMap.size === 0) {
    return null;
  }

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="relative group">
            <Button
              variant="icon"
              className="bg-emerald-800 relative"
              onClick={updateCourses}
              disabled={isLoading}
            >
              <span className="absolute -top-1 -right-1 block h-3 w-3 rounded-full bg-red-600 border border-white"></span>
              <ArrowPathIcon
                className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`}
              />
            </Button>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          Existem informações desatualizadas, clica aqui para atualizares.
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default Refresh;
