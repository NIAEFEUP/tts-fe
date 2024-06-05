import { ArrowUpOnSquareIcon } from '@heroicons/react/24/outline'
import { MultipleOptions } from '../../../../@types/new_index'
import { useContext } from 'react'
import CourseContext from '../../../../contexts/CourseContext'

type Props = {
  multipleOptions: MultipleOptions
  optionsList: any
}

const csvEncode = (text: string) => {
  return !text.includes(',') ? text : `"${text}"`
}

/**
 * Sidebar with all the main schedule interactions
 */
const CsvExport = ({ multipleOptions, optionsList }: Props) => {
  const { pickedCourses } = useContext(CourseContext);

  const exportCSV = () => {
    const header = ['Ano', 'Nome', 'Sigla']
    optionsList.forEach((pickedOption) => header.push(pickedOption.name))
    const lines = []

    console.log(multipleOptions)
    pickedCourses.forEach(course => {
      const line = [course.course_unit_year, csvEncode(course.name), course.acronym]
      optionsList.forEach(pickedOption => {
        // const fullOption = multipleOptions.options[option.id - 1]
        // line.push(fullOption[i]?.option?.class_name || '')
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
      className="group flex w-full items-center gap-2 rounded-md p-1 text-sm text-gray-900 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <ArrowUpOnSquareIcon className="h-5 w-5 text-secondary" />
      <span>Exportar Opções (CSV)</span>
    </button>
  )
}

export default CsvExport
