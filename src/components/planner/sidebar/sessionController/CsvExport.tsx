import { ArrowUpOnSquareIcon } from '@heroicons/react/24/outline'
import { CourseOption, MultipleOptions } from '../../../../@types'

type Props = {
  schedule: CourseOption[]
  multipleOptions: MultipleOptions
}

/**
 * Sidebar with all the main schedule interactions
 */
const CsvExport = ({ schedule, multipleOptions }: Props) => {
  const exportCSV = () => {
    const header = ['Ano', 'Nome', 'Sigla']
    multipleOptions.options.forEach((_, i) => header.push(`Opção ${i+1}`))
    const lines = []

    multipleOptions.selected.forEach((uc, i) => {
      const info = uc.course.info
      const line = [info.course_unit_year, info.name, info.acronym]
      multipleOptions.options.forEach((option) => line.push(option[i]?.option?.class_name || ''))
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
      title="Exportar ficheiro com todas as opções nos 10 horários"
      className="flex items-center w-full gap-2 px-2 py-2 text-sm text-gray-900 rounded-md group hover:bg-secondary hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
    >
      <ArrowUpOnSquareIcon className="w-5 h-5 text-secondary group-hover:text-white" />
      <span>Exportar Opções (CSV)</span>
    </button>
  )
}

export default CsvExport
