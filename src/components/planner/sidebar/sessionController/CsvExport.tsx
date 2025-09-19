import { ArrowUpOnSquareIcon } from '@heroicons/react/24/outline'
import { useContext } from 'react'
import CourseContext from '../../../../contexts/CourseContext'
import MultipleOptionsContext from '../../../../contexts/MultipleOptionsContext'
import { AnalyticsTracker, Feature } from '../../../../utils/AnalyticsTracker'
import { csvEncode } from '../../../../utils/io'
import api from '../../../../api/backend'


/**
 * Sidebar with all the main schedule interactions
 */
const CsvExport = () => {
  const { pickedCourses } = useContext(CourseContext);
  const { multipleOptions } = useContext(MultipleOptionsContext);

  const getOptions = async (): Promise<string[]> => {
    const lines = [];

    for(const course of pickedCourses) {
      const baseInfo = [course.course_id, course.course_unit_year, csvEncode(course.name), course.acronym]

      const classValues = multipleOptions.map(option => {
        const courseOption = option.course_options.find(co => co.course_id === course.id);
        const pickedClass = courseOption ? 
              course.classes.find(c => c.id === courseOption.picked_class_id) : 
              undefined;

        return csvEncode(pickedClass?.name);
      });
      lines.push([...baseInfo, ...classValues].join(','));
    }

    return lines;
  }
  
  const exportCSV = async () => {
    const header = ['ID_Curso', 'Ano', 'Nome', 'Sigla']
    multipleOptions.forEach((option) => header.push(option.name));

    const lines = await getOptions();

    const csv = [header.join(','), lines.flat().join('\n')].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'schedule.csv'
    a.click()
    URL.revokeObjectURL(url)

    AnalyticsTracker.trackFeature(Feature.EXPORT_TO_CSV)
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
