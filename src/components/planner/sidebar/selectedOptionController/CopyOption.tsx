import { useState } from 'react'
import { Button } from '../../../ui/button'
import { CheckIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline'
import { Major, CourseOption } from '../../../../@types'
import { useToast } from '../../../ui/use-toast'
import { Buffer } from 'buffer'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../ui/tooltip'

type Props = {
  majorHook: [Major, React.Dispatch<React.SetStateAction<Major>>]
  currentOption: CourseOption[]
  className?: string
}

/**
 * Copy currently selected option to clipboard
 */
const CopyOption = ({ majorHook, currentOption, className }: Props) => {
  const { toast } = useToast()
  const [major, setMajor] = majorHook
  const [icon, setIcon] = useState(false)

  /**
   * Function that converts schedule to string
   * @param major selected major
   * @param selectedOption current schedule
   * @returns stringified schedule
   */
  const optionToString = (major: Major, selectedOption: CourseOption[]) => {
    let copyOption: string = major.id.toString()
    let extraUCsStrs: { [id: string]: string } = {}
    for (let i = 0; i < selectedOption.length; i++) {
      let uc_course_id = selectedOption[i].course.info.course_id
      let uc_course_unit_id = selectedOption[i].course.info.course_unit_id
      if (uc_course_id === major.id) {
        copyOption += ';' + uc_course_unit_id + '#'
        if (selectedOption[i].option == null) {
          copyOption += 'null'
        } else {
          copyOption += selectedOption[i].option.class_name
        }
      } else {
        if (extraUCsStrs[uc_course_id] == null) {
          extraUCsStrs[uc_course_id] = uc_course_id + ''
        }

        extraUCsStrs[uc_course_id] += ';' + uc_course_unit_id + '#'
        if (selectedOption[i].option == null) {
          extraUCsStrs[uc_course_id] += 'null'
        } else {
          extraUCsStrs[uc_course_id] += selectedOption[i].option.class_name
        }
      }
    }

    for (let key in extraUCsStrs) {
      copyOption += '|' + extraUCsStrs[key]
    }
    return Buffer.from(copyOption).toString('base64')
  }

  const copyOption = () => {
    navigator.clipboard.writeText(optionToString(major, currentOption))
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
