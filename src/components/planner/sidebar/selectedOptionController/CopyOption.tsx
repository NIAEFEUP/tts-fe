import { useState } from 'react'
import { Button } from '../../../ui/button'
import { CheckIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline'
import { CourseOption } from '../../../../@types'
import { useToast } from '../../../ui/use-toast'
import { Buffer } from 'buffer'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../ui/tooltip'

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
  const optionToString = (selectedOption: CourseOption[]) => {
    let copyOption: string = ''
    for (let i = 0; i < selectedOption.length; i++) {
      let uc_course_unit_id = selectedOption[i].course.info.course_unit_id
      copyOption += ';' + uc_course_unit_id + '#'
      if (selectedOption[i].option == null) {
        copyOption += 'null'
      } else {
        copyOption += selectedOption[i].option.class_name
      }
    }

    return Buffer.from(copyOption).toString('base64')
  }

  const copyOption = () => {
    navigator.clipboard.writeText(optionToString(currentOption))
    setIcon(true)
    toast({ title: 'Horário copiado', description: 'Podes colar o horário noutra opção ou enviar a um amigo.' })
    setTimeout(() => {
      setIcon(false)
    }, 1500)
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
