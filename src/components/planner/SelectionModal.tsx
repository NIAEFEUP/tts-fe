import classNames from 'classnames'
import BackendAPI from '../../api/backend'
import { Combobox, Dialog, Transition } from '@headlessui/react'
import { Fragment, SetStateAction, useEffect, useMemo, useState } from 'react'
import Alert, { AlertType } from './Alert'
import { Link } from 'react-router-dom'
import { CheckedCourse, Course, Major } from '../../@types'
import { getSchoolYear, getSemester, config, getPath } from '../../utils'
import {
  AcademicCapIcon,
  CheckCircleIcon,
  HomeIcon,
  InboxInIcon,
  PencilAltIcon,
  PlusIcon,
  XCircleIcon,
} from '@heroicons/react/solid'
import { controlCoursesGroupCheckbox, is_null_or_undefined } from '../../pages/TimeTableScheduler'
import { MajorSearchCombobox } from './MajorSearchCombobox'

type Props = {
  majors: Major[]
  openHook: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
  majorHook: [Major, React.Dispatch<React.SetStateAction<Major>>]
  coursesHook: [CheckedCourse[][], React.Dispatch<React.SetStateAction<CheckedCourse[][]>>]
  extraCoursesActiveHook: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
  extraCoursesModalOpenHook: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
  sourceBufferHook: [CheckedCourse[][], React.Dispatch<React.SetStateAction<CheckedCourse[][]>>]
  destBufferHook: [CheckedCourse[][], React.Dispatch<React.SetStateAction<CheckedCourse[][]>>]
  repeatedCourseControlHook: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
}

/**
 * Main modal where a user can select the courses for their main major
 */
const SelectionModal = (
  { majors, openHook, majorHook, coursesHook, extraCoursesActiveHook, 
    extraCoursesModalOpenHook, sourceBufferHook, destBufferHook, repeatedCourseControlHook }: Props) => {
  const [major, setMajor] = majorHook
  const [isThisOpen, setIsThisOpen] = openHook
  const [courses, setCourses] = coursesHook
  const [extraCoursesActive, setExtraCoursesActive] = extraCoursesActiveHook
  const [isExtraUcsModelOpen, setIsExtraUcsModalOpen] = extraCoursesModalOpenHook
  const [selectionModalCoursesBuffer, setSelectionModalCoursesBuffer] = sourceBufferHook
  const [extraCoursesModalBuffer, setExtraCoursesModalBuffer] = destBufferHook
  const [chosenMajorMainModalEqualToExtra, setChosenMajorMainModalEqualToExtra] = repeatedCourseControlHook
  const [coursesAlreadyTaken, setCoursesAlreadyTaken] = useState<boolean>(false)
  const [mainMajorAlreadyAnExtra, setMainMajorAlreadyAnExtra] = useState<boolean>(false)
  //const [extraCoursesQuery, setExtraCoursesQuery] = useState<string>('')
  const [alertLevel, setAlertLevel] = useState<AlertType>(AlertType.info)
  const atLeastOneCourse = courses.some((item) => item?.some((course) => course.checked))

  const closeModal = () => {
    if (major?.name !== '' && atLeastOneCourse) {
      setIsThisOpen(false)
    }
    else {
      setAlertLevel(AlertType.warning)
    }
  }

  const openModal = () => {
    setIsThisOpen(true)
  }

  const getDisplayExtraCourseText = (course: Course) =>
    course === null ? '' : `${course?.name} (${course?.acronym}, ${course?.course})`

  const handleCheck = (event: React.ChangeEvent<HTMLInputElement>, year: number, courseIdx: number) => {
    if (is_null_or_undefined(year)) return

    courses[year + 1][courseIdx].checked = event.target.checked
    setCourses([...courses])

    setSelectionModalCoursesBuffer([...courses])
  }

  const handleCheckGroup = (event: React.ChangeEvent<HTMLInputElement>, year: number) => {
    if (is_null_or_undefined(year)) return

    let newGroupEntry: CheckedCourse[] = []
    courses[year + 1].forEach((course: CheckedCourse) => {
      course.checked = event.target.checked
      newGroupEntry.push(course)
    })
    courses[year + 1] = newGroupEntry

    setCourses([...courses])
    setSelectionModalCoursesBuffer([...courses])
  }

  const openExtraCoursesModal = () => {
    setSelectionModalCoursesBuffer([...courses.slice(1)])

    setCourses([courses[0], ...extraCoursesModalBuffer.slice(1)])

    setIsExtraUcsModalOpen(true)
  }

  const extraCoursesButton = () => (
    <button
      type="button"
      title="Edit extra ucs"
      className={classNames(
        'flex w-full items-center justify-center space-x-1 rounded border-2 px-2 py-2 text-sm font-medium transition md:px-4 lg:w-auto',
        'hover:text-white disabled:hidden disabled:cursor-not-allowed disabled:opacity-50',
        extraCoursesActive
          ? 'border-red-800/70 bg-red-50 text-red-800 hover:bg-red-900'
          : 'border-sky-800/70 bg-sky-50 text-sky-800 hover:bg-sky-800'
      )}
      onClick={() => { openExtraCoursesModal() }}
    >
      {extraCoursesActive ? <PencilAltIcon className="h-4 w-4" />
        : <PlusIcon className="h-[1.1rem] w-[1.1rem]" aria-hidden="true" />}

      <span className="hidden md:flex">
        UCs de outros cursos
      </span>
    </button>
  )

  const replaceExtraCourseCheckbox = (checkboxId: string, xiconId: string) => {
    const checkbox: HTMLElement = document.getElementById(checkboxId)
    const removalIcon: HTMLElement = document.getElementById(xiconId)

    if (!checkbox || !removalIcon) return

    checkbox.style.display = "none"
    removalIcon.style.display = "block"

  }

  const recoverExtraCourseCheckbox = (checkboxId: string, xiconId: string) => {
    const checkbox = document.getElementById(checkboxId)
    const removalIcon: HTMLElement = document.getElementById(xiconId)

    if (!checkbox || !removalIcon) return

    checkbox.style.display = "block"
    removalIcon.style.display = "none"
  }

  const removeCourseFromExtraCourses = (courseIdx: number) => {
    courses[0].splice(courseIdx, 1)
    setCourses([...courses])

    if (courses[0].length === 0) {
      extraCoursesModalBuffer[0] = []
      extraCoursesModalBuffer.forEach((courseArray: CheckedCourse[]) => {
        courseArray.forEach(course => course.checked = false)
      })
    }
  }

  const removeExtraCourses = () => {
    courses[0] = []
    setCourses([...courses])
    
    extraCoursesModalBuffer[0] = []
    extraCoursesModalBuffer.forEach((courseArray: CheckedCourse[]) => {
      courseArray.forEach(course => course.checked = false)
    })
    setExtraCoursesActive(false)
  }

  /**
   * Displays vertical list of the extra courses the user selected
   */
  const showUcsExtra = () => {
    return (
      <>
        {/* Courses checkboxes */}
        <div className="checkboxes col-span-6">
          <div key={`ucsextra`}>
            {/* Parent checkbox */}
            <div title={`ucsExtra`} className="flex items-center transition"
              onMouseEnter={() => {
                replaceExtraCourseCheckbox("extraCourseGroupCheckbox", "remove-extra-courses-icon")
              }}
              onMouseLeave={() => {
                recoverExtraCourseCheckbox("extraCourseGroupCheckbox", "remove-extra-courses-icon")
              }}
            >
              <XCircleIcon
                className="h-5 w-5 remove-extra-uc-icon hidden cursor-pointer text-primary"
                id="remove-extra-courses-icon"
                onClick={removeExtraCourses}
              />
              <input
                type="checkbox"
                className="checkbox"
                id="extraCourseGroupCheckbox"
                defaultChecked={true}
              />
              <label
                className="ml-2 block cursor-pointer text-sm font-semibold dark:text-white"
              >
                UCs de outros cursos
              </label>
            </div>

            <div className="flex flex-wrap items-center justify-center mt-2 ml-4 grid grid-flow-col grid-rows-8 gap-x-1 gap-y-1.5 p-1">
              {courses[0] !== null && courses[0] !== undefined
                ? courses[0].map((course: CheckedCourse, courseIdx: number) => (
                  <div
                    title={course?.info.name}
                    key={`added-extra-course-checkbox-${course?.info.year}-${courseIdx}`}
                    className="flex items-center transition"
                    onMouseEnter={() => {
                      replaceExtraCourseCheckbox(`added-extra-course-checkbox-${course?.info.year}-${courseIdx}`, `xicon-for-${course?.info.year}-${courseIdx}`)
                    }}
                    onMouseLeave={() => {
                      recoverExtraCourseCheckbox(`added-extra-course-checkbox-${course?.info.year}-${courseIdx}`, `xicon-for-${course?.info.year}-${courseIdx}`)
                    }}
                  >
                    <XCircleIcon
                      className="h-5 w-5 remove-extra-uc-icon hidden cursor-pointer text-primary"
                      id={`xicon-for-${course?.info.year}-${courseIdx}`}
                      onClick={() => { removeCourseFromExtraCourses(courseIdx) }}
                    />
                    <input
                      type="checkbox"
                      className="checkbox"
                      defaultChecked={course.checked}
                      id={`added-extra-course-checkbox-${course?.info.year}-${courseIdx}`}
                    />
                    <label
                      className="ml-1.5 block cursor-pointer text-sm dark:text-white"
                    >
                      {course.info.acronym}
                    </label>
                  </div>
                )) : <></>}
            </div>
          </div>
        </div>
      </>
    );
  }

  const alreadyInExtraCourses = (course: CheckedCourse[][]) => {
    if (is_null_or_undefined(course[1]) || is_null_or_undefined(course[0])
      || is_null_or_undefined(course[0][0]) || is_null_or_undefined(course[1][0])) {
      return false
    }

    return course[0][0]?.info.course_unit_id === course[1][0]?.info.course_unit_id
  }

  useEffect(() => {
    if (major?.name !== '' && atLeastOneCourse) setAlertLevel(AlertType.success)
    else setAlertLevel(AlertType.info)
  }, [major, courses, atLeastOneCourse])

  const warnIfMajorIsTheSameBetween = (courseLeft: CheckedCourse[], courseRight: CheckedCourse[][]) => {
    if(is_null_or_undefined(courseLeft) || is_null_or_undefined(courseLeft[0]))
      return false

    let areLeftAndRightMajorsEqual: boolean = 
      courseRight.flat().findIndex(extra_course => extra_course.info.course_unit_id === courseLeft[0].info.course_unit_id) !== -1

    areLeftAndRightMajorsEqual
      ? setMainMajorAlreadyAnExtra(true) 
      : setMainMajorAlreadyAnExtra(false)
  }

  useEffect(() => {
    // Regular courses
    for (let year = 1; year < courses.length; year++) {
      controlCoursesGroupCheckbox(courses[year], `year-checkbox-${year - 1}`)
    }

    // Extra courses
    if (courses[0] !== undefined && courses[0] !== null) {
      controlCoursesGroupCheckbox(courses[0], "extraCourseGroupCheckbox")
    }

    warnIfMajorIsTheSameBetween(courses[0], courses.slice(1))

  }, [courses])

  useEffect(() => {
    alreadyInExtraCourses(courses.slice(1))
      ? setCoursesAlreadyTaken(true)
      : setCoursesAlreadyTaken(false)
  }, [courses])

  return (
    <>
      <div className="flex w-full grow items-center justify-center xl:w-min">
        {/* Edit button */}
        <button
          type="button"
          onClick={openModal}
          title="Editar Unidades Curriculares"
          className="flex h-auto w-full items-center justify-center space-x-2 rounded border-2 border-primary bg-primary px-2
          py-2 text-xs font-medium text-white transition hover:opacity-80 xl:space-x-2 xl:px-3"
        >
          <span className="flex">Editar</span>
          <PencilAltIcon className="h-4 w-4 text-white" />
        </button>
      </div>

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
                      <AcademicCapIcon className="h-6 w-6 text-feup" aria-hidden="true" />
                      <h3 className="flex text-xl font-semibold leading-6 tracking-tight dark:text-white lg:hidden">
                        UCs
                      </h3>
                      <h3 className="hidden text-xl font-semibold leading-6 tracking-tight dark:text-white lg:flex">
                        Escolha de UCs
                      </h3>
                    </div>

                    <div className="flex items-center justify-start space-x-2">
                      <span
                        title="Semestre"
                        className="rounded bg-feup px-3 py-1 text-sm text-white transition-all duration-500"
                      >
                        {`${getSemester()}ºS`}
                      </span>
                      <span
                        title="Ano Letivo"
                        className="rounded bg-feup px-3 py-1 text-sm text-white transition-all duration-500"
                      >
                        {getSchoolYear()}
                      </span>
                    </div>
                  </Dialog.Title>

                  {/* Credits banner */}
                  {/* <CreditsBanner courses={courses.flat().filter((course) => course.checked)} /> */}

                  {/* Alert banner */}
                  <Alert type={alertLevel}>
                    Selecione o seu <strong>curso principal</strong>, seguido das <strong>Unidades Curriculares</strong>{' '}
                    pretendidas.
                  </Alert>

                  {/* Select major dropdown */}
                  <MajorSearchCombobox 
                    majors={majors}
                    majorHook={[major, setMajor]}
                  />

                  <div className={classNames(extraCoursesActive ? "grid grid-cols-8 divide-x-2" : "")}>

                    {extraCoursesActive
                      ? <div className="col-span-2">
                        {showUcsExtra()}
                      </div>
                      : <></>}

                    {chosenMajorMainModalEqualToExtra 
                      ? <div className="checkboxes col-span-6">
                          <p className="m-4 font-semibold text-center">Já tens este curso selecionado no menu de seleção de outros cursos</p>
                        </div>
                      : <div className="checkboxes col-span-6">
                      {coursesAlreadyTaken ? <></>
                        :
                        major &&
                        courses.slice(1).map((year: CheckedCourse[], yearIdx: number) => (
                          <div key={`year-${yearIdx}`}>
                            {/* Parent checkbox */}
                            <div title={`${major?.acronym} ${yearIdx + 1}º ano`} className="flex items-center transition">
                              <input
                                type="checkbox"
                                className="checkbox"
                                checked={courses[yearIdx + 1]?.every((course) => course.checked)}
                                id={`year-checkbox-${yearIdx}`}
                                onChange={(event) => handleCheckGroup(event, yearIdx)}
                              />
                              <label
                                className="ml-2 block cursor-pointer text-sm font-semibold dark:text-white"
                                htmlFor={`year-checkbox-${yearIdx}`}
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
                                    className="checkbox"
                                    checked={courses[yearIdx + 1][courseIdx].checked}
                                    id={`course-checkbox-${yearIdx}-${courseIdx}`}
                                    onChange={(event) => handleCheck(event, yearIdx, courseIdx)}
                                  />
                                  <label
                                    className="ml-1.5 block cursor-pointer text-sm dark:text-white"
                                    htmlFor={`course-checkbox-${yearIdx}-${courseIdx}`}
                                  >
                                    {course.info.acronym}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))
                      }
                    </div> }

                  </div>

                  {/* Bottom action buttons */}
                  <footer className="flex flex-col items-center justify-between gap-y-2 lg:flex-row lg:gap-y-0">
                    {/* Left side buttons */}
                    <div className="order-last flex w-full flex-col space-x-0 space-y-2 lg:order-first lg:flex-row lg:space-x-3 lg:space-y-0">
                      {/* Add / edit extra ucs */}
                      {major !== null ? extraCoursesButton()
                        : <></>}
                      {/* Contact us link */}
                      <a
                        type="button"
                        className={classNames(
                          'flex items-center justify-center space-x-1 rounded px-4 py-2 text-sm font-medium lg:space-x-2',
                          'border-2 border-gray-700 text-gray-700 transition hover:bg-gray-700 hover:text-white',
                          'dark:border-gray-200 dark:text-gray-200 dark:hover:bg-gray-200 dark:hover:text-gray-700'
                        )}
                        href="mailto:projetos.niaefeup@gmail.com"
                      >
                        <InboxInIcon className="h-5 w-5" aria-hidden="true" />
                        <span className="hidden md:flex">Contacte-nos</span>
                        <span className="flex md:hidden">Contactar</span>
                      </a>
                      {/* Go back to about page button */}
                      <Link
                        to={getPath(config.paths.about)}
                        className={classNames(
                          'flex items-center justify-center space-x-1 rounded px-4 py-2 text-sm font-medium lg:space-x-2',
                          'border-2 border-gray-700 text-gray-700 transition hover:bg-gray-700 hover:text-white',
                          'dark:border-gray-200 dark:text-gray-200 dark:hover:bg-gray-200 dark:hover:text-gray-700'
                          // major === null ? 'hidden' : ''
                        )}
                      >
                        <HomeIcon className="h-[1.1rem] w-[1.1rem]" aria-hidden="true" />
                        <span>Voltar</span>
                      </Link>
                    </div>

                    {/* Right side buttons */}
                    <div className="order-first flex w-full flex-col items-center justify-center space-x-0 space-y-2 lg:order-last lg:flex-row lg:justify-end lg:space-y-0 lg:space-x-3">
                      {/* Confirm options button */}
                      <button
                        type="button"
                        title="Avançar para seleção de horários"
                        className={classNames(
                          'flex w-full items-center justify-center space-x-1 rounded border-2 px-4 py-2 text-sm font-medium transition lg:w-auto',
                          'border-teal-700/50 bg-green-50 text-teal-700 dark:border-teal-700',
                          major?.name === '' || !atLeastOneCourse
                            ? 'cursor-not-allowed opacity-50'
                            : 'hover:bg-teal-700 hover:text-white'
                        )}
                        onClick={closeModal}
                        disabled={major?.name === '' || !atLeastOneCourse}
                      >
                        <CheckCircleIcon className="h-5 w-5" aria-hidden="true" />
                        <span>Confirmar</span>
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

export default SelectionModal
