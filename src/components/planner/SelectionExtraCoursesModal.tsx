import classNames from 'classnames'
import { Combobox, Dialog, Transition } from '@headlessui/react'
import { Fragment, SetStateAction, useEffect, useState, useRef } from 'react'
import Alert, { AlertType } from './Alert'
import { CheckedCourse, Course, Major, MultipleOptions } from '../../@types'
import { getSchoolYear, getSemester } from '../../utils'
import {
  AcademicCapIcon,
  CheckIcon,
  SelectorIcon,
  ArrowCircleLeftIcon,
} from '@heroicons/react/solid'
import { controlCoursesGroupCheckbox, is_null_or_undefined } from '../../pages/TimeTableScheduler'
import { MajorSearchCombobox } from './MajorSearchCombobox'

type Props = {
  majors: Major[]
  openHook: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
  majorHook: [Major, React.Dispatch<React.SetStateAction<Major>>]
  coursesHook: [CheckedCourse[][], React.Dispatch<React.SetStateAction<CheckedCourse[][]>>]
  sourceBufferHook: [CheckedCourse[][], React.Dispatch<React.SetStateAction<CheckedCourse[][]>>]
  destBufferHook: [CheckedCourse[][], React.Dispatch<React.SetStateAction<CheckedCourse[][]>>]
  multipleOptionsHook: [MultipleOptions, React.Dispatch<React.SetStateAction<MultipleOptions>>]
  repeatedCourseControlHook: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
}

/**
 * Modal where the user will be able to select courses from a different major than its main one
 */
const SelectionExtraCoursesModal = 
  ({ majors, openHook, majorHook, coursesHook, sourceBufferHook, destBufferHook, multipleOptionsHook, repeatedCourseControlHook }: Props) => {
  const [major, setMajor] = majorHook
  const [isThisOpen, setisThisOpen] = openHook
  const [courses, setCourses] = coursesHook
  const [extraCoursesModalBuffer, setExtraCoursesModalBuffer] = sourceBufferHook
  const [selectionModalCoursesBuffer, setSelectionModalCoursesBuffer] = destBufferHook
  const [multipleOptions, setMultipleOptions] = multipleOptionsHook
  const [extraMajorEqualToMainMajor, setExtraMajorEqualToMainMajor] = repeatedCourseControlHook

  const [majorQuery, setMajorQuery] = useState<string>('')
  //const [extraCoursesQuery, setExtraCoursesQuery] = useState<string>('')
  const [alertLevel, setAlertLevel] = useState<AlertType>(AlertType.info)
  const atLeastOneCourse = courses.some((item) => item?.some((course) => course.checked))

  const closeModal = () => {
    if (major?.name === '' || !atLeastOneCourse)
      setAlertLevel(AlertType.warning)

    setExtraCoursesModalBuffer([...courses])
    setCourses([courses[0], ...selectionModalCoursesBuffer])

    setisThisOpen(false)
  }

  /**
   * If the user checked a single course, if the user checked it to true, it adds to the index 0 of the courses array
   * Otherwise it removes it
   */
  const handleCheck = (event: React.ChangeEvent<HTMLInputElement>, year: number, courseIdx: number) => {
    courses[year + 1][courseIdx].checked = event.target.checked

    if (event.target.checked) {
      let course_to_add: CheckedCourse = courses[year + 1][courseIdx]
      course_to_add.checked = true

      is_null_or_undefined(courses[0])
        ? courses[0] = [course_to_add]
        : courses[0].push(course_to_add)
    } else {
      let course_to_remove: CheckedCourse = courses[year + 1][courseIdx]
      let remove_index: number = courses[0].findIndex(course => course.info.course_unit_id === course_to_remove.info.course_unit_id)

      course_to_remove.checked = false
      courses[0].splice(remove_index, 1)
    }

    setCourses([...courses])
  }

  const handleCheckGroup = (event: React.ChangeEvent<HTMLInputElement>, year: number) => {

    if (event.target.checked) {
      courses[year].forEach((course: CheckedCourse) => {
        let course_already_in_extra_subarray = 
          courses[0].findIndex(extra_course => extra_course.info.course_unit_id === course.info.course_unit_id) == -1
        
        if(course_already_in_extra_subarray)
          courses[0].push(course)

        course.checked = event.target.checked
      })

    } else {
      courses[year].forEach((course: CheckedCourse) => {
        course.checked = event.target.checked

        courses[0].splice(courses[0].findIndex(related_course => related_course.info.course_unit_id === course.info.course_unit_id), 1)
      })
    }

    setCourses([...courses])
  }

  const isCourseChecked = (course: CheckedCourse, yearIdx: number, courseIdx: number) => {
    let courses_have_valid_value: boolean = !(is_null_or_undefined(courses[0])) && courses[0].length > 0

    return courses_have_valid_value 
      && (isExtraCourseSet(course) || (isExtraCourseSet(course) && courses[yearIdx + 1][courseIdx].checked))
  }

  useEffect(() => {
    setMajorQuery((prev) => `${prev} `)
  }, [])

  useEffect(() => {
    if (major?.name !== '' && atLeastOneCourse) setAlertLevel(AlertType.success)
    else setAlertLevel(AlertType.info)
  }, [major, courses, atLeastOneCourse])

  useEffect(() => {
    // Regular courses
    for (let year = 1; year < courses.length; year++) {
      controlCoursesGroupCheckbox(courses[year], `year-checkbox-${year - 1}`)
    }
  }, [courses])

  /**
   * If there is a least an extra course (course inside courses[0]) checked, it returns true
   */
  const isExtraCourseSet = (course: CheckedCourse): boolean => {
    if (is_null_or_undefined(courses[0]) || courses[0].length === 0)
      return false

    let possible_course_index: number = courses[0].findIndex(
      related_course => related_course.info.course_unit_id === course.info.course_unit_id)

    if (possible_course_index !== -1) {
      return courses[0][possible_course_index].checked
    }

    return false
  }

  return (
    <>
      <Transition appear show={isThisOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <OuterMask />
          <div className="fixed inset-0 bottom-0 overflow-y-auto xl:bottom-12">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <InnerCustomTransition>
                <Dialog.Panel
                  className={classNames(
                    'w-full max-w-6xl transform space-y-2 rounded-2xl p-4 text-left lg:space-y-3 lg:p-6',
                    'bg-lightest align-middle shadow-xl transition-all dark:bg-dark'
                  )}
                >
                  {/* Header */}
                  <Dialog.Title
                    as="header"
                    className="mb-2 flex w-full items-center justify-between space-x-2 text-center font-medium lg:mb-3"
                  >
                    <div className="flex items-center justify-start space-x-1">
                      <AcademicCapIcon className="h-6 w-6 text-sky-700" aria-hidden="true" />
                      <h3 className="flex text-xl font-semibold leading-6 tracking-tight dark:text-white lg:hidden">
                        UCs
                      </h3>
                      <h3 className="hidden text-xl font-semibold leading-6 tracking-tight dark:text-white lg:flex">
                        + Escolha de UCs de outros cursos
                      </h3>
                    </div>

                    <div className="flex items-center justify-start space-x-2">
                      <span
                        title="Semestre"
                        className="rounded bg-sky-700 px-3 py-1 text-sm text-white transition-all duration-500"
                      >
                        {`${getSemester()}ºS`}
                      </span>
                      <span
                        title="Ano Letivo"
                        className="rounded bg-sky-700 px-3 py-1 text-sm text-white transition-all duration-500"
                      >
                        {getSchoolYear()}
                      </span>
                    </div>
                  </Dialog.Title>

                  {/* Credits banner */}
                  {/* <CreditsBanner courses={courses.flat().filter((course) => course.checked)} /> */}

                  {/* Alert banner */}
                  <Alert type={alertLevel}>
                    Neste modal pode selecionar as suas <strong>Unidades Curriculares</strong> de um curso diferente do principal.
                  </Alert>

                  {/* Select major dropdown */}
                  <MajorSearchCombobox 
                    majors={majors}
                    majorHook={[major, setMajor]}
                  />

                  {extraMajorEqualToMainMajor
                    ? <p className="text-center tracking-tight font-semibold">Já tens este curso selecionado no menu principal!</p>
                    :
                    <div className="checkboxes">
                    {major &&
                      courses.slice(1).map((year: CheckedCourse[], yearIdx: number) => (
                        <div key={`year-${yearIdx}`}>
                          {/* Parent checkbox */}
                          <div title={`${major?.acronym} ${yearIdx + 1}º ano`} className="flex items-center transition">
                            <input
                              type="checkbox"
                              className="extra-courses-checkbox"
                              checked={courses[yearIdx + 1].every((course) => course.checked)}
                              id={`extra-year-checkbox-${yearIdx}`}
                              onChange={(event) => handleCheckGroup(event, yearIdx + 1)}
                            />
                            <label
                              className="ml-2 block cursor-pointer text-sm font-semibold dark:text-white"
                              htmlFor={`extra-year-checkbox-${yearIdx}`}
                            >
                              <span>{yearIdx + 1}º Ano</span>
                            </label>
                          </div>

                          {/* Children checkboxes */}
                          <div className="mt-2 ml-4 grid grid-flow-col grid-rows-8 gap-x-1 gap-y-1.5 p-1">
                            {year.map((course: CheckedCourse, courseIdx: number) => (
                              <div
                                title={course?.info.name}
                                key={`checkbox-${yearIdx}-${courseIdx}`}
                                className="flex items-center transition"
                              >
                                <input
                                  type="checkbox"
                                  className="extra-courses-checkbox"
                                  checked={isCourseChecked(course, yearIdx, courseIdx)}
                                  id={`extra-course-checkbox-${yearIdx}-${courseIdx}`}
                                  onChange={(event) => handleCheck(event, yearIdx, courseIdx)}
                                />
                                <label
                                  className="ml-1.5 block cursor-pointer text-sm dark:text-white"
                                  htmlFor={`extra-course-checkbox-${yearIdx}-${courseIdx}`}
                                >
                                  {course.info.acronym}
                                </label>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                  </div>}

                  {/* Bottom action buttons */}
                  <footer className="flex flex-col items-center justify-between gap-y-2 lg:flex-row lg:gap-y-0">
                    {/* Right side buttons */}
                    <div className="order-first flex w-full flex-col items-center justify-center space-x-0 space-y-2 lg:order-last lg:flex-row lg:justify-end lg:space-y-0 lg:space-x-3">
                      {/* Go back to the main selection modal button */}
                      {/* Confirm options button */}
                      <button
                        type="button"
                        title="Avançar para seleção de horários"
                        className={classNames(
                          'flex w-full items-center justify-center space-x-1 rounded border-2 px-4 py-2 text-sm font-medium transition lg:w-auto',
                          'border-teal-700/50 bg-green-800 text-white dark:border-white-700 hover:bg-green-100 hover:text-teal-700',
                        )}
                        onClick={closeModal}
                      >
                        <ArrowCircleLeftIcon className="h-5 w-5" aria-hidden="true" />
                        <span>Ir para o menu anterior</span>
                      </button>
                    </div>
                  </footer>
                </Dialog.Panel>
              </InnerCustomTransition>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  )
}

/* Masks outer background */
const OuterMask = () => (
  <Transition.Child
    as={Fragment}
    enter="ease-out duration-300"
    enterFrom="opacity-0"
    enterTo="opacity-100"
    leave="ease-in duration-200"
    leaveFrom="opacity-100"
    leaveTo="opacity-0"
  >
    <div className="fixed inset-0 bg-black/50 dark:bg-black/50" />
  </Transition.Child>
)

/* Modal inner content custom transition */
const InnerCustomTransition = ({ children, ...props }: any) => (
  <Transition.Child
    as={Fragment}
    enter="ease-out duration-300"
    enterFrom="opacity-0 scale-95"
    enterTo="opacity-100 scale-100"
    leave="ease-in duration-200"
    leaveFrom="opacity-100 scale-100"
    leaveTo="opacity-0 scale-95"
    {...props}
  >
    {children}
  </Transition.Child>
)

export default SelectionExtraCoursesModal
