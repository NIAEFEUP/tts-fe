import { Dispatch, SetStateAction, useContext, useEffect, useMemo, useState } from 'react'
import { ClassInfo, CourseInfo, CourseOption, ProfessorInfo } from '../../../../@types'
import StorageAPI from '../../../../api/storage'
import CourseContext from '../../../../contexts/CourseContext'
import MultipleOptionsContext from '../../../../contexts/MultipleOptionsContext'
import { teacherIdsFromCourseInfo, uniqueTeachersFromCourseInfo } from '../../../../utils'
import { Desert } from '../../../svgs'
import { Menu } from '../../../ui/new/menu'
import { Tabs } from '../../../ui/new/tabs'
import ClassItem from './ClassItem'
import ProfessorItem from './ProfessorItem'

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
  if (!filteredTeachers) return []

  return teachers.map((teacher) => {
    return {
      ...teacher,
      isFiltered: filteredTeachers.includes(teacher.id),
    }
  })
}

const NoTeachersFound = ({ mobile }: { mobile: boolean }) => {
  return (
    <div className="mx-2 w-full">
      {mobile ? <></> : <Desert className="w-full h-24" />}
      <p className="text-sm text-left my-4 w-full">Não há professores associados a nenhuma turma desta disciplina.</p>
    </div>
  )
}

const NoOptionsFound = ({ mobile }: { mobile: boolean }) => {
  return (
    <div className="w-full">
      {mobile ? <></> : <Desert className="w-full h-24" />}
      <p className="text-sm text-left my-4 w-full">Esta disciplina não tem nenhuma turma.</p>
    </div>
  )
}

const ClassSelectorDropdownController = ({
  course,
  selectedClassIdHook,
  isDropdownOpen,
  setPreview,
  removePreview,
  contentRef,
  triggerRef,
  classesLoading,
}: Props) => {
  const { multipleOptions, setMultipleOptions, selectedOption } = useContext(MultipleOptionsContext)
  const { pickedCourses } = useContext(CourseContext)
  const [selectedClassId, setSelectedClassId] = selectedClassIdHook

  const [filteredTeachers, setFilteredTeachers] = useState<Array<number>>(() => {
    return StorageAPI.getCourseFilteredTeachersStorage(selectedOption, course.id) ?? teacherIdsFromCourseInfo(course)
  })

  useEffect(() => {
    const newMultipleOptions = [...multipleOptions]
    const courseOption = newMultipleOptions[selectedOption]?.course_options?.find(
      (option) => option.course_id === course.id,
    )
    if (courseOption) {
      courseOption.filteredTeachers = filteredTeachers
      setMultipleOptions(newMultipleOptions)
    }
  }, [filteredTeachers])

  /**
   * This is used to retrieve the teachers from a course and to populate the filter of the teachers
   * which is the dropdown menu that appears by clicking on "Professores" on the class selector dropdown
   */
  const teachers = useMemo(() => {
    if (!course.classes) return []

    return uniqueTeachersFromCourseInfo(course)
  }, [course.classes])

  // This is used as an object with the teacher properties in order for us to being able
  // to show teacher information on the filter dropdown menu
  const [teacherFilters, setTeacherFilters] = useState(() => {
    return buildTeacherFilters(teachers, filteredTeachers)
  })

  //(thePeras): Classes options should be a new state
  /**
   * Return the classes options filtered by the selected teachers
   * Classes with at least one of its teachers selected will be returned
   */
  const getOptions = (): Array<ClassInfo> => {
    return course.classes?.filter((c) => {
      return c.slots.some(
        (slot) =>
          slot.professors.length === 0 ||
          slot.professors.filter((prof) => filteredTeachers?.includes(prof.id)).length > 0,
      )
    })
  }

  useEffect(() => {
    if (filteredTeachers.length === 0) {
      setFilteredTeachers(teacherIdsFromCourseInfo(course))
    }
  }, [pickedCourses])

  useEffect(() => {
    setTeacherFilters(() => {
      return buildTeacherFilters(teachers, filteredTeachers)
    })
  }, [filteredTeachers])

  useEffect(() => {
    if (triggerRef.current && contentRef.current) {
      contentRef.current.style.width = `${triggerRef.current.offsetWidth}px`
    }
  }, [])

  const deleteOption = () => {
    const multipleOptionsEntry = multipleOptions[selectedOption].course_options.find(
      (option) => option.picked_class_id === selectedClassId,
    )
    multipleOptionsEntry.picked_class_id = null
    setSelectedClassId(null)
    setMultipleOptions([...multipleOptions])
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
    const newMultipleOptions = [...multipleOptions]
    const newCourseOptions: CourseOption[] = newMultipleOptions[selectedOption].course_options.map(
      (c: CourseOption) => {
        if (c.course_id === course.id) {
          setPreview(classInfo.id)
          c.picked_class_id = classInfo.id
        }

        return c
      },
    )

    newMultipleOptions[selectedOption].course_options = newCourseOptions
    setMultipleOptions(newMultipleOptions)
  }

  return (
    <>
      <div className="p-2 w-full">
        {classesLoading ? (
          <p className="w-full select-none p-2 text-left">A carregar as aulas...</p>
        ) : (
          <Tabs className="w-full">
            <Tabs.Items className="w-full">
              <Tabs.Item className="flex-1">Turmas</Tabs.Item>
              <Tabs.Item className="flex-1">Professores</Tabs.Item>
            </Tabs.Items>
            <Tabs.Panels>
              <Tabs.Panel>
                {/* Removed max-h-96 and overflow-y-auto to fix the double scrollbar issue */}
                <div className="pt-2 w-full">
                  {course.classes?.length === 0 ? (
                    <NoOptionsFound mobile={false} />
                  ) : (
                    <>
                      {selectedClassId && (
                        <Menu.Item onSelect={() => deleteOption()}>
                          <span className="text-sm tracking-tighter text-left block w-full">Remover Seleção</span>
                        </Menu.Item>
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
                            onMouseEnter={() => {
                              if (isDropdownOpen) showPreview(classInfo)
                            }}
                            onMouseLeave={() => removePreview()}
                          />
                        ))}
                    </>
                  )}
                </div>
              </Tabs.Panel>
              <Tabs.Panel>
                <div className="pt-2 w-full">
                  {teacherFilters.length === 0 ? (
                    <NoTeachersFound mobile={false} />
                  ) : (
                    <>
                      <Menu.Item
                        className="mb-2"
                        onClick={(e) => {
                          e.preventDefault()
                          toggleAllTeachers(teachers)
                        }}
                      >
                        <span className="block truncate text-left w-full dark:text-white">
                          {filteredTeachers?.length > 0 ? 'Apagar todos' : 'Selecionar Todos'}
                        </span>
                      </Menu.Item>
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
                    </>
                  )}
                </div>
              </Tabs.Panel>
            </Tabs.Panels>
          </Tabs>
        )}
      </div>
    </>
  )
}

export default ClassSelectorDropdownController
