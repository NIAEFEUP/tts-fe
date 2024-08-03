import { useContext } from 'react'
import { InformationCircleIcon } from '@heroicons/react/24/solid'
import CourseContext from '../../../../../contexts/CourseContext'
import { TooltipTrigger, TooltipContent, TooltipProvider, Tooltip } from '../../../../ui/tooltip'

const Ects = () => {
  const { pickedCourses } = useContext(CourseContext)
  const totalEcts = pickedCourses.reduce((acc, course) => acc + course.ects, 0)
  const warning = totalEcts > 42 ? 2 : totalEcts > 36 ? 1 : 0

  return (
    <div className="mx-2 flex">
      <div className="font-bold">Total ECTS:&nbsp;</div>
      <div className="font-bold">{totalEcts}</div>
      {warning ? (
        <TooltipProvider delayDuration={300}>
          <Tooltip>
            <TooltipTrigger asChild>
              <InformationCircleIcon
                className={`ml-1 h-6 w-6 transition ${warning === 1 ? 'text-amber-500' : 'text-red-600'}`}
              />
            </TooltipTrigger>
            <TooltipContent>
              {warning === 1
                ? 'O NIAEFEUP recomenda escolher 36 ou menos ECTS.'
                : 'O limite de créditos por semestre, por norma, é 42 ECTS'}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      ) : (
        <></>
      )}
    </div>
  )
}

export default Ects
