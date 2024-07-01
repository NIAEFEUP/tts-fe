import { useEffect, useMemo, useRef, useState, useContext } from 'react'
import { ChevronUpDownIcon, LockClosedIcon, LockOpenIcon } from '@heroicons//react/24/solid'
import { User } from 'lucide-react'
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
import { CourseInfo, ClassInfo, ProfessorInfo, CourseOption } from '../../../../@types/new_index'
import MultipleOptionsContext from '../../../../contexts/MultipleOptionsContext'
import CourseContext from '../../../../contexts/CourseContext'
import ProfessorItem from './ProfessorItem'
import ClassItem from './ClassItem'
import { teacherIdsFromCourseInfo, uniqueTeachersFromCourseInfo } from '../../../../utils/CourseInfo'

type Props = {
  course: CourseInfo
}

const buildTeacherFilters = (teachers, filteredTeachers) => {
  return teachers.map((teacher) => {
    return {
      ...teacher,
      isFiltered: filteredTeachers.includes(teacher.id)
    }
  })
}

const ClassSelector = ({ course }: Props) => {
  const classSelectorTriggerRef = useRef(null)
  const classSelectorContentRef = useRef(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const { multipleOptions, setMultipleOptions, selectedOption, setSelectedOption } = useContext(MultipleOptionsContext)
  const { pickedCourses, choosingNewCourse } = useContext(CourseContext)

  const [selectedClassId, setSelectedClassId] = useState<number | null>(null);

  const courseOption: CourseOption = multipleOptions[selectedOption].course_options.find((opt) => opt.course_id === course.id)
  courseOption.filteredTeachers = [...teacherIdsFromCourseInfo(course)];

  /**
   * This is used to retrieve the teachers from a course and to populate the filter of the teachers
   * which is the dropdown menu that appears by clicking on "Professores" on the class selector dropdown
  */
  const teachers = useMemo(() => {
    if (!course.classes) return []

    return uniqueTeachersFromCourseInfo(course);
  }, [course.classes])

  // This is used to store the ids of the teachers so it is easy to verify if a teacher is filtered or not
  const [filteredTeachers, setFilteredTeachers] = useState(teacherIdsFromCourseInfo(course));

  // This is used as an object with the teacher properties in order for us to being able
  // to show teacher information on the filter dropdown menu
  const [teacherFilters, setTeacherFilters] = useState(() => {
    return buildTeacherFilters(teachers, filteredTeachers);
  });

  const [locked, setLocked] = useState(courseOption.locked)
  const [hide, setHide] = useState(courseOption.hide)

  const [preview, setPreview] = useState<number | null>(null)
  const [display, setDisplay] = useState(courseOption.picked_class_id)


  const deleteOption = () => {
    console.log("delete option called");
    const multipleOptionsEntry = multipleOptions[selectedOption].course_options.find((option) => option.picked_class_id === selectedClassId);
    multipleOptionsEntry.picked_class_id = null;
    setSelectedClassId(null);
    setMultipleOptions([...multipleOptions]);
  }

  useEffect(() => {
    const course_options = multipleOptions[selectedOption].course_options;
    const option = course_options.filter((option) => option.course_id === course.id && option.picked_class_id !== null)

    if (!option[0]) {
      setSelectedClassId(null);
      return;
    }

    setSelectedClassId(option[0].picked_class_id);
    setDisplay(option[0].picked_class_id);
  }, [selectedOption, multipleOptions, course.id]);

  useEffect(() => {
    setTeacherFilters(() => {
      return buildTeacherFilters(teachers, filteredTeachers);
    });
  }, [filteredTeachers])

  /**
   * This useEffect is used to make the dropdown content width match the trigger width
   */
  useEffect(() => {
    if (classSelectorTriggerRef.current && classSelectorContentRef.current) {
      classSelectorContentRef.current.style.width = `${classSelectorTriggerRef.current.offsetWidth}px`
    }
  }, [isDropdownOpen])

  const classInfoHasFilteredTeacher = (classInfo: ClassInfo) => classInfo.slots.some((slot) => slot.professors.some((professor) => !filteredTeachers.includes(professor.id)));

  const getOptions = (): Array<ClassInfo> => {
      return course.classes?.filter((c) => {
        return c.filteredTeachers?.every((element) => filteredTeachers.includes(element));
    })
  }

  useEffect(() => {
    setFilteredTeachers(courseOption.filteredTeachers);
  }, [choosingNewCourse])

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

  const showPreview = (classInfo: ClassInfo) => {
    const newMultipleOptions = [...multipleOptions];
    const newCourseOptions: CourseOption[] = newMultipleOptions[selectedOption].course_options.map((c: CourseOption) => {
      if(c.course_id === course.id) {
        setPreview(c.course_id)
        c.picked_class_id = classInfo.id
      }
      
      return c;
    });

    newMultipleOptions[selectedOption].course_options = newCourseOptions;
    setMultipleOptions(newMultipleOptions)
  }

  const removePreview = () => {
    /*const newMultipleOptions = [...multipleOptions];
    const newCourseOptions: CourseOption[] = newMultipleOptions[selectedOption].course_options.map((c: CourseOption) => {
      if(c.course_id === course.id) {
        c.picked_class_id = preview
      }
      
      return c;
    });
    newMultipleOptions[selectedOption].course_options = newCourseOptions;
    setMultipleOptions(newMultipleOptions)*/
    
    setSelectedClassId(preview)
    setPreview(null)
  }

  function toggleTeacher(id: number) {
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
            {course.classes === null ? (
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
                            toggleAllTeachers(teachers)
                          }}
                        >
                          <span className="block truncate dark:text-white">
                            {filteredTeachers?.length > 0 ? 'Apagar todos' : 'Selecionar Todos'}
                          </span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {teacherFilters.map((option) => {
                          return (
                            <ProfessorItem
                              key={`${course.acronym}-teacher-${option.acronym}`}
                              professorInformation={option}
                              filtered={option.isFiltered}
                              onSelect={(e) => {
                                e.preventDefault()
                                toggleTeacher(option.id)
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
                  <DropdownMenuItem onSelect={() => deleteOption()}>
                    <span className="text-sm tracking-tighter">Remover Seleção</span>
                  </DropdownMenuItem>
                  {course.classes &&
                    getOptions().map((classInfo) => (
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
                    ))}
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
