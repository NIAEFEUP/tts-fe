import { useContext } from 'react'
import ClassSelector from './CoursesController/ClassSelector'
import CourseContext from '../../../contexts/CourseContext'
import { NoMajorSelectedSVG } from '../../svgs'
import { Button } from '../../ui/button'


const CoursesController = () => {
  const { pickedCourses, setUcsModalOpen } = useContext(CourseContext);

  const noCoursesPicked = pickedCourses.length === 0;
  return (
    <div data-testid="courses-controller" className={`flex ${noCoursesPicked ? 'h-max justify-center' : ''} w-full flex-col gap-4 px-0 py-2`}>
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
