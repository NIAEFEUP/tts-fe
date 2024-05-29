import { useEffect, useMemo, useRef, useState, useContext } from 'react'
import { ChevronUpDownIcon, LockClosedIcon, LockOpenIcon } from '@heroicons//react/24/solid'
import { User } from 'lucide-react'
// import { CourseOption, CourseSchedule, MultipleOptions } from '../../../@types'
import { getAllPickedSlots, getClassDisplayText, schedulesConflict } from '../../../../utils'
import { Button } from '../../../ui/button'
import {
    DropdownMenu,
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
import { CourseInfo, ClassInfo, ProfessorInfo } from '../../../../@types/new_index'
import MultipleOptionsContext from '../../../../contexts/MultipleOptionsContext'
import CourseContext from '../../../../contexts/CourseContext'
import ProfessorItem from './ProfessorItem'
import ClassItem from './ClassItem'
import StorageAPI from '../../../../api/storage'

type Props = {
    course: CourseInfo
}

const ClassSelector = ({ course }: Props) => {
    const classSelectorTriggerRef = useRef(null)
    const classSelectorContentRef = useRef(null)
    const [isDropdownOpen, setIsDropdownOpen] = useState(false)

    const { multipleOptions, setMultipleOptions, selectedOption, setSelectedOption } = useContext(MultipleOptionsContext)
    const { pickedCourses } = useContext(CourseContext)

    const [ selectedClassId, setSelectedClassId ] = useState<number | null>(null);

    // const courseOption = useMemo(() => {
    //   return multipleOptions[selectedOption].course_options.find((opt) => opt.course_id === course.id)
    // }, [selectedOption, multipleOptions, course.id])

    const [classesLoaded, setContentLoaded] = useState(course.classes !== undefined)
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
            if (!uniqueProfessors[professor.professor_id]) {
                // If the professor has not been encountered yet, add it to the temporary object
                uniqueProfessors[professor.professor_id] = professor
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

    const classInfoHasFilteredTeacher = (classInfo: ClassInfo) => {
        if(filteredTeachers.length === 0) return true;

        return classInfo.slots.filter((slot) => slot.professors.some((professor) => filteredTeachers.includes(professor.professor_id))).length > 0;
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
        console.log("Id is: ", id);
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

    // useEffect(() => {
    //   setMultipleOptions((prev) => {
    //     let newMultipleOptions = prev
    //     let newSelectedOption = prev[selectedOption]

    //     newSelectedOption['picked_class_id'] = preview ? preview : display
    //     newSelectedOption['filteredTeachers'] = filteredTeachers
    //     newSelectedOption['locked'] = locked
    //     newSelectedOption['hide'] = hide

    //     newMultipleOptions[selectedOption] = newSelectedOption
    //     return [...newMultipleOptions]
    //   })
    //   StorageAPI.setOptionsStorage(multipleOptions)
    // }, [preview, display, filteredTeachers, locked, hide, selectedOption, setMultipleOptions, multipleOptions])

    useEffect(() => {
        setContentLoaded(course.classes !== undefined)
    }, [multipleOptions, setContentLoaded, course.classes])

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
                            <span>{getClassDisplayText(course, selectedClassId)} </span>
                            {!courseOption.locked && <ChevronUpDownIcon className="text-blackish h-6 w-6 dark:text-lightish" />}
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        className="bg-lightish text-darkish dark:bg-darkish dark:text-lightish"
                        ref={classSelectorContentRef}
                    >
                        {!classesLoaded ? (
                            <p className="w-100 select-none p-2 text-center">A carregar as aulas...</p>
                        ) : (
                            <>
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
                                                        {filteredTeachers?.length === 0 ? 'Apagar todos' : 'Selecionar Todos'}
                                                    </span>
                                                </DropdownMenuItem>
                                                <DropdownMenuSeparator />
                                                {allTeachers.map((option) => {
                                                    const isFiltered = (filteredTeachers.length === 0) || filteredTeachers.includes(option.professor_id)
                                                    return (
                                                        <ProfessorItem
                                                            key={`${course.acronym}-teacher-${option.professor_acronym}`}
                                                            professorInformation={option}
                                                            filtered={isFiltered}
                                                            onSelect={(e) => {
                                                                console.log("selected: ", e);
                                                                e.preventDefault()
                                                                toggleTeacher(option.professor_id)
                                                            }}
                                                        />
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
                                        getOptions().map((classInfo) => classInfoHasFilteredTeacher(classInfo) ? (
                                            <ClassItem
                                                key={`schedule-${classInfo.name}`}
                                                course_id={course.id}
                                                classInfo={classInfo}
                                                displayed={display === classInfo.id}
                                                checked={selectedOption === classInfo.id}
                                                conflict={timesCollideWithSelected(classInfo)}
                                                onSelect={() => setSelectedClassId(classInfo.id)}
                                                onMouseEnter={() => showPreview(classInfo)}
                                                onMouseLeave={() => removePreview()}
                                            />
                                        ): <></>)}
                                </DropdownMenuGroup>
                            </>
                        )}
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
