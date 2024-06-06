import { ArrowUpOnSquareIcon } from '@heroicons/react/24/outline'
import { MultipleOptions } from '../../../../@types/new_index'
import { useContext } from 'react'
import CourseContext from '../../../../contexts/CourseContext'

type Props = {
  multipleOptions: MultipleOptions
}

const csvEncode = (text: string | null | undefined) => {
  if (!text)
    return ''
  if (text.includes(','))
    return `"${text}"`
  return text
}

/**
 * Sidebar with all the main schedule interactions
 */
const CsvExport = ({ multipleOptions }: Props) => {
  const { pickedCourses } = useContext(CourseContext);

  const exportCSV = () => {
    const header = ['Ano', 'Nome', 'Sigla']
    multipleOptions.forEach((option) => header.push(option.name))
    const lines = []

    console.log(multipleOptions)
    pickedCourses.forEach(course => {
      const line = [course.course_unit_year, csvEncode(course.name), course.acronym]
      multipleOptions.forEach(option => {
        const courseOption = option.course_options.find(courseOption => courseOption.course_id === course.id)
        const pickedClass = course.classes.find(c => c.id === courseOption?.picked_class_id);

        line.push(csvEncode(pickedClass?.name))
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
