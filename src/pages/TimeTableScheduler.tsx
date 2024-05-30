import BackendAPI from '../api/backend'
import StorageAPI from '../api/storage'
import { useState, useEffect, useMemo } from 'react'
import { Schedule, Sidebar } from '../components/planner'
import { CheckedCourse, Course, CourseOption, CourseSchedule, ImportedCourses, Major, MultipleOptions } from '../@types'
import { useMajor, useCourses } from '../hooks'
import fillOptions from '../components/planner/sidebar/selectedOptionController/fillOptions'
import { useToast } from '../components/ui/use-toast'

export const removeDuplicatesFromCourseArray = (courses: CheckedCourse[]): CheckedCourse[] => {
  let frequency: Map<number, number> = new Map()
  let newCourses: CheckedCourse[] = []

  for (let course of courses) {
    if (!frequency.has(course.info.id)) {
      newCourses.push(course)
      frequency.set(course.info.id, 1)
    }
  }

  return newCourses
}

export const is_null_or_undefined = (element) => {
  return element === undefined || element === null
}

/**
 * This method serves to go to a group of checkboxes and put the correct checked value on the group checkbox
 */
export const controlCoursesGroupCheckbox = (courses: CheckedCourse[], groupCheckboxId: string) => {
  let some = courses.some((course) => course.checked)
  let every = courses.every((course) => course.checked)

  //@ts-ignore
  let checkbox: HTMLInputElement = document.getElementById(groupCheckboxId)
  if (!checkbox) return

  if (every) {
    checkbox.checked = true
    checkbox.indeterminate = false
  } else if (some) {
    checkbox.checked = false
    checkbox.indeterminate = true
  } else {
    checkbox.checked = false
    checkbox.indeterminate = false
  }
}

const TimeTableSchedulerPage = () => {
  // add check property to courses
  const courseToCheckedCourse = (majorCourses: Course[][]): CheckedCourse[][] =>
    majorCourses.map((year: Course[]) =>
      year.map((item: Course) => ({
        checked: false,
        info: item,
      }))
    )

  /**
   * Considering that the yearCourses is sorted by the course_unit_year field in ascending order, the function groups the major courses by year.
   * @param yearCourses All the courses in a major.
   * @returns The courses grouped by year.
   * @example input: [{ course: 1, year: 1 }, { course: 3, year: 1 }, { course: 2, year: 2 }]
   * @example output: [[{ course: 1, year: 1 }, { course: 3, year: 1 }], [{ course: 2, year: 2 }]]
   */
  const groupMajorCoursesByYear = (yearCourses: Course[]): Course[][] => {
    let majorCourses: Course[][] = []
    let currYear = 0
    for (let i = 0; i < yearCourses.length; i++) {
      if (yearCourses[i].course_unit_year !== currYear) {
        currYear += 1
        majorCourses.push([yearCourses[i]])
      } else {
        majorCourses[currYear - 1].push(yearCourses[i])
      }
    }
    return majorCourses
  }

  const getEmptyCourseOption = (course: CheckedCourse, schedules: CourseSchedule[]): CourseOption => {
    let teachers = []
    schedules.forEach((schedule, idx) => {
      if (schedule.lesson_type !== 'T') {
        schedule.professor_information.forEach((prof_info) => {
          if (!teachers.some((other) => other.acronym === prof_info.acronym)) {
            teachers.push(prof_info)
          }
        })
      }
    })

    return {
      shown: {
        T: true,
        TP: true,
      },
      locked: false,
      course: course,
      option: null,
      schedules: schedules,
      teachers: teachers,
      filteredTeachers: teachers,
    }
  }

  // extract only the course with checked: true
  const getPickedCourses = (courses: CheckedCourse[][]): CheckedCourse[] =>
    courses.flat().filter((course) => course?.checked)

  // fetch all schedules for the picked courses
  const fetchPickedSchedules = async (picked: CheckedCourse[]) => await BackendAPI.getCoursesSchedules(picked)

  /**
   *
   * @param courses The array of checked courses whose index 0 possibly contain the extra courses
   * @returns true if it ontains extra couruses, false otherwise
   */
  const hasExtraCourses = (courses: CheckedCourse[][]): boolean => {
    if (is_null_or_undefined(checkedCourses[0])) return false

    return checkedCourses[0].length > 0
  }

  const [major, setMajor, majorChangedRef] = useMajor('niaefeup-tts.major') // the picked major
  const [extraCoursesMajor, setExtraCoursesMajor, extraCoursesMajorChangedRef] = useMajor('niaefeup-tts.extra-major')
  const [majors, setMajors] = useState<Major[]>([]) // all the [majors]]]
  const [checkedCourses, setCheckedCourses] = useCourses('niaefeup-tts.courses') // courses for the major with frontend properties
  const [selectionModalCoursesBuffer, setSelectionModalCoursesBuffer] = useCourses('niaefeup-tts.courses-buffer')
  const [extraCoursesModalBuffer, setExtraCoursesModalBuffer] = useCourses('niaefeup-tts.extra-courses-buffer')
  const [extraMajorEqualToMainMajor, setExtraMajorEqualToMainMajor] = useState<boolean>(false)
  const [chosenMajorMainModalEqualToExtra, setChosenMajorMainModalEqualToExtra] = useState<boolean>(false)
  const [extraCoursesActive, setExtraCoursesActive] = useState<boolean>(false)
  const [multipleOptions, setMultipleOptions] = useState<MultipleOptions>({
    index: 0,
    selected: [],
    options: [],
  }) // schedule options and selected schedule
  const totalSelected = useMemo(
    () => multipleOptions.options.map((co: CourseOption[]) => co.filter((item) => item.option !== null)).flat(),
    [multipleOptions]
  )

  /**
   * If there are chosen courses, the SelectionModal will be open and closed otherwise
   */
  const getModalIsOpenValue = (easy?: boolean) => {
    if (easy) {
      return (!major || getPickedCourses(checkedCourses).length < 3) && !hasExtraCourses(checkedCourses)
    }

    return true
  }

  const [isModalOpen, setIsModalOpen] = useState<boolean>(() => getModalIsOpenValue(true))
  const [isExtraUcsModelOpen, setIsExtraUcsModalOpen] = useState<boolean>(false)
  const [importingCoursesUnitOptions, setImportingCoursesUnitOptions] = useState<ImportedCourses>(null)
  const { toast } = useToast()

  const getCoursesForMajor = (major: Major, majorChangedRef) => {
    if (major === null || (majorChangedRef.current === false && checkedCourses.length > 0)) return

    let finalNewCheckedCourses: CheckedCourse[][]

    if (checkedCourses[0] === undefined) {
      finalNewCheckedCourses = [[]]
    } else {
      finalNewCheckedCourses = [checkedCourses[0]]
    }

    BackendAPI.getCourses(major).then((courses: Course[]) => {
      const majorCourses = groupMajorCoursesByYear(courses)
      const newCheckedCourses = courseToCheckedCourse(majorCourses)
      let uCC = updateCheckedCourses(newCheckedCourses, multipleOptions.selected)
      majorChangedRef.current = false
      setCheckedCourses([...uCC])
    })
  }

  console.log("Current multiple options is: ", multipleOptions);

  useEffect(() => {
    if (totalSelected.length === 0) return
    StorageAPI.setOptionsStorage(multipleOptions)
  }, [multipleOptions, totalSelected])

  // fetch majors when component is ready
  useEffect(() => {
    document.getElementById('layout').scrollIntoView()
    BackendAPI.getMajors().then((majors: Major[]) => {
      setMajors(majors)
    })
  }, [])

  // once a major has been picked => fetch courses for the major
  useEffect(() => {
    getCoursesForMajor(major, majorChangedRef)
  }, [major, majorChangedRef, checkedCourses, setCheckedCourses])

  /**
   * Checks if the current selected extra major is the same as the main major selected in the selectionModal
   * If it is not, it will fetch the courses for the current major
   */
  useEffect(() => {
    if (is_null_or_undefined(extraCoursesMajor)) return

    if (extraCoursesMajor.acronym === major.acronym && !chosenMajorMainModalEqualToExtra) {
      setExtraMajorEqualToMainMajor(true)
    } else {
      getCoursesForMajor(extraCoursesMajor, extraCoursesMajorChangedRef)

      if (extraMajorEqualToMainMajor) setExtraMajorEqualToMainMajor(false)
    }
  }, [extraCoursesMajor, extraCoursesMajorChangedRef, checkedCourses, setCheckedCourses])

  const updateCheckedCourses = (newCheckedCourses: CheckedCourse[][], importedCourses: CourseOption[]) => {
    let extraUCs: CheckedCourse[] = []

    for (let k = 0; k < importedCourses.length; k++) {
      if (importedCourses[k].course.info.course_id !== major.id) {
        extraUCs.push(importedCourses[k].course)
        continue
      }

      for (let i = 0; i < newCheckedCourses.length; i++) {
        for (let j = 0; j < newCheckedCourses[i].length; j++) {
          if (importedCourses[k].course.info.course_unit_id === newCheckedCourses[i][j].info.course_unit_id) {
            newCheckedCourses[i][j].checked = true
            break
          }
        }
      }
    }

    newCheckedCourses = [extraUCs, ...newCheckedCourses]

    return newCheckedCourses
  }

  // fetch schedules for the courses and preserve course options (once courses have been picked)
  useEffect(() => {
    // setMultipleOptions({ index: 0, selected: [], options: [] })

    let pickedCourses = getPickedCourses(checkedCourses)
    if (pickedCourses.length === 0) return

    const storedOptions = StorageAPI.getOptionsStorage()

    const storedOptionsNotNulls = storedOptions.options
      .map((co: CourseOption[]) => co.filter((item) => item.option !== null))
      .flat()

    const correctCourses =
      pickedCourses.map((item) => item.info.id).join('-') ===
      (storedOptions.options[0] !== undefined
        ? storedOptions.options[0].map((item) => item.course.info.id).join('-')
        : '')

    if (storedOptionsNotNulls.length > 0 && correctCourses) {
      setMultipleOptions(JSON.parse(JSON.stringify(storedOptions)))
      return
    }

    const findPreviousEntry = (prevSelected: CourseOption[], course: CheckedCourse) => {
      const value = prevSelected.find((item) => item.course.info.course_unit_id === course.info.course_unit_id)
      return value
        ? { shown: value.shown, option: value.option, locked: value.locked }
        : { shown: { T: true, TP: true }, option: null, locked: false }
    }

    let isNewerPromise = true

    // CHANGE
    if (isExtraUcsModelOpen) {
      pickedCourses = pickedCourses.concat(selectionModalCoursesBuffer.flat().filter((course) => course.checked))
      pickedCourses = removeDuplicatesFromCourseArray(pickedCourses)
    }

    //TODO: I only want to fetch if I check a course and not when I uncheck one
    fetchPickedSchedules(pickedCourses).then((schedules: CourseSchedule[][]) => {
      if (isNewerPromise) {
        setMultipleOptions((prev) => {
          let newCourseOptions: CourseOption[] = []
          const notNulls = prev.selected.filter((item) => item.option !== null)

          let teachers = Array.apply(null, Array(schedules.length)).map(function () {
            return []
          })
          schedules.forEach((schedule, idx) => {
            schedule.forEach((classes) => {
              if (classes.lesson_type !== 'T') {
                classes.professor_information.forEach((prof_info) => {
                  if (!teachers[idx].some((other) => other.acronym === prof_info.acronym)) {
                    teachers[idx].push(prof_info)
                  }
                })
              }
            })
          })

          if (notNulls.length > 0) {
            for (let i = 0; i < pickedCourses.length; i++) {
              const co = findPreviousEntry(prev.selected, pickedCourses[i])
              newCourseOptions.push({
                shown: co.shown,
                locked: co.locked,
                course: pickedCourses[i],
                option: co.option,
                schedules: schedules[i],
                teachers: teachers[i],
                filteredTeachers: teachers[i],
              })
            }
          } else {
            for (let i = 0; i < pickedCourses.length; i++) {
              newCourseOptions.push(getEmptyCourseOption(pickedCourses[i], schedules[i]))
            }
          }

          let filler: CourseOption[] = []
          for (let i = 0; i < pickedCourses.length; i++)
            filler.push(getEmptyCourseOption(pickedCourses[i], schedules[i]))

          let newOptions: CourseOption[][] = []
          for (let i = 0; i < 10; i++) {
            if (i === prev.index) newOptions.push(newCourseOptions)
            else {
              if (prev.options.length === 0) newOptions.push(JSON.parse(JSON.stringify(filler))) // deep copy
              else {
                const innerNotNulls = prev.options[i].filter((item) => item.option !== null)
                if (innerNotNulls.length > 0) {
                  let extraCourseOptions: CourseOption[] = []
                  for (let j = 0; j < pickedCourses.length; j++) {
                    const co = findPreviousEntry(prev.options[i], pickedCourses[j])
                    extraCourseOptions.push({
                      shown: co.shown,
                      locked: co.locked,
                      course: pickedCourses[j],
                      option: co.option,
                      schedules: schedules[j],
                      teachers: teachers[i],
                      filteredTeachers: teachers[i],
                    })
                  }
                  newOptions.push(JSON.parse(JSON.stringify(extraCourseOptions)))
                } else newOptions.push(JSON.parse(JSON.stringify(filler)))
              }
            }
          }

          return {
            index: prev.index,
            selected: newCourseOptions,
            options: newOptions,
          }
        })

        // If the change on checked courses was trigged by importing an option, fill the options with the importing option
        if (importingCoursesUnitOptions !== null) {
          fillOptions(importingCoursesUnitOptions, setMultipleOptions)
          toast({
            title: 'Horário colado!',
            description: 'A opção foi colada com sucesso',
            duration: 1500,
          })
        }
      }
    })

    // assure correct value of extraCoursesActive when we see changes in checkedCourses
    if (checkedCourses.length > 0 && !is_null_or_undefined(checkedCourses[0])) {
      let isExtraCoursesColumnSupposedToShow = checkedCourses[0].length > 0 && !is_null_or_undefined(checkedCourses[0])

      isExtraCoursesColumnSupposedToShow ? setExtraCoursesActive(true) : setExtraCoursesActive(false)
    }

    return () => {
      isNewerPromise = false
    }
  }, [checkedCourses])

  // This function will check a the course units of the provided course_unit_id numbers
  const checkCourses = (course_unit_id: number[], importedCourses: ImportedCourses = null) => {
    setImportingCoursesUnitOptions(importedCourses)

    let newCheckedCourses = [...checkedCourses]

    for (let i = 0; i < newCheckedCourses.length; i++) {
      for (let j = 0; j < newCheckedCourses[i].length; j++) {
        if (course_unit_id.includes(newCheckedCourses[i][j].info.course_unit_id)) {
          newCheckedCourses[i][j].checked = true
        }
      }
    }

    setCheckedCourses(newCheckedCourses)
  }

  return (
    <div className="grid w-full grid-cols-12 gap-x-4 gap-y-4 px-4 py-4">
      {/* Schedule Preview */}
      <div className="schedule">
        <div className="h-full w-full">
          <Schedule courseOptions={multipleOptions.selected} />
        </div>
      </div>

      {/* Sidebar */}
      <Sidebar
        majors={majors}
        openHook={[isModalOpen, setIsModalOpen]}
        majorHook={[major, setMajor]}
        coursesHook={[checkedCourses, setCheckedCourses]}
        extraCoursesActiveHook={[extraCoursesActive, setExtraCoursesActive]}
        extraCoursesModalOpenHook={[isExtraUcsModelOpen, setIsExtraUcsModalOpen]}
        sourceBufferHook={[selectionModalCoursesBuffer, setSelectionModalCoursesBuffer]}
        destBufferHook={[extraCoursesModalBuffer, setExtraCoursesModalBuffer]}
        repeatedCourseControlHook={[chosenMajorMainModalEqualToExtra, setChosenMajorMainModalEqualToExtra]}
        multipleOptionsHook={[multipleOptions, setMultipleOptions]}
        checkCourses={checkCourses}
      />
    </div>
  )
}

export default TimeTableSchedulerPage
