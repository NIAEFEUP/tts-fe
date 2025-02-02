import { ArrowUpOnSquareIcon } from '@heroicons/react/24/outline'
import { useContext, useEffect } from 'react'
import CourseContext from '../../../../contexts/CourseContext'
import MultipleOptionsContext from '../../../../contexts/MultipleOptionsContext'
import { AnalyticsTracker, Feature } from '../../../../utils/AnalyticsTracker'
import { csvEncode } from '../../../../utils/io'


/**
 * Sidebar with all the main schedule interactions
 */
const CsvExport = () => {
  const { pickedCourses } = useContext(CourseContext);
  const { multipleOptions } = useContext(MultipleOptionsContext);

  const GET_NAMES = true;
  const GET_IDS = false;

  const getOptions = (getByName: boolean): string[] => {
    return pickedCourses.map(course => {

      const line = getByName
        ? [course.course_unit_year, csvEncode(course.name), course.acronym]
        : [course.id];
  
      multipleOptions.forEach(option => {
        const courseOption = option.course_options.find(co => co.course_id === course.id);
        const pickedClass = courseOption
          ? course.classes.find(c => c.id === courseOption.picked_class_id)
          : undefined;
  
        const value = getByName ? pickedClass?.name : pickedClass?.id?.toString();
        line.push(csvEncode(value || ''));
      });
  
      return line.join(',');
    });
  };

  const exportCSV = () => {
    const header = ['Ano', 'Nome', 'Sigla']
    multipleOptions.forEach((option) => header.push(option.name))
    header.push(pickedCourses.length.toString())

    const lines = getOptions(GET_NAMES);

    lines.push("////----////----////----////----////----////----////")

    const header_ids = ['UC_ID']
    multipleOptions.forEach((option) => header_ids.push(option.name + "_ID"))

    const lines_id = getOptions(GET_IDS);

    const csv = [header.join(','), lines.flat().join('\n'), header_ids.join(','), lines_id.flat().join('\n')].join('\n')
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
