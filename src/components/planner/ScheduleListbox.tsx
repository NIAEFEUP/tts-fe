import { useState, Fragment } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { SelectorIcon, CheckIcon } from '@heroicons/react/solid'
import { CheckedCourse, CourseSchedule, CourseSchedules } from '../../@types'

type Props = {
  course: CheckedCourse
  schedules: Array<CourseSchedule | null>
  selectedSchedulesHook: [CourseSchedules, React.Dispatch<React.SetStateAction<CourseSchedules>>]
}

const ScheduleListbox = ({ course, schedules, selectedSchedulesHook }: Props) => {
  function createAdaptedSchedules() {
    return [null, schedules].flat().filter((option: CourseSchedule | null) => null || option?.class_name !== null)
  }

  function getOptionDisplayText(acronym: string, option: CourseSchedule | null) {
    if (option === null || !option.course_unit_id) return <>&nbsp;</>
    return `${acronym} ${option.class_name} ${option.start_time} ${option.start_time + option.duration}`
  }

  const adaptedSchedules = createAdaptedSchedules()
  const [selectedSchedules, setSelectedSchedules] = selectedSchedulesHook
  const [selectedOption, setSelectedOption] = useState(adaptedSchedules[0])

  console.log(selectedOption)

  return schedules ? (
    <Listbox
      value={selectedOption}
      onChange={(value) => (value.course_unit_id ? setSelectedOption(value) : setSelectedOption(null))}
    >
      <div className="relative">
        <h4 className="mb-1 text-sm md:text-xs">
          {course.info.name} (<strong>{course.info.acronym}</strong>)
        </h4>
        <Listbox.Button className="relative w-full cursor-default rounded-lg border-2 border-gray-300 dark:border-transparent dark:shadow bg-lightest dark:bg-darkish py-2 pl-3 pr-10 text-left sm:text-sm">
          <span className="block truncate">{getOptionDisplayText(course.info.acronym, selectedOption)}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <SelectorIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </span>
        </Listbox.Button>
        <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
          <Listbox.Options className="absolute z-20 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-lightest dark:bg-darkish py-1 text-base sm:text-sm">
            {adaptedSchedules.map((option, personIdx) => (
              <Listbox.Option
                key={personIdx}
                className={({ active }) =>
                  `group relative cursor-default select-none py-2 pl-10 pr-4 ${
                    active ? 'bg-primary text-white' : 'text-gray-900'
                  }`
                }
                value={option === null ? <>&nbsp;</> : option}
              >
                {({ selected, active }) => (
                  <>
                    <span className={`block truncate dark:text-white ${selected ? 'font-medium' : 'font-normal'}`}>
                      {getOptionDisplayText(course.info.acronym, option)}
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
      </div>
    </Listbox>
  ) : null
}

export default ScheduleListbox
