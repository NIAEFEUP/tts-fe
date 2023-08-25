import { useState, useEffect, Fragment, useMemo, useRef } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { SelectorIcon, CheckIcon, EyeIcon } from '@heroicons/react/solid'
import { getScheduleOptionDisplayText } from '../../utils'
import { CourseOption, CourseSchedule, MultipleOptions, ProfessorInformation } from '../../@types'

type Props = {
  courseOption: CourseOption
  multipleOptionsHook: [MultipleOptions, React.Dispatch<React.SetStateAction<MultipleOptions>>]
  isImportedScheduleHook: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
}

const ScheduleListbox = ({ courseOption, multipleOptionsHook, isImportedScheduleHook }: Props) => {
  const firstRenderRef = useRef(true)
  const [multipleOptions, setMultipleOptions] = multipleOptionsHook
  const [isImportedSchedule, setIsImportedSchedule] = isImportedScheduleHook
  const [selectedOption, setSelectedOption] = useState<CourseSchedule | null>(courseOption.option)
  const [showTheoretical, setShowTheoretical] = useState<boolean>(courseOption.shown.T)
  const [showPractical, setShowPractical] = useState<boolean>(courseOption.shown.TP)
  let teacherOptions = [{ acronym: 'All teachers', name: '' }, ...courseOption.teachers]
  const [lastSelected, setLastSelected] = useState(selectedOption)
  const [previewing, setPreviewing] = useState(false)

  // A filtered copy of courseOption.teachers is required for comparisons.
  const [selectedTeachers, setSelectedTeachers] = useState(
    courseOption.teachers.filter((prof_info1) =>
      courseOption.filteredTeachers.some((prof_info2) => prof_info1.acronym === prof_info2.acronym)
    )
  )

  const adaptedSchedules = useMemo(() => {
    return [null, courseOption.schedules]
      .flat()
      .filter(
        (option: CourseSchedule | null) =>
          option?.lesson_type !== 'T' && (null || option?.class_name !== null || option?.composed_class_name !== null)
      )
  }, [courseOption])

  const getTeacherSelectionText = (selectedTeachers: Array<ProfessorInformation>) =>
    selectedTeachers.length === 1 ? '1 teacher selected' : selectedTeachers.length + ' teachers selected'

  const handleListBoxSelection = (option: CourseSchedule) => {
    setLastSelected(option)
    setSelectedOption(option)
  }

  const showPreview = (option: CourseSchedule) => {
    if (!previewing) {
      setPreviewing(true)
    }
    setSelectedOption(option)
  }

  const isLastSelected = (option: CourseSchedule) => {
    // Checks if the CourseSchedule is the lastSelected CourseSchedule
    if (!lastSelected || !option) return false
    return (
      option.day === lastSelected.day &&
      option.duration === lastSelected.duration &&
      option.start_time === lastSelected.start_time &&
      option.location === lastSelected.location &&
      option.lesson_type === lastSelected.lesson_type &&
      option.course_unit_id === lastSelected.course_unit_id &&
      option.last_updated === lastSelected.last_updated &&
      option.class_name === lastSelected.class_name && // e.g. 1MIEIC01
      option.composed_class_name === lastSelected.composed_class_name
    ) // e.g. COMP752
  }

  const removePreview = () => {
    setPreviewing(false)
    setSelectedOption(lastSelected)
  }

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
          names: prev.names,
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
          names: prev.names,
        }
      })
    }
  }

  const hasCommonProfessorWith = (profs1, profs2) =>
    profs1.some((prof_info1) => profs2.some((prof_info2) => prof_info1.acronym === prof_info2.acronym))

  useEffect(() => {
    if (firstRenderRef.current === true) {
      firstRenderRef.current = false
      return
    }

    const resolveCourseOptions = (prev: CourseOption[]) => {
      let newCourseOptions = [...prev]
      for (let i = 0; i < newCourseOptions.length; i++) {
        const option = newCourseOptions[i]
        if (option.course.info.id === courseOption.course.info.id) {
          if (!isImportedSchedule) {
            newCourseOptions[i].option = selectedOption
          } else {
            setLastSelected(newCourseOptions[i].option)
          }
          setSelectedOption(newCourseOptions[i].option)
          break
        }
      }

      return [...newCourseOptions]
    }

    let resolvedCourseOptions = resolveCourseOptions(multipleOptions.selected)
    let resolvedOptions = multipleOptions.options
    console.log(selectedOption)
    resolvedOptions[multipleOptions.index] = resolvedCourseOptions

    setMultipleOptions((prevMultipleOptions) => {
      const value = {
        index: prevMultipleOptions.index,
        selected: resolvedCourseOptions,
        options: resolvedOptions,
        names: prevMultipleOptions.names,
      }

      return value
    })

    if (isImportedSchedule) {
      setIsImportedSchedule(false)
    }

    //this line is needed since adding isImportedSchedule SetImportedSchedule to the dependency array causes an insconsistent ListBox behavior
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOption, courseOption, setMultipleOptions])

  const updateTeachersShown = (selectedTeachers: Array<ProfessorInformation>): void => {
    if (selectedTeachers.some((other) => other.acronym === 'All teachers')) {
      selectedTeachers = selectedTeachers.length !== 1 ? [] : courseOption.teachers
    }
    courseOption.filteredTeachers = selectedTeachers
    setSelectedTeachers(selectedTeachers)
    if (selectedOption) {
      setSelectedOption(
        hasCommonProfessorWith(selectedOption.professor_information, selectedTeachers) ? selectedOption : null
      )
      setLastSelected(null)
    }
  }

  const selectDropdownSchedules = (): Array<CourseSchedule> => {
    let selectedSchedules = []

    if (selectedTeachers.some((other) => other.acronym === 'All teachers')) return adaptedSchedules

    adaptedSchedules.forEach((schedule) => {
      if (schedule === null || hasCommonProfessorWith(schedule.professor_information, selectedTeachers))
        selectedSchedules.push(schedule)
    })

    return selectedSchedules
  }

  const showName = (e, name) => {
    if (name === '') return
    if (e.target.children.length !== 0) e.target.children[0].innerText = name
  }

  const showAcronym = (e, acronym) => {
    if (acronym === 'All teachers') return
    if (e.target.children.length !== 0) e.target.children[0].innerText = acronym
  }

  return (
    adaptedSchedules && (
      <Listbox
        value={selectedOption}
        onChange={(value) => (value.course_unit_id ? handleListBoxSelection(value) : handleListBoxSelection(null))}
      >
        <div className="relative text-sm">
          {/* Header */}
          <p className="mb-0.5 flex text-xs lg:hidden xl:flex">
            <strong>{courseOption.course.info.acronym}</strong>
            <span>&nbsp;&middot;&nbsp;</span>
            <span className="truncate tracking-tighter">{courseOption.course.info.name}&nbsp;</span>
          </p>

          <p className="mb-0.5 hidden text-xs lg:flex xl:hidden">
            <strong>{courseOption.course.info.acronym}</strong>
          </p>

          <div className="flex flex-row gap-x-1">
            {/* Button */}
            <Listbox.Button
              title={`Escolher Horário de ${courseOption.course.info.acronym} (${courseOption.course.info.name})`}
              className="group relative w-3/4 flex-shrink-0 cursor-pointer rounded border-2 border-transparent bg-lightish py-1 pl-1 pr-9 text-left 
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
            <Transition
              as={Fragment}
              leave="transition ease-in duration-100"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Listbox.Options
                className="absolute z-20 mt-1 max-h-48 w-full overflow-auto rounded border
            bg-light py-1 text-sm tracking-tight dark:bg-darkest lg:max-h-72 xl:text-base"
              >
                {selectDropdownSchedules().map((option, optionIdx) => (
                  <Listbox.Option
                    onMouseEnter={() => showPreview(option)}
                    onMouseLeave={() => removePreview()}
                    key={`schedule-listbox-option-${multipleOptions.index}-${optionIdx}`}
                    value={option === null ? <>&nbsp;</> : option}
                    className={({ active }) =>
                      `group relative cursor-default select-none py-2 pl-10 pr-4
                     text-sm ${active ? 'bg-primary/75 text-white dark:bg-primary/75' : 'text-gray-900'}`
                    }
                  >
                    {({ selected, active }) => (
                      <>
                        <span className={`block truncate dark:text-white ${selected ? 'font-medium' : 'font-normal'}`}>
                          {getOptionDisplayText(option)}
                        </span>
                        {isLastSelected(option) ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              active ? 'text-white' : 'text-primary dark:text-white'
                            }`}
                          >
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : selected ? (
                          <span
                            className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                              active ? 'text-white' : 'text-primary dark:text-white'
                            }`}
                          >
                            <EyeIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        ) : null}
                      </>
                    )}
                  </Listbox.Option>
                ))}
              </Listbox.Options>
            </Transition>

            {/* Teachers ListBox */}
            <Listbox value={selectedTeachers} onChange={updateTeachersShown} multiple={true}>
              {/* Button */}
              <Listbox.Button
                title={`Escolher Horário de ${courseOption.course.info.acronym} (${courseOption.course.info.name})`}
                className="group relative w-1/4 cursor-pointer whitespace-nowrap rounded border-2 border-transparent bg-lightish py-1 pl-1 pr-9 text-left 
                  text-xs transition hover:bg-primary/75 dark:bg-darkish dark:shadow dark:hover:bg-primary/50 2xl:py-1.5 2xl:pl-2.5 2xl:pr-10"
              >
                <span className="block truncate font-medium text-gray-700 group-hover:text-white dark:text-white">
                  {getTeacherSelectionText(selectedTeachers)}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2 text-gray-400 group-hover:text-white">
                  <SelectorIcon className="h-4 w-4 transition" aria-hidden="true" />
                </span>
              </Listbox.Button>

              {/* Dropdown */}
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options
                  className="absolute z-20 mt-1 max-h-48 w-full overflow-auto rounded border
                    bg-light py-1 text-sm tracking-tight dark:bg-darkest lg:max-h-72 xl:text-base"
                >
                  {teacherOptions.map((option, optionIdx) => (
                    <Listbox.Option
                      key={option.acronym}
                      value={option}
                      onMouseOver={(e) => showName(e, option.name)}
                      onMouseOut={(e) => showAcronym(e, option.acronym)}
                      className={({ active }) =>
                        `group relative cursor-default select-none py-2 pl-10 pr-4
                            text-sm ${active ? 'bg-primary/75 text-white dark:bg-primary/75' : 'text-gray-900'}`
                      }
                    >
                      {({ selected, active }) => (
                        <>
                          <span
                            className={`block truncate dark:text-white ${
                              selected ? 'font-medium' : 'font-normal'
                            } pointer-events-none`}
                          >
                            {optionIdx === 0
                              ? selectedTeachers.length === 0
                                ? 'Select All'
                                : 'Erase all'
                              : option.acronym}
                          </span>
                          {selected ? (
                            <span
                              className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                active ? 'text-white' : 'text-primary dark:text-white'
                              } pointer-events-none`}
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
            </Listbox>
          </div>

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
