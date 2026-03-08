import { useState } from 'react'
import { Button } from '../../../ui/new/newButton'
import { Check, Files } from 'lucide-react'
import { useToast } from '../../../ui/use-toast'
import { Buffer } from 'buffer'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../ui/tooltip'
import { CourseOption } from '../../../../@types'
import { AnalyticsTracker, Feature } from '../../../../utils/AnalyticsTracker'

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

  //TODO (thePeras): Add link here
  const optionToString = (selectedOption: CourseOption[]) => {
    if (selectedOption.filter((course) => !course.picked_class_id).length === selectedOption.length) return ''

    const copyOption = selectedOption
      .map((element) => {
        return element.course_id + '#' + element.picked_class_id
      })
      .join(';')

    return Buffer.from(copyOption).toString('base64')
  }

  const copyOption = () => {
    const scheduleHash = optionToString(currentOption)
    navigator.clipboard.writeText(scheduleHash)
    setIcon(true)

    if (scheduleHash === '') {
      toast({ title: 'Horário não copiado', description: 'Não tens nenhuma aula selecionada para copiar.' })
    } else {
      toast({ title: 'Horário copiado', description: 'Podes colar o horário noutra opção ou enviar a um amigo.' })
    }
    setTimeout(() => {
      setIcon(false)
    }, 1500)
    AnalyticsTracker.trackFeature(Feature.COPY)
  }

  return (
    <TooltipProvider delayDuration={300}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button size="sm" square className="bg-primary hover:bg-primary/90" onClick={() => copyOption()}>
            {icon ? <Check size="18" /> : <Files size="18" />}
          </Button>
        </TooltipTrigger>
        <TooltipContent>Copiar horário</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default CopyOption
