import { useState, Fragment } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { SelectorIcon, CheckIcon } from '@heroicons/react/solid'
import { CheckedCourse, CourseSchedule, CourseSchedules } from '../../@types'
import { convertHour, convertWeekday } from '../../utils'

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
    return `${option.class_name}, ${option.teacher_acronym}, ${convertWeekday(option.day)}, ${convertHour(
      option.start_time
    )}-${convertHour(option.start_time + option.duration)}`
  }

  const adaptedSchedules = createAdaptedSchedules()
  const [selectedSchedules, setSelectedSchedules] = selectedSchedulesHook
  const [selectedOption, setSelectedOption] = useState<CourseSchedule | null>(adaptedSchedules[0])

  return schedules ? (
    <Listbox
      value={selectedOption}
      onChange={(value) => (value.course_unit_id ? setSelectedOption(value) : setSelectedOption(null))}
    >
      <div className="relative">
        <h4 className="mb-1 text-sm md:text-xs">
          {course.info.name} (<strong>{course.info.acronym}</strong>)
        </h4>
        <Listbox.Button
          className="relative w-full cursor-pointer rounded-lg border-2 border-transparent bg-lightish py-2 pl-3 pr-10 
          text-left transition hover:bg-primary/10 dark:hover:bg-primary/25 dark:bg-darkish dark:shadow sm:text-sm"
        >
          <span className="block truncate font-medium">
            {getOptionDisplayText(course.info.acronym, selectedOption)}
          </span>
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
                    active ? 'bg-primary/75 dark:bg-primary/75 text-white' : 'text-gray-900'
                  }`
                }
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
