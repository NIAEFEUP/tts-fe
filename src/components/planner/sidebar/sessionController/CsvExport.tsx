import { ArrowUpOnSquareIcon } from '@heroicons/react/24/outline'
import { MultipleOptions } from '../../../../@types'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../ui/tooltip'

type Props = {
  multipleOptions: MultipleOptions
  optionsList: any
}

/**
 * Sidebar with all the main schedule interactions
 */
const CsvExport = ({ multipleOptions, optionsList }: Props) => {
  const exportCSV = () => {
    const header = ['Ano', 'Nome', 'Sigla']
    optionsList.forEach((option) => header.push(option.name))
    const lines = []

    multipleOptions.selected.forEach((uc, i) => {
      const info = uc.course.info
      const line = [info.course_unit_year, info.name, info.acronym]
      optionsList.forEach((option) => {
        const fullOption = multipleOptions.options[option.id - 1]
        line.push(fullOption[i]?.option?.class_name || '')
      })
      lines.push(line.join(','))
    })

    const csv = [header.join(','), lines.flat().join('\n')].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'schedule.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <button
      onClick={exportCSV}
      className="group flex w-full items-center gap-2n dark:text-white rounded-md p-1 text-gray text-sm  disabled:cursor-not-allowed disabled:opacity-50"
    >
      <ArrowUpOnSquareIcon className="h-5 w-5 text-secondary black:hover:brightness-200" />
      <span className="pl-1"> Exportar Opções (CSV)</span>
    </button> 
  )
}

export default CsvExport
