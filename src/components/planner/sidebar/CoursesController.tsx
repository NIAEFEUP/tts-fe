import { useContext } from 'react'
import ClassSelector from './CoursesController/ClassSelector'
import CourseContext from '../../../contexts/CourseContext'
import MultipleOptionsContext from '../../../contexts/MultipleOptionsContext'
import { TrashIcon } from "@heroicons/react/24/outline"
import { NoMajorSelectedSVG } from '../../svgs'
import { Button } from '../../ui/button'


const CoursesController = () => {
  const { pickedCourses, setUcsModalOpen } = useContext(CourseContext);
  const { multipleOptions, selectedOption, setMultipleOptions } = useContext(MultipleOptionsContext);

  const noCoursesPicked = pickedCourses.length === 0;

  const eraseClasses = () => {
    const currentOption = multipleOptions[selectedOption];
  
    const updatedCourseOptions = currentOption.course_options.map(courseOption => ({
      ...courseOption,
      picked_class_id: null,
      locked: false,
    }));
  
    const updatedMultipleOptions = [...multipleOptions];
    updatedMultipleOptions[selectedOption] = {
      ...currentOption,
      course_options: updatedCourseOptions,
    };
  
    setMultipleOptions(updatedMultipleOptions);
  };

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

      {!noCoursesPicked && (
        <div className="mt-4 flex justify-end">
          <Button
            onClick={eraseClasses}
            variant="icon"
            className="bg-lightish text-darkish gap-1.5"
          >
            <TrashIcon className="h-5 w-5" />
            <span>Limpar</span>
          </Button>
        </div>
      )}

    </div>
  )
}

export default CoursesController
