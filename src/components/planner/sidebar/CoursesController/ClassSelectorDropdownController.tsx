import { User } from "lucide-react";
import { Dispatch, SetStateAction, useContext, useEffect, useMemo, useState } from "react";
import { ClassInfo, CourseInfo, CourseOption, ProfessorInfo } from "../../../../@types";
import CourseContext from "../../../../contexts/CourseContext";
import MultipleOptionsContext from "../../../../contexts/MultipleOptionsContext";
import { getAllPickedSlots, schedulesConflict, teacherIdsFromCourseInfo, uniqueTeachersFromCourseInfo } from "../../../../utils";
import { DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from "../../../ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../ui/tabs";
import ClassItem from "./ClassItem";
import ProfessorItem from "./ProfessorItem";

type Props = {
  course: CourseInfo
  selectedClassIdHook: [number | null, Dispatch<SetStateAction<number | null>>]
  previewHook: [number | null, Dispatch<SetStateAction<number | null>>]
  display: number
  removePreview: Function
  contentRef: any
  triggerRef: any
}

const buildTeacherFilters = (teachers, filteredTeachers) => {
  if (!filteredTeachers) return [];

  return teachers.map((teacher) => {
    return {
      ...teacher,
      isFiltered: filteredTeachers.includes(teacher.id)
    }
  })
}

const ClassSelectorDropdownController = ({
  course,
  selectedClassIdHook,
  previewHook,
  display,
  removePreview,
  contentRef,
  triggerRef
}: Props) => {
  const { multipleOptions, setMultipleOptions, selectedOption } = useContext(MultipleOptionsContext);
  const { pickedCourses, setPickedCourses, choosingNewCourse } = useContext(CourseContext);
  const [selectedClassId, setSelectedClassId] = selectedClassIdHook;
  const [preview, setPreview] = previewHook;

  // This is used to store the ids of the teachers so it is easy to verify if a teacher is filtered or not
  const [filteredTeachers, setFilteredTeachers] = useState(teacherIdsFromCourseInfo(course));

  /**
      * This is used to retrieve the teachers from a course and to populate the filter of the teachers
      * which is the dropdown menu that appears by clicking on "Professores" on the class selector dropdown
     */
  const teachers = useMemo(() => {
    if (!course.classes) return []

    return uniqueTeachersFromCourseInfo(course);
  }, [course.classes])

  // This is used as an object with the teacher properties in order for us to being able
  // to show teacher information on the filter dropdown menu
  const [teacherFilters, setTeacherFilters] = useState(() => {
    return buildTeacherFilters(teachers, filteredTeachers);
  });

  const courseOption: CourseOption = multipleOptions[selectedOption].course_options.find((opt) => opt.course_id === course.id)
  if (courseOption)
    courseOption.filteredTeachers = [...teacherIdsFromCourseInfo(course)];

  //(thePeras): Classes options should be a new state
  /**
   * Return the classes options filtered by the selected teachers
   * Classes with at least one of its teachers selected will be returned
   */
  const getOptions = (): Array<ClassInfo> => {
    return course.classes?.filter((c) => {
      return c.slots.some((slot) => slot.professors.filter((prof) => filteredTeachers?.includes(prof.id)).length > 0)
    })
  }

  useEffect(() => {
    setFilteredTeachers(teacherIdsFromCourseInfo(course));
  }, [pickedCourses])

  useEffect(() => {
    setTeacherFilters(() => {
      return buildTeacherFilters(teachers, filteredTeachers);
    });
  }, [filteredTeachers])

  useEffect(() => {
    setFilteredTeachers(courseOption?.filteredTeachers);
  }, [choosingNewCourse])

  useEffect(() => {
    if (triggerRef.current && contentRef.current) {
      contentRef.current.style.width = `${triggerRef.current.offsetWidth}px`
    }
  }, [])

  const deleteOption = () => {
    const multipleOptionsEntry = multipleOptions[selectedOption].course_options.find((option) => option.picked_class_id === selectedClassId);
    multipleOptionsEntry.picked_class_id = null;
    setSelectedClassId(null);
    setMultipleOptions([...multipleOptions]);
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

  // Puts inside the preview the actual selected class so we can then restore it later after the user stops
  // previewing
  const showPreview = (classInfo: ClassInfo) => {
    const newMultipleOptions = [...multipleOptions];
    const newCourseOptions: CourseOption[] = newMultipleOptions[selectedOption].course_options.map((c: CourseOption) => {
      if (c.course_id === course.id) {
        setPreview(classInfo.id)
        c.picked_class_id = classInfo.id
      }

      return c;
    });

    newMultipleOptions[selectedOption].course_options = newCourseOptions;
    setMultipleOptions(newMultipleOptions)
  }

  // Checks if any of the selected classes have time conflicts with the classInfo
  // This is used to display a warning icon in each class of the dropdown in case of conflicts
  const timesCollideWithSelected = (classInfo: ClassInfo) => {
    const pickedSlots = getAllPickedSlots(pickedCourses, multipleOptions[selectedOption])
    return pickedSlots.some((slot) => classInfo.slots.some((currentSlot) => schedulesConflict(slot, currentSlot)))
  }

  return <>
    <div>
      {course.classes === null ? (
        <p className="w-100 select-none p-2 text-center">A carregar as aulas...</p>
      ) : (
        <>
          {/* Desktop */}
          <div className="hidden lg:block">
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
                    preview={preview}
                    conflict={timesCollideWithSelected(classInfo)}
                    onSelect={() => {
                      setSelectedClassId(classInfo.id)
                      setPreview(null)
                    }}
                    onMouseEnter={() => showPreview(classInfo)}
                    onMouseLeave={() => removePreview()}
                  />
                ))}
            </DropdownMenuGroup>
          </div>

          {/*Mobile*/}
          <div className="block lg:hidden">
            <Tabs defaultValue="turmas" className="w-full">
              <TabsList className="w-full">
                <TabsTrigger value="turmas">Turmas</TabsTrigger>
                <TabsTrigger value="professores">Professores</TabsTrigger>
              </TabsList>
              <TabsContent value="turmas">
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
                        preview={preview}
                        conflict={timesCollideWithSelected(classInfo)}
                        onSelect={() => {
                          setSelectedClassId(classInfo.id)
                          setPreview(null)
                        }}
                        onMouseEnter={() => showPreview(classInfo)}
                        onMouseLeave={() => removePreview()}
                      />
                    ))}
                </DropdownMenuGroup>
              </TabsContent>
              <TabsContent value="professores">
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    className="mb-2"
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
                </DropdownMenuGroup>
              </TabsContent>
            </Tabs>
          </div>
        </>
      )}
    </div>
  </>
}

export default ClassSelectorDropdownController;
