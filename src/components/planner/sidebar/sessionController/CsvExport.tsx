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
    const lines = []
    const columns = []

    for (let i = 0; i < multipleOptions.options.length; i++) {
      if (i === 0) for (let j = 0; j < schedule.length; j++) header.push(`Option ${j}`)
      const scheduleOption = multipleOptions.options[i]
      const column = []
      for (let j = 0; j < scheduleOption.length; j++) column.push(scheduleOption[j].option?.class_name || '')
      columns.push(column)
    }

    for (let i = 0; i < columns[0].length; i++) {
      const column = columns[i]
      const info = multipleOptions.options[0][i].course.info
      const line = [info.course_unit_year, info.name, info.acronym]

      for (let j = 0; j < column.length; j++) {
        line.push(column[j])
      }
      lines.push(line.join(','))
    }

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
      onClick={() => exportCSV()}
      title="Exportar ficheiro com todas as opções nos 10 horários"
      className="group flex w-full items-center gap-2 rounded-md px-2 py-2 text-sm text-gray-900 hover:bg-secondary hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
    >
      <ArrowUpOnSquareIcon className="h-5 w-5 text-secondary group-hover:text-white" />
      <span>Exportar Opções (CSV)</span>
    </button>
  )
}

export default CsvExport
