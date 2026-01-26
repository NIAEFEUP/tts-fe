import { useState } from 'react'
import { Button } from '../../../ui/button'
import { CheckIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline'
import { useToast } from '../../../ui/use-toast'
import { Buffer } from 'buffer'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../ui/tooltip'
import { CourseInfo, CourseOption } from '../../../../@types'
import { AnalyticsTracker, Feature } from '../../../../utils/AnalyticsTracker'
import api from '../../../../api/backend'

type Props = {
  currentOption: CourseOption[]
  className?: string
}

/**
 * Copy currently selected option to clipboard
 */
const CopyOption = ({ currentOption, className }: Props) => {
  const { toast } = useToast()
  const [icon, setIcon] = useState(false)

  /**
   * Function that converts schedule to string
   * @param selectedOption current schedule
   * @returns stringified schedule
   */
  const optionToString = async (selectedOption: CourseOption[]) => {
    if (selectedOption.filter((course) => !course.picked_class_id).length === selectedOption.length) return "";

    const selectedCourses = selectedOption.map((element) => {
      return element.course_id + '#' + element.picked_class_id;
    }).join(';');

    const uc : CourseInfo = await api.getCourseUnit(Number(selectedOption.at(0).course_id))
    const majorID = uc.course

    const copyOption = majorID + ";" + selectedCourses
    return Buffer.from(copyOption).toString('base64')
  }

  const copyOption = async () => {
    const scheduleHash = await optionToString(currentOption);
    const copyLink = scheduleHash === ""
      ? ""
      : window.location.origin + `/planner?classes=${scheduleHash}`
    navigator.clipboard.writeText(copyLink);
    setIcon(true);

    if (scheduleHash === "") {
      toast({ title: 'Horário não copiado', description: 'Não tens nenhuma aula selecionada para copiar.' })
    } else {
      toast({ title: 'Horário copiado', description: 'Podes colar o horário noutra opção ou enviar a um amigo.' })
    }
    setTimeout(() => {
      setIcon(false)
    }, 1500)
    AnalyticsTracker.trackFeature(Feature.COPY);
  }

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="icon"
            className={className.concat(' h-min w-min flex-grow bg-primary')}
            onClick={() => copyOption()}
          >
            {icon ? <CheckIcon className="h-5 w-5" /> : <DocumentDuplicateIcon className="h-5 w-5" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>Copiar horário</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default CopyOption
