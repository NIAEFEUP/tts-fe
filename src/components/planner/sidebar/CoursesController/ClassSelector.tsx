import { useEffect, useMemo, useRef, useState, useContext } from 'react'
import { ChevronUpDownIcon, LockClosedIcon, LockOpenIcon } from '@heroicons//react/24/solid'
import { User } from 'lucide-react'
// import { CourseOption, CourseSchedule, MultipleOptions } from '../../../@types'
import { getAllPickedSlots, getClassDisplayText, schedulesConflict } from '../../../../utils'
import { Button } from '../../../ui/button'
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
} from '../../../ui/dropdown-menu'
import { CourseInfo, ClassInfo, SlotInfo, ProfessorInfo } from '../../../../@types/new_index'
import MultipleOptionsContext from '../../../../contexts/MultipleOptionsContext'
import CourseContext from '../../../../contexts/CourseContext'
import ProfessorItem from './ProfessorItem'
import ClassItem from './ClassItem'

type Props = {
  course: CourseInfo
}

const ClassSelector = ({ course }: Props) => {
  const classSelectorTriggerRef = useRef(null)
  const classSelectorContentRef = useRef(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const { multipleOptions, setMultipleOptions, selectedOption, setSelectedOption } = useContext(MultipleOptionsContext)
  const { pickedCourses } = useContext(CourseContext)

  // const courseOption = useMemo(() => {
  //   return multipleOptions[selectedOption].course_options.find((opt) => opt.course_id === course.id)
  // }, [selectedOption, multipleOptions, course.id])

  const [classesLoaded, setClassesLoaded] = useState(course.classes !== undefined)
  const courseOption = multipleOptions[selectedOption].course_options.find((opt) => opt.course_id === course.id)

  const [filteredTeachers, setFilteredTeachers] = useState(courseOption.filteredTeachers)
  const [locked, setLocked] = useState(courseOption.locked)
  const [hide, setHide] = useState(courseOption.hide)

  const [preview, setPreview] = useState(null)
  const [display, setDisplay] = useState(courseOption.picked_class_id)

  const allTeachers = useMemo(() => {
    if (!classesLoaded) return []

    const teachers = course.classes.flatMap((c) => c.slots.flatMap((s) => s.professors))

    const uniqueProfessors: { [key: number]: ProfessorInfo } = {}

    // Filter out duplicates
    const uniqueTeachers = teachers.filter((professor) => {
      if (!uniqueProfessors[professor.id]) {
        // If the professor has not been encountered yet, add it to the temporary object
        uniqueProfessors[professor.id] = professor
        return true
      }
      return false
    })

    return uniqueTeachers
  }, [classesLoaded, course.classes])

  // const firstRenderRef = useRef(true)
  // const [multipleOptions, setMultipleOptions] = multipleOptionsHook
  // const [isImportedOption, setIsImportedOption] = isImportedOptionHook
  // const [selectedOption, setSelectedOption] = useState<CourseSchedule | null>(courseOption.option)
  // const [showTheoretical, setShowTheoretical] = useState<boolean>(courseOption.shown.T)
  // const [showPractical, setShowPractical] = useState<boolean>(courseOption.shown.TP)
  // //FIXME (thePeras): If you are here you probably oberserved a bug. Don't worry its gonna be fixed very very soon
  // var teacherOptions = courseOption.teachers
  // const [lastSelected, setLastSelected] = useState(selectedOption)

  // const [selectedTeachers, setSelectedTeachers] = useState(courseOption.teachers)

  /**
   * This useEffect is used to make the dropdown content width match the trigger width
   */
  useEffect(() => {
    if (classSelectorTriggerRef.current && classSelectorContentRef.current) {
      classSelectorContentRef.current.style.width = `${classSelectorTriggerRef.current.offsetWidth}px`
    }
  }, [isDropdownOpen])

  // useEffect(() => {
  //   if (courseOption.option) {
  //     setSelectedOption(courseOption.option)
  //   }
  // }, [multipleOptions])

  // const handleClassSelection = (option: CourseSchedule) => {
  //   setLastSelected(option)
  //   setSelectedOption(option)
  // }

  // const toggleLocked = () => {
  //   setMultipleOptions((prev) => {
  //     let newMultipleOptions = prev
  //     let newSelectedOption = prev[selectedOption]

  //     for (let i = 0; i < newSelectedOption.course_options.length; i++) {
  //       const courseOption = newSelectedOption.course_options[i]
  //       if (courseOption.course_id === course.id)
  //         newSelectedOption.course_options[i].locked = !newSelectedOption.course_options[i].locked
  //     }

  //     newMultipleOptions[selectedOption] = newSelectedOption

  //     return [...newMultipleOptions]
  //   })
  // }

  // const updateShown = (value: boolean, type: string, courseOption: CourseOption): void => {
  //   if (type === 'T') {
  //     setShowTheoretical(value)
  //     setMultipleOptions((prev) => {
  //       let newCourseOptions = prev.selected

  //       for (let i = 0; i < prev.selected.length; i++) {
  //         const option = prev.selected[i]
  //         if (option.course.info.id === courseOption.course.info.id) {
  //           newCourseOptions[i].shown.T = value
  //         }
  //       }

  //       return {
  //         index: prev.index,
  //         selected: [...newCourseOptions],
  //         options: prev.options,
  //       }
  //     })
  //   } else if (type === 'TP') {
  //     setShowPractical(value)
  //     setMultipleOptions((prev) => {
  //       let newCourseOptions = prev.selected

  //       for (let i = 0; i < prev.selected.length; i++) {
  //         const option = prev.selected[i]
  //         if (option.course.info.id === courseOption.course.info.id) {
  //           newCourseOptions[i].shown.TP = value
  //         }
  //       }

  //       return {
  //         index: prev.index,
  //         selected: [...newCourseOptions],
  //         options: prev.options,
  //       }
  //     })
  //   }
  // }

  // useEffect(() => {
  //   if (firstRenderRef.current === true) {
  //     firstRenderRef.current = false
  //     return
  //   }

  //   const resolveCourseOptions = (prev: CourseOption[]) => {
  //     let newCourseOptions = [...prev]
  //     for (let i = 0; i < newCourseOptions.length; i++) {
  //       const option = newCourseOptions[i]
  //       if (option.course.info.id === courseOption.course.info.id) {
  //         if (!isImportedOption) {
  //           newCourseOptions[i].option = selectedOption
  //         } else {
  //           setLastSelected(newCourseOptions[i].option)
  //         }
  //         setSelectedOption(newCourseOptions[i].option)
  //         break
  //       }
  //     }

  //     return [...newCourseOptions]
  //   }

  //   let resolvedCourseOptions = resolveCourseOptions(multipleOptions.selected)
  //   let resolvedOptions = multipleOptions.options
  //   resolvedOptions[multipleOptions.index] = resolvedCourseOptions

  //   setMultipleOptions((prevMultipleOptions) => {
  //     const value = {
  //       index: prevMultipleOptions.index,
  //       selected: resolvedCourseOptions,
  //       options: resolvedOptions,
  //     }

  //     return value
  //   })

  //   if (isImportedOption) {
  //     setIsImportedOption(false)
  //   }

  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [selectedOption, courseOption, setMultipleOptions])

  // const selectDropdownSchedules = (): Array<Slot> => {
  //   let validSchedules = []

  //   if (display.filteredTeachers.some((other) => other.acronym === 'All teachers'))
  //     return multipleOptions[selectedOption].course_options.find((opt) => opt.course_id === course.id).schedules

  // }

  const getOptions = (): Array<ClassInfo> => {
    if (filteredTeachers.length === 0) return course.classes

    return course.classes.filter((c) => {
      const slots = c.slots
      const aux = slots.every((s) => {
        return s.professors.some((p) => !filteredTeachers.includes(p.id))
      })
      console.log('class: ', c.name, '          - ', aux)
      return aux
    })
  }

  // Checks if any of the selected classes have time conflicts with the classInfo
  // This is used to display a warning icon in each class of the dropdown in case of conflicts
  const timesCollideWithSelected = (classInfo: ClassInfo) => {
    const pickedSlots = getAllPickedSlots(pickedCourses, multipleOptions[selectedOption])
    // console.log(pickedSlots)
    return pickedSlots.some((slot) => classInfo.slots.some((currentSlot) => schedulesConflict(slot, currentSlot)))

    // const currentClass = course.classes.find((c) => c.id === display)
    // if (currentClass)
    //   return classInfo.slots.some((slot) =>
    //     currentClass.slots.some((currentSlot) => schedulesConflict(slot, currentSlot))
    //   )
  }

  // Checks if two arrays of professors have a common professor
  const hasCommonProfessorWith = (profs1, profs2) =>
    profs1.some((prof_info1) => profs2.some((prof_info2) => prof_info1.acronym === prof_info2.acronym))

  // const getOptionDisplayText = (option: CourseInfo, selectedClassId: number) => {
  //   option === null || !option.course_unit_id ? <>&nbsp;</> : getScheduleOptionDisplayText(option)
  // }

  const showPreview = (classInfo: ClassInfo) => {
    setPreview(classInfo.id)
  }

  const removePreview = () => {
    setPreview(null)
  }

  function toggleTeacher(id) {
    if (filteredTeachers.includes(id)) {
      setFilteredTeachers(filteredTeachers.filter((t) => t !== id))
    } else {
      setFilteredTeachers([...filteredTeachers, id])
    }
  }

  function toggleAllTeachers(teachers: ProfessorInfo[]) {
    if (filteredTeachers.length > 0) {
      setFilteredTeachers([])
    } else {
      setFilteredTeachers(teachers.flatMap((t) => t.id))
    }
  }

  useEffect(() => {
    setMultipleOptions((prev) => {
      let newMultipleOptions = prev
      let newSelectedOption = prev[selectedOption]

      newSelectedOption['picked_class_id'] = preview ? preview : display
      newSelectedOption['filteredTeachers'] = filteredTeachers
      newSelectedOption['locked'] = locked
      newSelectedOption['hide'] = hide

      newMultipleOptions[selectedOption] = newSelectedOption
      return [...newMultipleOptions]
    })
  }, [preview, display, filteredTeachers, locked, hide, selectedOption, setMultipleOptions])

  useEffect(() => {
    setClassesLoaded(course.classes !== undefined)
  }, [multipleOptions, setClassesLoaded, course.classes])

  return (
    <div className="relative text-sm" key={`course-option-${course.acronym}`}>
      {/* Header */}
      <p className="mb-0.5 flex text-xs">
        <strong>{course.acronym}</strong>
        <span>&nbsp;&middot;&nbsp;</span>
        <span className="truncate tracking-tighter">{course.name}&nbsp;</span>
      </p>
      <div className="flex items-center">
        {/* Dropdown Menu */}
        <DropdownMenu onOpenChange={setIsDropdownOpen}>
          <DropdownMenuTrigger asChild disabled={courseOption.locked} ref={classSelectorTriggerRef}>
            <Button
              variant="outline"
              size="sm"
              className="w-full justify-between truncate bg-lightish text-xs font-normal tracking-tighter hover:bg-primary/75 hover:text-white dark:bg-darkish"
            >
              <span>{getClassDisplayText(course, display)} </span>
              {!courseOption.locked && <ChevronUpDownIcon className="text-blackish h-6 w-6 dark:text-lightish" />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="bg-lightish text-darkish dark:bg-darkish dark:text-lightish"
            ref={classSelectorContentRef}
          >
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
                        toggleAllTeachers(allTeachers)
                      }}
                    >
                      <span className="block truncate dark:text-white">
                        {filteredTeachers.length === 0 ? 'Apagar todos' : 'Selecionar Todos'}
                      </span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    {allTeachers.map((option) => {
                      const isFiltered = filteredTeachers.includes(option.id)
                      return (
                        <ProfessorItem
                          key={`${course.acronym}-teacher-${option.acronym}`}
                          professorInformation={option}
                          filtered={isFiltered}
                          onSelect={(e) => {
                            e.preventDefault()
                            toggleTeacher(option.id)
                          }}
                        />
                        // <DropdownMenuCheckboxItem
                        //   key={`teacher-${option.acronym}`}
                        //   className="group gap-2"
                        //   checked={isSelected}
                        //   onSelect={(e) => {
                        //     e.preventDefault()
                        //     toggleTeacher(option)
                        //   }}
                        // >
                        //   <span className="group-hover:hidden">{option.acronym}</span>
                        //   <span className="hidden truncate group-hover:block">{option.name}</span>
                        // </DropdownMenuCheckboxItem>
                      )
                    })}
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup className="max-h-96 overflow-y-auto">
              <DropdownMenuItem onSelect={() => setDisplay(null)}>
                <span className="text-sm tracking-tighter">Remover Seleção</span>
              </DropdownMenuItem>
              {classesLoaded &&
                getOptions().map((classInfo) => (
                  <ClassItem
                    key={`schedule-${classInfo.name}`}
                    classInfo={classInfo}
                    displayed={display === classInfo.id}
                    checked={selectedOption === classInfo.id}
                    conflict={timesCollideWithSelected(classInfo)}
                    onSelect={() => setSelectedOption(classInfo.id)}
                    onMouseEnter={() => showPreview(classInfo)}
                    onMouseLeave={() => removePreview()}
                  />
                  // <DropdownMenuCheckboxItem
                  //   key={`schedule-${classInfo.name}`}
                  //   className="flex gap-2"
                  //   onMouseEnter={() => showPreview(classInfo)}
                  //   onMouseLeave={() => removePreview()}
                  //   checked={selectedOption === classInfo.id}
                  //   onSelect={() => setDisplay(classInfo.id)}
                  // >
                  //   <div className="grow">
                  //     <span className="text-sm tracking-tighter">{classInfo.name}</span>
                  //   </div>
                  //   <span
                  //     className={`absolute inset-y-0 right-0 flex items-center pr-3 text-rose-700 ${
                  //       timesCollideWithSelected(classInfo) ? 'block' : 'hidden'
                  //     }`}
                  //   >
                  //     <ExclamationTriangleIcon className="h-5 w-5" aria-hidden="true" />
                  //   </span>
                  // </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Lock Button */}
        <Button
          variant="icon"
          title="Bloquear/Desbloquear Horário"
          onClick={() => setLocked(!locked)}
          disabled={display === null}
        >
          {courseOption.locked ? (
            <LockClosedIcon className="h-6 w-6 text-darkish dark:text-lightish" />
          ) : (
            <LockOpenIcon className="h-6 w-6 text-darkish dark:text-lightish" />
          )}
        </Button>
      </div>

      {/* Show/Hide Checkboxes */}
      {/* <div className="mt-1 flex items-center justify-start space-x-4">
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
      </div> */}
    </div>
  )
}
export default ClassSelector
