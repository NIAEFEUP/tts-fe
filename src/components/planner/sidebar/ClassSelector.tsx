import { ChevronUpDownIcon, ExclamationTriangleIcon, LockClosedIcon, LockOpenIcon } from '@heroicons//react/24/solid'
import { User } from 'lucide-react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { CourseOption, CourseSchedule, MultipleOptions } from '../../../@types'
import { getScheduleOptionDisplayText, schedulesConflict } from '../../../utils/utils'
import { Button } from '../../ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '../../ui/dropdown-menu'

type Props = {
  courseOption: CourseOption
  multipleOptionsHook: [MultipleOptions, React.Dispatch<React.SetStateAction<MultipleOptions>>]
  isImportedOptionHook: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
}

const ClassSelector = ({ courseOption, multipleOptionsHook, isImportedOptionHook }: Props) => {
  const firstRenderRef = useRef(true)
  const [multipleOptions, setMultipleOptions] = multipleOptionsHook
  const [isImportedOption, setIsImportedOption] = isImportedOptionHook
  const [selectedOption, setSelectedOption] = useState<CourseSchedule | null>(courseOption.option)
  const [showTheoretical, setShowTheoretical] = useState<boolean>(courseOption.shown.T)
  const [showPractical, setShowPractical] = useState<boolean>(courseOption.shown.TP)
  //FIXME (thePeras): If you are here you probably oberserved a bug. Don't worry its gonna be fixed very very soon
  var teacherOptions = courseOption.teachers
  const [lastSelected, setLastSelected] = useState(selectedOption)
  const [previewing, setPreviewing] = useState(false)

  const [selectedTeachers, setSelectedTeachers] = useState(courseOption.teachers)

  useEffect(() => {
    if (courseOption.option) {
      setSelectedOption(courseOption.option)
    }
  }, [multipleOptions])

  const adaptedSchedules = useMemo(() => {
    return [courseOption.schedules]
      .flat()
      .filter(
        (option: CourseSchedule | null) =>
          option?.lesson_type !== 'T' && (null || option?.class_name !== null || option?.composed_class_name !== null)
      )
  }, [courseOption])

  const handleClassSelection = (option: CourseSchedule) => {
    setLastSelected(option)
    setSelectedOption(option)
  }

  const toggleLocked = () => {
    setMultipleOptions((prev) => {
      let newCourseOptions = prev.selected

      for (let i = 0; i < prev.selected.length; i++) {
        const option = prev.selected[i]
        if (option.course.info.id === courseOption.course.info.id) {
          newCourseOptions[i].locked = !newCourseOptions[i].locked
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

  const showPreview = (option: CourseSchedule) => {
    if (!previewing) {
      setPreviewing(true)
    }
    setSelectedOption(option)
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
          if (!isImportedOption) {
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

    if (isImportedOption) {
      setIsImportedOption(false)
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedOption, courseOption, setMultipleOptions])

  const selectDropdownSchedules = (): Array<CourseSchedule> => {
    let selectedSchedules = []

    if (selectedTeachers.some((other) => other.acronym === 'All teachers')) return adaptedSchedules

    adaptedSchedules.forEach((schedule) => {
      if (schedule === null || hasCommonProfessorWith(schedule.professor_information, selectedTeachers))
        selectedSchedules.push(schedule)
    })

    return selectedSchedules
  }

  const timesCollideWithSelected = (option: CourseSchedule) => {
    if (option === null) return null
    const selectedOptions = multipleOptions.selected.map((co) => co.option).filter((so) => so !== null)
    for (const selectedOption of selectedOptions) {
      if (schedulesConflict(option, selectedOption) && option.course_unit_id !== selectedOption.course_unit_id) {
        return 'class-conflict'
      }
    }
    return null
  }

  function toggleTeacher(option) {
    if (selectedTeachers.includes(option)) {
      // If the teacher is already selected, remove it
      setSelectedTeachers(selectedTeachers.filter((teacher) => teacher !== option))
    } else {
      // If the teacher is not selected, add it
      setSelectedTeachers([...selectedTeachers, option])
    }
  }

  function toggleAllTeachers(options) {
    if (selectedTeachers.length > 0) {
      // If all teachers are selected, deselect all
      setSelectedTeachers([])
    } else {
      // If not all teachers are selected, select all
      setSelectedTeachers(options)
    }
  }

  return (
    adaptedSchedules && (
      <div className="relative text-sm" key={`course-option-${courseOption.course.info.acronym}`}>
        {/* Header */}
        <p className="mb-0.5 flex text-xs lg:hidden xl:flex">
          <strong>{courseOption.course.info.acronym}</strong>
          <span>&nbsp;&middot;&nbsp;</span>
          <span className="truncate tracking-tighter">{courseOption.course.info.name}&nbsp;</span>
        </p>

        <p className="mb-0.5 hidden text-xs lg:flex xl:hidden">
          <strong>{courseOption.course.info.acronym}</strong>
        </p>
        <div className="flex items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild disabled={courseOption.locked}>
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-between truncate bg-lightish text-xs font-normal tracking-tighter hover:bg-primary/75 hover:text-white dark:bg-darkish"
              >
                {getOptionDisplayText(selectedOption)}
                {!courseOption.locked && <ChevronUpDownIcon className="text-blackish h-6 w-6 dark:text-lightish" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-96 bg-lightish text-darkish dark:bg-darkish dark:text-lightish">
              <DropdownMenuGroup>
                <DropdownMenuSub>
                  <DropdownMenuSubTrigger>
                    <User className="mr-2 h-4 w-4" />
                    <span>Professores</span>
                  </DropdownMenuSubTrigger>
                  <DropdownMenuPortal>
                    <DropdownMenuSubContent className="w-80 bg-lightish text-darkish dark:bg-darkish dark:text-lightish">
                      <DropdownMenuItem
                        onClick={(e) => {
                          e.preventDefault()
                          toggleAllTeachers(teacherOptions)
                        }}
                      >
                        <span className="block truncate dark:text-white">
                          {selectedTeachers.length === 0 ? 'Select All' : 'Erase all'}
                        </span>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      {teacherOptions.map((option) => {
                        const isSelected = selectedTeachers.includes(option)
                        return (
                          <DropdownMenuCheckboxItem
                            key={`teacher-${option.acronym}`}
                            className="group gap-2"
                            checked={isSelected}
                            onSelect={(e) => {
                              e.preventDefault()
                              toggleTeacher(option)
                            }}
                          >
                            <span className="group-hover:hidden">{option.acronym}</span>
                            <span className="hidden truncate group-hover:block">{option.name}</span>
                          </DropdownMenuCheckboxItem>
                        )
                      })}
                    </DropdownMenuSubContent>
                  </DropdownMenuPortal>
                </DropdownMenuSub>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup className="max-h-96 overflow-y-auto">
                <DropdownMenuItem onSelect={() => handleClassSelection(null)}>
                  <span className="text-sm tracking-tighter">Remover Seleção</span>
                </DropdownMenuItem>
                {selectDropdownSchedules().map((option) => (
                  <DropdownMenuCheckboxItem
                    key={`schedule-${option.class_name}`}
                    className="gap-2"
                    onMouseEnter={() => showPreview(option)}
                    onMouseLeave={() => removePreview()}
                    checked={selectedOption == option}
                    onSelect={() => handleClassSelection(option)}
                  >
                    <span className="text-sm tracking-tighter">{getOptionDisplayText(option)}</span>

                    {(() => {
                      const collisionType = timesCollideWithSelected(option)
                      return collisionType ? (
                        <span
                          className={`absolute inset-y-0 right-0 flex items-center pr-3 ${
                            collisionType === 'class-conflict' ? 'text-rose-700' : 'text-amber-500'
                          }`}
                        >
                          <ExclamationTriangleIcon className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null
                    })()}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            variant="icon"
            title="Bloquear/Desbloquear Horário"
            onClick={toggleLocked}
            disabled={!courseOption.option}
          >
            {courseOption.locked ? (
              <LockClosedIcon className="h-6 w-6 text-darkish dark:text-lightish" />
            ) : (
              <LockOpenIcon className="h-6 w-6 text-darkish dark:text-lightish" />
            )}
          </Button>
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
    )
  )
}
export default ClassSelector
