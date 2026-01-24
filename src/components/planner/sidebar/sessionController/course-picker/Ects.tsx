import { useContext } from 'react'
import { InformationCircleIcon } from '@heroicons/react/24/solid'
import CoursePickerContext from '../../../../../contexts/coursePicker/CoursePickerContext'
import { TooltipTrigger, TooltipContent, TooltipProvider, Tooltip } from '../../../../ui/tooltip'

const Ects = () => {
  const { coursesStorage } = useContext(CoursePickerContext)
  const totalEcts = coursesStorage.reduce(
  (acc, course) => acc + parseFloat(course.ects.toString().replace(',', '.')),
  0
);
  const warning = totalEcts > 42 ? 2 : totalEcts > 36 ? 1 : 0

  return (
    <div className="mx-2 flex flex-row gap-1 items-center">
      <div className="text-sm">Total ECTS:</div>
      <div className="font-semibold text-sm">{totalEcts}</div>
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
                ? "Nós recomendamos escolher 36 ou menos ECTS."
                : "Por norma, o limite de créditos por semestre é 42 ECTS."}
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
