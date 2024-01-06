import { SparklesIcon } from '@heroicons/react/outline'
import { CourseOption, CourseSchedule, MultipleOptions, ProfessorInformation } from '../../@types'

type Props = {
  courseOption: CourseOption
  multipleOptionsHook: [MultipleOptions, React.Dispatch<React.SetStateAction<MultipleOptions>>]
}

const FillButton = ({ courseOptions, multipleOptionsHook }) => {
  const [multipleOptions, setMultipleOptions] = multipleOptionsHook

  const fillWithRandomSchedule = () => {
    
    const newCourseOptions = multipleOptions.selected.map((course, i) => {
      if(course.locked) return course;
      
      let newOption = course;
      newOption.option = course.schedules[0]
      return newOption
    })
    
    let resolvedOptions = multipleOptions.options
    resolvedOptions[multipleOptions.index] = newCourseOptions

    setMultipleOptions((prevMultipleOptions) => {
      const value = {
        index: prevMultipleOptions.index,
        selected: newCourseOptions,
        options: resolvedOptions,
        names: prevMultipleOptions.names,
      }

      return value
    })
  }

  console.log(courseOptions)

  return (
    <div>
      <button
        onClick={fillWithRandomSchedule}
        title="Preencher horário aleatoriamente"
        className="inline-flex w-full items-center justify-center whitespace-nowrap rounded bg-tertiary p-2.5
                text-center text-sm font-normal text-white transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <SparklesIcon className="w-6 h-6" />
      </button>
    </div>
  )
}

export default FillButton
