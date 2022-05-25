import { useState, useEffect, Fragment } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { SelectorIcon, CheckIcon } from '@heroicons/react/solid'
import { CourseOption, CourseOptions, CourseSchedule } from '../../@types'
import { convertHour, convertWeekday } from '../../utils'

type Props = {
  courseOption: CourseOption
  selectedHook: [CourseOptions, React.Dispatch<React.SetStateAction<CourseOptions>>]
}

const ScheduleListbox = ({ courseOption, selectedHook }: Props) => {
  const createAdaptedSchedules = () => {
    return [null, courseOption.schedules]
      .flat()
      .filter((option: CourseSchedule | null) => null || option?.class_name !== null)
  }

  const getOptionDisplayText = (option: CourseSchedule | null) => {
    if (option === null || !option.course_unit_id) return <>&nbsp;</>
    return `${option.class_name}, ${option.teacher_acronym}, ${convertWeekday(option.day)}, ${convertHour(option.start_time)}-${convertHour(option.start_time + option.duration)}` //prettier-ignore
  }

  const getStorage = () => {
    const showClasses = JSON.parse(localStorage.getItem('niaefeup-tts.shown-classes'))

    if (showClasses === null) {
      let item = []
      putStorage(item)
      return item
    } else return showClasses
  }

  const putStorage = (item: any) => {
    localStorage.setItem('niaefeup-tts.shown-classes', JSON.stringify(item))
  }

  const initCheckbox = (type: 't' | 'tp') => {
    const key = type + '-' + courseOption.course.info.acronym
    const value = getStorage()[key]

    return value ? value : true
  }

  const updateStorage = (type: 't' | 'tp', value: boolean): void => {
    // FIXME: move local storage logic to hook
    // const key = type + '-' + courseOption.course.info.acronym
    // let storageState = getStorage()
    // storageState[key] = value

    if (type === 't') {
      setClassesT(value)
      // putStorage(storageState)
    } else if (type === 'tp') {
      setClassesTP(value)
      // putStorage(storageState)
    }
  }

  const adaptedSchedules = createAdaptedSchedules()
  const [, setSelected] = selectedHook
  const [selectedOption, setSelectedOption] = useState<CourseSchedule | null>(null)
  const [classesT, setClassesT] = useState<boolean>(initCheckbox('t'))
  const [classesTP, setClassesTP] = useState<boolean>(initCheckbox('tp'))

  useEffect(() => {
    setSelectedOption(null)
  }, [courseOption])

  useEffect(() => {
    const resolveSelected = (prevSelected: CourseOptions) => {
      let newSelected = prevSelected
      prevSelected.forEach((option, optionIdx) => {
        if (option === courseOption) {
          newSelected[optionIdx].option = selectedOption
        }
      })
      return newSelected
    }

    setSelected((prevSelected) => [...resolveSelected(prevSelected)])
  }, [selectedOption, courseOption, setSelected])

  return adaptedSchedules ? (
    <Listbox
      value={selectedOption}
      onChange={(value) => (value.course_unit_id ? setSelectedOption(value) : setSelectedOption(null))}
    >
      <div className="relative">
        <h4 className="mb-1 text-sm md:text-xs">
          {courseOption.course.info.name} (<strong>{courseOption.course.info.acronym}</strong>)
        </h4>
        <Listbox.Button
          className="relative w-full cursor-pointer rounded-lg border-2 border-transparent bg-lightish py-2 pl-3 pr-10 
          text-left transition hover:bg-primary/25 dark:bg-darkish dark:shadow dark:hover:bg-primary/50 sm:text-sm"
        >
          <span className="block truncate font-medium">{getOptionDisplayText(selectedOption)}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </span>
        </Listbox.Button>
        <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
          <Listbox.Options className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-lightest py-1 text-base dark:bg-darkish sm:text-sm">
            {adaptedSchedules.map((option, personIdx) => (
              <Listbox.Option
                key={personIdx}
                value={option === null ? <>&nbsp;</> : option}
                className={({ active }) =>
                  `group relative cursor-default select-none py-2 ${selectedOption !== null ? 'pl-10' : 'pl-4'} pr-4 ${
                    active ? 'bg-primary/75 text-white dark:bg-primary/75' : 'text-gray-900'
                  }`
                }
              >
                {({ selected, active }) => (
                  <>
                    <span className={`block truncate dark:text-white ${selected ? 'font-medium' : 'font-normal'}`}>
                      {getOptionDisplayText(option)}
                    </span>
                    {selected ? (
                      <span
                        className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                          active ? 'text-white' : 'text-primary dark:text-white'
                        }`}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>

        {/* Show/Hide Checkboxes */}
        <div className="mt-1 flex items-center justify-start space-x-4">
          <div className="flex items-center justify-center space-x-1">
            <input
              type="checkbox"
              id={`checkbox-classes-t-${courseOption.course.info.acronym}`}
              className="checkbox-small"
              checked={classesT}
              onChange={(event) => updateStorage('t', event.target.checked)}
            />
            <label
              className="cursor-pointer text-xs font-medium capitalize tracking-tight"
              htmlFor={`checkbox-classes-t-${courseOption.course.info.acronym}`}
            >
              <span>Teóricas</span>
            </label>
          </div>
          <div className="flex items-center justify-center space-x-1">
            <input
              type="checkbox"
              id={`checkbox-classes-tp-${courseOption.course.info.acronym}`}
              className="checkbox-small"
              checked={classesTP}
              onChange={(event) => updateStorage('tp', event.target.checked)}
            />
            <label
              className="cursor-pointer text-xs font-medium capitalize tracking-tight"
              htmlFor={`checkbox-classes-tp-${courseOption.course.info.acronym}`}
            >
              <span>Práticas</span>
            </label>
          </div>
        </div>
      </div>
    </Listbox>
  ) : null
}

export default ScheduleListbox
