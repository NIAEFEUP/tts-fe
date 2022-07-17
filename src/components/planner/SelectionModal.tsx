import classNames from 'classnames'
import * as backendAPI from '../../backend'
import Alert, { AlertType } from './Alert'
import CreditsBanner from './CreditsBanner'
import { Link } from 'react-router-dom'
import { Combobox, Dialog, Transition } from '@headlessui/react'
import { Major, CheckedCourse, CheckedYearCourses, CheckedMajorCourses, Course } from '../../@types'
import {
  AcademicCapIcon,
  CheckIcon,
  SelectorIcon,
  PencilAltIcon,
  PlusCircleIcon,
  MinusCircleIcon,
  CheckCircleIcon,
  HomeIcon,
  InboxInIcon,
} from '@heroicons/react/solid'
import { Fragment, SetStateAction, useEffect, useMemo, useState } from 'react'
import { getSchoolYear, getSemester } from '../../utils'
import { useCourses } from '../../hooks'

type Props = {
  majors: Major[]
  openHook: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
  majorHook: [Major, React.Dispatch<React.SetStateAction<Major>>]
  coursesHook: [CheckedMajorCourses, React.Dispatch<React.SetStateAction<CheckedMajorCourses>>]
}

const SelectionModal = ({ majors, openHook, majorHook, coursesHook }: Props) => {
  const [major, setMajor] = majorHook
  const [isOpen, setIsOpen] = openHook
  const [courses, setCourses] = coursesHook
  const [, setCoursesLS] = useCourses()
  const [selected, setSelected] = useState<Major>(major)
  const [majorQuery, setMajorQuery] = useState<string>('')
  const [extraCoursesQuery, setExtraCoursesQuery] = useState<string>('')
  const [extraCoursesActive, setExtraCoursesActive] = useState<boolean>(false)
  const [alertLevel, setAlertLevel] = useState<AlertType>(AlertType.info)
  const atLeastOneCourse = courses.some((item) => item.some((course) => course.checked))

  // SETUP =========================================================================================
  // While the backend information is not loaded, set empty structures. 

  const filterMajors = () => {
    // The list of majors must be retrieved from the backend. 
    if (majors !== null && majors !== [] && Array.isArray(majors)) {
      return majorQuery === '' ? 
        majors : 
        majors.filter((major: Major) =>
          major?.name.toLowerCase().replace(/\s+/g, '').includes(majorQuery.toLowerCase().replace(/\s+/g, ''))
        )
    }
    else {
      // Didn't retrieve information from backend yet. 
      return [];
    }
  }


  const filteredMajors = filterMajors();  

  
  const extraCourses = useMemo(() => backendAPI.getExtraCourses(major), [major])
  const filteredExtraCourses =
    extraCoursesQuery === ''
      ? extraCourses
      : extraCourses.filter((course: Course) =>
          course?.name
            .toLowerCase()
            .normalize('NFD')
            .replace(/\p{Diacritic}/gu, '')
            .replace(/\s+/g, '')
            .includes(extraCoursesQuery.toLowerCase().replace(/\s+/g, ''))
        )

  useEffect(() => {
    if (major?.name !== '' && atLeastOneCourse) setAlertLevel(AlertType.success)
    else setAlertLevel(AlertType.info)
  }, [major, courses, atLeastOneCourse])

  const closeModal = () => {
    if (major?.name !== '' && atLeastOneCourse) setIsOpen(false)
    else setAlertLevel(AlertType.warning)
  }

  const openModal = () => {
    setIsOpen(true)
  }

  const getDisplayMajorText = (major: Major) => (major === null ? '' : `${major?.name} (${major?.acronym})`)
  const getDisplayExtraCourseText = (course: Course) =>
    course === null ? '' : `${course?.name} (${course?.acronym}, ${course?.course})`

  const handleCheck = (event: React.ChangeEvent<HTMLInputElement>, year: number, courseIdx: number) => {
    courses[year][courseIdx].checked = event.target.checked
    setCourses([...courses])
    setCoursesLS([...courses])

    let some = courses[year].some((course) => course.checked)
    let every = courses[year].every((course) => course.checked)

    //@ts-ignore
    let checkbox: HTMLInputElement = document.getElementById(`year-checkbox-${year}`)
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

  const handleCheckGroup = (event: React.ChangeEvent<HTMLInputElement>, year: number) => {
    let newGroupEntry: CheckedYearCourses = []
    courses[year].forEach((course: CheckedCourse) => {
      course.checked = event.target.checked
      newGroupEntry.push(course)
    })
    courses[year] = newGroupEntry
    setCourses([...courses])
    setCoursesLS([...courses])
  }

  return (
    <>
      <div className="flex w-full grow items-center justify-center xl:w-min">
        {/* Edit button */}
        <button
          type="button"
          onClick={openModal}
          className="flex h-auto w-full items-center justify-center space-x-2 rounded border-2 border-primary bg-primary px-2
          py-3 text-xs font-medium text-white transition hover:opacity-80 xl:space-x-0 xl:px-4 xl:text-sm 2xl:space-x-2"
        >
          <span className="flex xl:hidden 2xl:flex">Editar</span>
          <PencilAltIcon className="h-4 w-4 text-white xl:h-5 xl:w-5" />
        </button>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <OuterMask />
          <div className="fixed inset-0 bottom-0 overflow-y-auto xl:bottom-12">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <InnerCustomTransition>
                <Dialog.Panel
                  className={classNames(
                    'w-full max-w-6xl transform space-y-3 rounded-2xl p-4 text-left lg:p-8',
                    'bg-lightest align-middle shadow-xl transition-all dark:bg-dark'
                  )}
                >
                  {/* Header */}
                  <Dialog.Title
                    as="header"
                    className="mb-5 flex w-full items-center justify-between space-x-2 text-center font-medium"
                  >
                    <div className="flex items-center justify-start space-x-1">
                      <AcademicCapIcon className="h-6 w-6 text-feup" aria-hidden="true" />
                      <h3 className="text-xl font-semibold leading-6 tracking-tight dark:text-white">Escolha de UCs</h3>
                    </div>

                    <div className="flex items-center justify-start space-x-2">
                      <span
                        title="Semestre"
                        className="rounded bg-feup px-3 py-1 text-sm text-white transition-all duration-500"
                      >
                        {getSemester()}
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
                  <CreditsBanner courses={courses.flat().filter((course) => course.checked)} />

                  {/* Alert banner */}
                  <Alert type={alertLevel}>
                    Selecione o seu <strong>curso principal</strong>, seguido das <strong>Unidades Curriculares</strong>{' '}
                    pretendidas.
                  </Alert>

                  {/* Select major dropdown */}
                  <Combobox
                    value={selected}
                    onChange={(value) => {
                      setMajor(value)
                      setSelected(value)
                    }}
                  >
                    <div className="relative">
                      <div className="relative w-full rounded text-left">
                        <Combobox.Input
                          placeholder="Digite ou escolha o seu ciclo de estudos"
                          className={classNames(
                            selected !== null ? 'font-semibold' : '',
                            'w-full rounded border-2 py-3 pl-4 pr-8 text-xs leading-5 md:text-sm',
                            'border-gray-700/25 bg-gray-50 text-gray-700 focus:shadow focus:ring-0'
                          )}
                          displayValue={(major: Major) => getDisplayMajorText(major)}
                          onChange={(event: { target: { value: SetStateAction<string> } }) =>
                            setMajorQuery(event.target.value)
                          }
                        />
                        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                          <SelectorIcon
                            className="h-7 w-7 rounded-full py-0.5 text-gray-500 transition hover:bg-gray-100 hover:text-primary"
                            aria-hidden="true"
                          />
                        </Combobox.Button>
                      </div>

                      <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                        afterLeave={() => setMajorQuery('')}
                      >
                        <Combobox.Options
                          className="absolute z-50 mt-1.5 max-h-64 w-full overflow-auto rounded border
                         border-gray-500 bg-lightest py-2 text-xs dark:bg-lighter sm:text-sm"
                        >
                          {filteredMajors.length === 0 && majorQuery !== '' ? (
                            <div className="relative cursor-pointer select-none py-2 px-4 text-gray-700 dark:text-white">
                              Nenhum curso encontrado com este nome.
                            </div>
                          ) : (
                            filteredMajors.map((major: Major, majorIdx: number) => (
                              <Combobox.Option
                                key={majorIdx}
                                className={({ active }) =>
                                  `relative cursor-pointer select-none py-2 px-3 ${
                                    major?.name !== '' ? 'pl-10' : 'pl-4'
                                  } ${active ? 'bg-primary text-white' : 'text-gray-900'}`
                                }
                                value={major}
                              >
                                {({ selected, active }) => (
                                  <>
                                    <span className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>
                                      {getDisplayMajorText(major)}
                                    </span>
                                    {selected ? (
                                      <span
                                        className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                          active ? 'text-white' : 'text-primary'
                                        }`}
                                      >
                                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                      </span>
                                    ) : null}
                                  </>
                                )}
                              </Combobox.Option>
                            ))
                          )}
                        </Combobox.Options>
                      </Transition>
                    </div>
                  </Combobox>

                  {/* Select extra courses */}
                  {extraCoursesActive && (
                    <Combobox
                      value={null}
                      onChange={(value) => {
                        // FIXME: add new extra course to selected courses
                      }}
                    >
                      <div className="relative">
                        <div className="relative w-full rounded text-left">
                          <Combobox.Input
                            placeholder="Procure uma unidade curricular usando sigla, nome ou código"
                            className={classNames(
                              'w-full rounded border-2 py-3 px-4 text-xs leading-5 md:text-sm',
                              'border-gray-700/25 bg-gray-50 text-gray-800 focus:shadow focus:ring-0'
                            )}
                            displayValue={(extraCourse: Course) => getDisplayExtraCourseText(extraCourse)}
                            onChange={(event: { target: { value: SetStateAction<string> } }) =>
                              setExtraCoursesQuery(event.target.value)
                            }
                          />
                          <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                            <SelectorIcon
                              className="h-7 w-7 rounded-full py-0.5 text-gray-500 transition hover:bg-sky-100 hover:text-primary"
                              aria-hidden="true"
                            />
                          </Combobox.Button>
                        </div>

                        <Transition
                          as={Fragment}
                          leave="transition ease-in duration-100"
                          leaveFrom="opacity-100"
                          leaveTo="opacity-0"
                          afterLeave={() => setExtraCoursesQuery('')}
                        >
                          <Combobox.Options
                            className="absolute z-50 mt-1.5 max-h-64 w-full overflow-auto rounded border
                          border-gray-500 bg-lightest py-2 text-xs dark:bg-lighter sm:text-sm"
                          >
                            {filteredExtraCourses.length === 0 && extraCoursesQuery !== '' ? (
                              <div className="relative cursor-pointer select-none py-2 px-4 text-gray-700 dark:text-white">
                                Nenhuma unidade curricular encontrada.
                              </div>
                            ) : (
                              filteredExtraCourses.map((extraCourse: Course, extraCourseIdx: number) => (
                                <Combobox.Option
                                  key={extraCourseIdx}
                                  className={({ active }) =>
                                    `relative cursor-pointer select-none py-2 px-3 ${
                                      extraCourse?.name !== '' ? 'pl-10' : 'pl-4'
                                    } ${active ? 'bg-primary text-white' : 'text-gray-900'}`
                                  }
                                  value={extraCourse}
                                >
                                  {({ selected, active }) => (
                                    <>
                                      <span className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>
                                        {getDisplayExtraCourseText(extraCourse)}
                                      </span>
                                      {selected ? (
                                        <span
                                          className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                            active ? 'text-white' : 'text-primary'
                                          }`}
                                        >
                                          <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                        </span>
                                      ) : null}
                                    </>
                                  )}
                                </Combobox.Option>
                              ))
                            )}
                          </Combobox.Options>
                        </Transition>
                      </div>
                    </Combobox>
                  )}

                  {/* Courses checkboxes */}
                  <div className="checkboxes">
                    {major
                      ? courses.map((year: CheckedYearCourses, yearIdx: number) => (
                          <div key={`year-${yearIdx}`}>
                            {/* Parent checkbox */}
                            <div className="flex items-center transition">
                              <input
                                type="checkbox"
                                className="checkbox"
                                checked={courses[yearIdx].every((course) => course.checked)}
                                id={`year-checkbox-${yearIdx}`}
                                onChange={(event) => {
                                  handleCheckGroup(event, yearIdx)
                                }}
                              />
                              <label
                                className="ml-2 block cursor-pointer text-sm font-semibold dark:text-white"
                                htmlFor={`year-checkbox-${yearIdx}`}
                              >
                                <span>{yearIdx + 1}º Ano</span>
                              </label>
                            </div>

                            {/* Children checkboxes */}
                            <div className="mt-2 ml-4 grid grid-flow-col grid-rows-6 gap-x-3 gap-y-1.5 p-1">
                              {year.map((course: CheckedCourse, courseIdx: number) => (
                                <div key={`checkbox-${yearIdx}-${courseIdx}`} className="flex items-center transition">
                                  <input
                                    type="checkbox"
                                    className="checkbox"
                                    checked={courses[yearIdx][courseIdx].checked}
                                    id={`course-checkbox-${yearIdx}-${courseIdx}`}
                                    onChange={(event) => {
                                      handleCheck(event, yearIdx, courseIdx)
                                    }}
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
                      : null}
                  </div>

                  {/* Bottom action buttons */}
                  <footer className="mt-8 flex flex-col items-center justify-between space-y-2 space-x-0 lg:flex-row lg:space-y-0 lg:space-x-2">
                    <div className="flex w-full flex-col space-x-0 space-y-2 lg:flex-row lg:space-x-3 lg:space-y-0">
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
                      <Link
                        to="/"
                        className={classNames(
                          'flex items-center justify-center space-x-1 rounded px-4 py-2 text-sm font-medium lg:space-x-2',
                          'border-2 border-gray-700 text-gray-700 transition hover:bg-gray-700 hover:text-white',
                          'dark:border-gray-200 dark:text-gray-200 dark:hover:bg-gray-200 dark:hover:text-gray-700'
                        )}
                      >
                        <HomeIcon className="h-[1.1rem] w-[1.1rem]" aria-hidden="true" />
                        <span>Voltar</span>
                      </Link>
                    </div>

                    <div className="flex w-full flex-col items-center justify-between space-x-0 space-y-2 lg:flex-row lg:justify-end lg:space-y-0 lg:space-x-3">
                      <button
                        type="button"
                        title="Coming soon"
                        disabled
                        className={classNames(
                          'flex w-full items-center justify-center space-x-1 rounded border-2 px-2 py-2 text-sm font-medium transition md:px-4 lg:w-auto',
                          'hover:text-white disabled:hidden disabled:cursor-not-allowed disabled:opacity-50',
                          extraCoursesActive
                            ? 'border-rose-700/70 bg-rose-50 text-rose-700 hover:bg-rose-700'
                            : 'border-sky-800/70 bg-sky-50 text-sky-800 hover:bg-sky-800'
                        )}
                        onClick={() => setExtraCoursesActive(!extraCoursesActive)}
                      >
                        {extraCoursesActive ? (
                          <MinusCircleIcon className="h-5 w-5" aria-hidden="true" />
                        ) : (
                          <PlusCircleIcon className="h-5 w-5" aria-hidden="true" />
                        )}
                        <span className="hidden md:flex">UCs&nbsp;fora&nbsp;do&nbsp;curso</span>
                        <span className="flex md:hidden">Extra&nbsp;UCs</span>
                      </button>
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
    <div className="fixed inset-0 bg-darkest bg-opacity-25 dark:bg-light dark:bg-opacity-[30%]" />
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
