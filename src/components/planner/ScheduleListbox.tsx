import { useState, useEffect, Fragment, useMemo } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { SelectorIcon, CheckIcon } from '@heroicons/react/solid'
import { CourseOption, CourseOptions, CourseSchedule, Lesson } from '../../@types'
import { cloneObject, getLessonBoxName, getScheduleOptionDisplayText } from '../../utils'

type Props = {
  courseOption: CourseOption
  selectedHook: [CourseOptions, React.Dispatch<React.SetStateAction<CourseOptions>>]
}

const ScheduleListbox = ({ courseOption, selectedHook }: Props) => {
  const [, setSelected] = selectedHook
  const [selectedOption, setSelectedOption] = useState<CourseSchedule | null>(null)
  const [showTheoretical, setShowTheoretical] = useState<boolean>(true)
  const [showPractical, setShowPractical] = useState<boolean>(true)

  const adaptedSchedules = useMemo(() => {
    return [null, courseOption.schedules]
      .flat()
      .filter((option: CourseSchedule | null) => null || option?.class_name !== null)
  }, [courseOption])

  const getOptionDisplayText = (option: CourseSchedule | null) => {
    if (option === null || !option.course_unit_id) return <>&nbsp;</>
    return getScheduleOptionDisplayText(option)
  }

  const updateHiddenLessons = (type: string, courseOption: CourseOption) => {
    if (courseOption.option) {
      const courseOptionCopy = cloneObject(courseOption)
      const lesson: Lesson = {
        course: courseOptionCopy.course.info,
        schedule: courseOptionCopy.option,
      }

      if (type === 'T') lesson.schedule.lesson_type = 'T'

      const lessonBoxId =
        window.matchMedia('(max-width: 1024px)').matches === true
          ? getLessonBoxName(lesson, 'responsive')
          : getLessonBoxName(lesson)

      const lessonBoxes = document.getElementsByClassName(lessonBoxId)
      for (let i = 0; i < lessonBoxes.length; i++) {
        const lessonBox = lessonBoxes[i] as HTMLElement
        if (lessonBox.classList.contains('hidden')) lessonBox.classList.remove('hidden')
        else lessonBox.classList.add('hidden')
      }
    }
  }

  const refreshHiddenLessons = () => {
    if (courseOption.option) {
      const courseOptionCopy = cloneObject(courseOption)
      const practicalLesson: Lesson = {
        course: courseOptionCopy.course.info,
        schedule: courseOptionCopy.option,
      }

      const praticalLessonBoxId =
        window.matchMedia('(max-width: 1024px)').matches === true
          ? getLessonBoxName(practicalLesson, 'responsive')
          : getLessonBoxName(practicalLesson)

      const praticalLessonBoxes = document.getElementsByClassName(praticalLessonBoxId)
      for (let i = 0; i < praticalLessonBoxes.length; i++) {
        const lessonBox = praticalLessonBoxes[i] as HTMLElement
        if (!showPractical && !lessonBox.classList.contains('hidden')) {
          lessonBox.classList.add('hidden')
        } else if (showPractical && lessonBox.classList.contains('hidden')) {
          lessonBox.classList.remove('hidden')
        }
      }

      const theoreticalLesson: Lesson = cloneObject(practicalLesson)
      theoreticalLesson.schedule.lesson_type = 'T'

      const theoreticalLessonBoxId =
        window.matchMedia('(max-width: 1024px)').matches === true
          ? getLessonBoxName(theoreticalLesson, 'responsive')
          : getLessonBoxName(theoreticalLesson)

      const theoreticalLessonBoxes = document.getElementsByClassName(theoreticalLessonBoxId)
      const lessonBox = theoreticalLessonBoxes[0]
      if (!showTheoretical && !lessonBox.classList.contains('hidden')) {
        lessonBox.classList.add('hidden')
      } else if (showTheoretical && lessonBox.classList.contains('hidden')) {
        lessonBox.classList.remove('hidden')
      }
    }
  }

  const updateShown = (value: boolean, type: string, courseOption?: CourseOption): void => {
    if (type === 'T') setShowTheoretical(value)
    else if (type === 'TP') setShowPractical(value)
    updateHiddenLessons(type, courseOption)
  }

  useEffect(() => {
    refreshHiddenLessons()
  })

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
      <div className="relative text-sm">
        {/* Header */}
        <h4 className="mb-1 text-xs">
          {courseOption.course.info.name} (<strong>{courseOption.course.info.acronym}</strong>)
        </h4>

        {/* Button */}
        <Listbox.Button
          className="group relative w-full cursor-pointer rounded border-2 border-transparent bg-lightish py-1.5 pl-2 pr-9 text-left 
          text-xs transition hover:bg-primary/75 dark:bg-darkish dark:shadow dark:hover:bg-primary/50 2xl:py-2 2xl:pl-3 2xl:pr-10 2xl:text-sm"
        >
          <span className="block truncate font-medium group-hover:text-white">
            {getOptionDisplayText(selectedOption)}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-gray-400 group-hover:text-white">
            <SelectorIcon className="h-5 w-5 transition" aria-hidden="true" />
          </span>
        </Listbox.Button>

        {/* Dropdown */}
        <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
          <Listbox.Options className="absolute z-20 mt-1 max-h-36 w-full overflow-auto rounded border bg-lightest py-1 text-sm tracking-tight dark:bg-darkish lg:max-h-72 xl:text-base">
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
        <div className="mt-1.5 flex items-center justify-start space-x-4">
          <div className="flex items-center justify-center space-x-1">
            <input
              type="checkbox"
              checked={showTheoretical}
              id={`checkbox-classes-t-${courseOption.course.info.acronym}`}
              className="checkbox-small disabled:hidden"
              disabled={courseOption.option === null}
              onChange={(event) => updateShown(event.target.checked, 'T', courseOption)}
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
              checked={showPractical}
              id={`checkbox-classes-tp-${courseOption.course.info.acronym}`}
              className="checkbox-small disabled:hidden"
              disabled={courseOption.option === null}
              onChange={(event) => updateShown(event.target.checked, 'TP', courseOption)}
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
