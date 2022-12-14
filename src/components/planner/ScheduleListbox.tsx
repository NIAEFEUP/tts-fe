import { useState, useEffect, Fragment, useMemo, useRef } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { SelectorIcon, CheckIcon } from '@heroicons/react/solid'
import { getScheduleOptionDisplayText } from '../../utils'
import { CourseOption, CourseSchedule, MultipleOptions } from '../../@types'

type Props = {
  courseOption: CourseOption
  multipleOptionsHook: [MultipleOptions, React.Dispatch<React.SetStateAction<MultipleOptions>>]
  isImportedScheduleHook : [boolean, React.Dispatch<React.SetStateAction<boolean>>]
}

const ScheduleListbox = ({ courseOption, multipleOptionsHook, isImportedScheduleHook }: Props) => {
  const firstRenderRef = useRef(true)
  const [multipleOptions, setMultipleOptions] = multipleOptionsHook
  const [isImportedSchedule, setIsImportedSchedule] = isImportedScheduleHook
  const [selectedOption, setSelectedOption] = useState<CourseSchedule | null>(courseOption.option)
  const [showTheoretical, setShowTheoretical] = useState<boolean>(courseOption.shown.T)
  const [showPractical, setShowPractical] = useState<boolean>(courseOption.shown.TP)

  const adaptedSchedules = useMemo(() => {
    return [null, courseOption.schedules]
      .flat()
      .filter(
        (option: CourseSchedule | null) =>
          option?.lesson_type !== 'T' && (null || option?.class_name !== null || option?.composed_class_name !== null)
      )
  }, [courseOption])

  const getOptionDisplayText = (option: CourseSchedule | null) =>
    option === null || !option.course_unit_id ? <>&nbsp;</> : getScheduleOptionDisplayText(option)

  const updateShown = (value: boolean, type: string, courseOption: CourseOption): void => {
    if (type === 'T') {
      setShowTheoretical(value)
      setMultipleOptions((prev) => {
        let newCourseOptions = prev.selected

        for (let i = 0; i < prev.selected.length; i++) {
          const option = prev.selected[i]
          if (option.course.info.id === courseOption.course.info.id) {
            newCourseOptions[i].shown.T = value
          }
        }

        return {
          index: prev.index,
          selected: [...newCourseOptions],
          options: prev.options,
        }
      })
    } else if (type === 'TP') {
      setShowPractical(value)
      setMultipleOptions((prev) => {
        let newCourseOptions = prev.selected

        for (let i = 0; i < prev.selected.length; i++) {
          const option = prev.selected[i]
          if (option.course.info.id === courseOption.course.info.id) {
            newCourseOptions[i].shown.TP = value
          }
        }

        return {
          index: prev.index,
          selected: [...newCourseOptions],
          options: prev.options,
        }
      })
    }
  }

  useEffect(() => {
    if (firstRenderRef.current === true) {
      firstRenderRef.current = false
      return
    }

    const resolveCourseOptions = (prev: CourseOption[]) => {
      let newCourseOptions = prev
      console.log("prev", prev)
      for (let i = 0; i < prev.length; i++) {
        const option = prev[i]
        if (option.course.info.id === courseOption.course.info.id) {
          if(!isImportedSchedule){
            newCourseOptions[i].option = selectedOption

          }else{
            setSelectedOption(newCourseOptions[i].option)
          }
        }
        
      }

      if (isImportedSchedule) {
        setIsImportedSchedule(false)
      }

      return [...newCourseOptions]
    }

    setMultipleOptions((prevMultipleOptions) => {
      const value = {
        index: prevMultipleOptions.index,
        selected: [...resolveCourseOptions(prevMultipleOptions.selected)],
        options: prevMultipleOptions.options,
      }
      console.log("value", value)

      return value
    })
  }, [selectedOption, courseOption, setMultipleOptions])



  return (
    adaptedSchedules && (
      <Listbox
        value={selectedOption}
        onChange={(value) => (value.course_unit_id ? setSelectedOption(value) : setSelectedOption(null))}
      >
        <div className="relative text-sm">
          {/* Header */}
          <p className="mb-0.5 flex text-xs lg:hidden xl:flex">
            <strong>{courseOption.course.info.acronym}</strong>
            <span>&nbsp;&middot;&nbsp;</span>
            <span className="tracking-tighter truncate">{courseOption.course.info.name}&nbsp;</span>
          </p>

          <p className="mb-0.5 hidden text-xs lg:flex xl:hidden">
            <strong>{courseOption.course.info.acronym}</strong>
          </p>

          {/* Button */}
          <Listbox.Button
            title={`Escolher Horário de ${courseOption.course.info.acronym} (${courseOption.course.info.name})`}
            className="group relative w-full cursor-pointer rounded border-2 border-transparent bg-lightish py-1 pl-1 pr-9 text-left 
            text-xs transition hover:bg-primary/75 dark:bg-darkish dark:shadow dark:hover:bg-primary/50 2xl:py-1.5 2xl:pl-2.5 2xl:pr-10"
          >
            <span className="block truncate font-medium text-gray-700 group-hover:text-white dark:text-white">
              {getOptionDisplayText(selectedOption)}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-gray-400 group-hover:text-white">
              <SelectorIcon className="h-4 w-4 transition" aria-hidden="true" />
            </span>
          </Listbox.Button>

          {/* Dropdown */}
          <Transition as={Fragment} leave="transition ease-in duration-100" leaveFrom="opacity-100" leaveTo="opacity-0">
            <Listbox.Options
              className="absolute z-20 mt-1 max-h-48 w-full overflow-auto rounded border
            bg-light py-1 text-sm tracking-tight dark:bg-darkest lg:max-h-72 xl:text-base"
            >
              {adaptedSchedules.map((option, optionIdx) => (
                <Listbox.Option
                  key={`schedule-listbox-option-${multipleOptions.index}-${optionIdx}`}
                  value={option === null ? <>&nbsp;</> : option}
                  className={({ active }) =>
                    `group relative cursor-default select-none py-2 text-sm ${
                      selectedOption !== null ? 'pl-10' : 'pl-4'
                    } pr-4 ${active ? 'bg-primary/75 text-white dark:bg-primary/75' : 'text-gray-900'}`
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
            <div
              title={`${showTheoretical ? 'Esconder' : 'Mostrar'} Aulas Teóricas de ${courseOption.course.info.name}`}
              className="flex items-center justify-center space-x-1"
            >
              <input
                type="checkbox"
                checked={showTheoretical}
                id={`checkbox-classes-t-${courseOption.course.info.acronym}`}
                className="checkbox-small disabled:hidden"
                disabled={courseOption.option === null}
                onChange={(event) => updateShown(event.target.checked, 'T', courseOption)}
              />
              <label
                className="cursor-pointer text-[0.67rem] font-medium capitalize tracking-tight"
                htmlFor={`checkbox-classes-t-${courseOption.course.info.acronym}`}
              >
                <span>Teóricas</span>
              </label>
            </div>
            <div
              title={`${showPractical ? 'Esconder' : 'Mostrar'} Aulas Práticas de ${courseOption.course.info.name}`}
              className="flex items-center justify-center space-x-1"
            >
              <input
                type="checkbox"
                checked={showPractical}
                id={`checkbox-classes-tp-${courseOption.course.info.acronym}`}
                className="checkbox-small disabled:hidden"
                disabled={courseOption.option === null}
                onChange={(event) => updateShown(event.target.checked, 'TP', courseOption)}
              />
              <label
                className="cursor-pointer text-[0.67rem] font-medium capitalize tracking-tight"
                htmlFor={`checkbox-classes-tp-${courseOption.course.info.acronym}`}
              >
                <span>Práticas</span>
              </label>
            </div>
          </div>
        </div>
      </Listbox>
    )
  )
}

export default ScheduleListbox
