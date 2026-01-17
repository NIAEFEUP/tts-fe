import { User } from "lucide-react";
import { Dispatch, SetStateAction, useContext, useEffect, useMemo, useState } from "react";
import { ClassInfo, CourseInfo, CourseOption, ProfessorInfo } from "../../../../@types";
import StorageAPI from "../../../../api/storage";
import CourseContext from "../../../../contexts/CourseContext";
import MultipleOptionsContext from "../../../../contexts/MultipleOptionsContext";
import { teacherIdsFromCourseInfo, uniqueTeachersFromCourseInfo } from "../../../../utils";
import { Desert } from "../../../svgs";
import { DropdownMenuGroup, DropdownMenuItem, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from "../../../ui/dropdown-menu";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../ui/tabs";
import ClassItem from "./ClassItem";
import ProfessorItem from "./ProfessorItem";

type Props = {
  course: CourseInfo
  selectedClassIdHook: [number | null, Dispatch<SetStateAction<number | null>>]
  isDropdownOpen: boolean
  setPreview: Dispatch<SetStateAction<number | null>>
  removePreview: () => void
  contentRef: any
  triggerRef: any
  classesLoading: boolean
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

const NoTeachersFound = ({ mobile }: { mobile: boolean }) => {
  return <div className="mx-2">
    {mobile ? <></> : <Desert className="w-full h-24" />}
    <p className="text-sm text-center my-4">Não há professores associados a nenhuma turma desta disciplina.</p>
  </div>
}

const NoOptionsFound = ({ mobile }: { mobile: boolean }) => {
  return <div>
    {mobile ? <></> : <Desert className="w-full h-24" />}
    <p className="text-sm text-center my-4">Esta disciplina não tem nenhuma turma.</p>
  </div>
}

const ClassSelectorDropdownController = ({
  course,
  selectedClassIdHook,
  isDropdownOpen,
  setPreview,
  removePreview,
  contentRef,
  triggerRef,
  classesLoading
}: Props) => {
  const { multipleOptions, setMultipleOptions, selectedOption } = useContext(MultipleOptionsContext);
  const { pickedCourses } = useContext(CourseContext);
  const [selectedClassId, setSelectedClassId] = selectedClassIdHook;


  const [filteredTeachers, setFilteredTeachers] = useState<Array<number>>(() => {
    return StorageAPI.getCourseFilteredTeachersStorage(selectedOption, course.id) ?? teacherIdsFromCourseInfo(course)
  });

  useEffect(() => {
    const newMultipleOptions = [...multipleOptions];
    const courseOption = newMultipleOptions[selectedOption]?.course_options?.find((option) => option.course_id === course.id);
    if (courseOption) {
      courseOption.filteredTeachers = filteredTeachers;
      setMultipleOptions(newMultipleOptions);
    }
  }, [filteredTeachers]);


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

  //(thePeras): Classes options should be a new state
  /**
   * Return the classes options filtered by the selected teachers
   * Classes with at least one of its teachers selected will be returned
   */
  const getOptions = (): Array<ClassInfo> => {
    return course.classes?.filter((c) => {
      return c.slots.some((slot) => slot.professors.length === 0
        || slot.professors.filter((prof) => filteredTeachers?.includes(prof.id)).length > 0)
    })
  }

  useEffect(() => {
    if (filteredTeachers.length === 0) {
      setFilteredTeachers(teacherIdsFromCourseInfo(course));
    }
  }, [pickedCourses])

  useEffect(() => {
    setTeacherFilters(() => {
      return buildTeacherFilters(teachers, filteredTeachers);
    });
  }, [filteredTeachers])

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

  return <>
    <div>
      {classesLoading ? (
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
                    {teacherFilters.length === 0
                      ? <NoTeachersFound mobile={false} />
                      : <>
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
                      </>}
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup className="max-h-96 overflow-y-auto">
              {!course.classes || course.classes.length === 0
                ? <NoOptionsFound mobile={false} />
                : <>
                  {selectedClassId && (
                    <DropdownMenuItem onSelect={() => deleteOption()}>
                      <span className="text-sm tracking-tighter">Remover Seleção</span>
                    </DropdownMenuItem>
                  )}
                  {course.classes &&
                    getOptions().map((classInfo) => (
                      <ClassItem
                        key={`schedule-${classInfo.name}`}
                        course_id={course.id}
                        classInfo={classInfo}
                        onSelect={() => {
                          setSelectedClassId(classInfo.id)
                          setPreview(null)
                        }}
                        onMouseEnter={() => { if (isDropdownOpen) showPreview(classInfo) }}
                        onMouseLeave={() => removePreview()}
                      />
                    ))}
                </>}
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
                  {course.classes?.length === 0
                    ? <NoOptionsFound mobile={true} />
                    : <>
                      <DropdownMenuItem onSelect={() => deleteOption()}>
                        <span className="text-sm tracking-tighter">Remover Seleção</span>
                      </DropdownMenuItem>
                      {course.classes &&
                        getOptions().map((classInfo) => (
                          <ClassItem
                            key={`schedule-${classInfo.name}`}
                            course_id={course.id}
                            classInfo={classInfo}
                            onSelect={() => {
                              setSelectedClassId(classInfo.id)
                              setPreview(null)
                            }}
                            onMouseEnter={() => { if (isDropdownOpen) showPreview(classInfo) }}
                            onMouseLeave={() => removePreview()}
                          />
                        ))}
                    </>}
                </DropdownMenuGroup>
              </TabsContent>
              <TabsContent value="professores">
                <DropdownMenuGroup>
                  {teacherFilters.length === 0 ?
                    <NoTeachersFound mobile={true} /> : <>
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
                    </>}
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
