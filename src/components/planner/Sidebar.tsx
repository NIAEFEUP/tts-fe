import { useState, useEffect, useContext } from 'react'
import { CheckedCourse, MultipleOptions } from '../../@types'
import SessionController from './sidebar/SessionController'
import OptionsController from './sidebar/OptionsController'
import SelectedOptionController from './sidebar/SelectedOptionController'
import CoursesController from './sidebar/CoursesController'
import MultipleOptionsContext from '../../contexts/MultipleOptionsContext'

type Props = {
  coursesHook: [CheckedCourse[][], React.Dispatch<React.SetStateAction<CheckedCourse[][]>>]
  sourceBufferHook: [CheckedCourse[][], React.Dispatch<React.SetStateAction<CheckedCourse[][]>>]
  destBufferHook: [CheckedCourse[][], React.Dispatch<React.SetStateAction<CheckedCourse[][]>>]
  repeatedCourseControlHook: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
  multipleOptionsHook: [MultipleOptions, React.Dispatch<React.SetStateAction<MultipleOptions>>]
}

const defaultOptionsList = [
  {
    id: 1,
    icon: 'https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f60e.png',
    name: 'Horário 1',
  },
  {
    id: 2,
    icon: 'https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f929.png',
    name: 'Horário 2',
  },
  {
    id: 3,
    icon: 'https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f973.png',
    name: 'Horário 3',
  },
  {
    id: 4,
    icon: 'https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f9d0.png',
    name: 'Horário 4',
  },
  {
    id: 5,
    icon: 'https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f525.png',
    name: 'Horário 5',
  },
  {
    id: 6,
    icon: 'https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f483.png',
    name: 'Horário 6',
  },
  {
    id: 7,
    icon: 'https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f976.png',
    name: 'Horário 7',
  },
  {
    id: 8,
    icon: 'https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f47b.png',
    name: 'Horário 8',
  },
  {
    id: 9,
    icon: 'https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1f425.png',
    name: 'Horário 9',
  },
  {
    id: 10,
    icon: 'https://cdn.jsdelivr.net/npm/emoji-datasource-apple/img/apple/64/1fae1.png',
    name: 'Horário 10',
  },
]

/**
 * Sidebar with all the main schedule interactions
 */
const Sidebar = ({ /*multipleOptionsHook */}: Props) => {
  const [isImportedOption, setImportedOption] = useState<boolean>(false)
  const { multipleOptions, setMultipleOptions, selectedOption, setSelectedOption } = useContext(MultipleOptionsContext);

  //TODO: Type for optionsList
  const [optionsList, setOptionsList] = useState(
    () => JSON.parse(localStorage.getItem('niaefeup-tts.optionsList')) || defaultOptionsList
  )

  /*const [selectedOption, setSelectedOption] = useState(() =>
    localStorage.getItem('niaefeup-tts.selected-option')
      ? parseInt(localStorage.getItem('niaefeup-tts.selected-option'))
      : 0
  )*/

  useEffect(() => {
    localStorage.setItem('niaefeup-tts.optionsList', JSON.stringify(optionsList))
  }, [optionsList])

  useEffect(() => {
    localStorage.setItem('niaefeup-tts.selected-option', selectedOption.toString())
  }, [selectedOption])

  return (
    <div className="lg:min-h-adjusted order-2 col-span-12 flex min-h-min flex-col justify-between rounded bg-lightest px-3 py-3 dark:bg-dark lg:col-span-3 2xl:px-4 2xl:py-4">
      <div className="space-y-2">
        <div className="relative flex flex-row flex-wrap items-center justify-center gap-x-2 gap-y-2 lg:justify-start">
          <SessionController optionsList={optionsList} />
          <OptionsController
            optionsListHook={[optionsList, setOptionsList]}
            selectedOptionHook={[selectedOption, setSelectedOption]}
          />
          <SelectedOptionController
            optionsListHook={[optionsList, setOptionsList]}
            selectedOptionHook={[selectedOption, setSelectedOption]}
            currentOption={multipleOptions[selectedOption].course_options}
            isImportedOptionHook={[isImportedOption, setImportedOption]}
          />
          <CoursesController/>
        </div>
      </div>
    </div>
  )
}

export default Sidebar
