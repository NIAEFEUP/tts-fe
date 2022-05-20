import classNames from 'classnames'
import Alert, { AlertType } from './Alert'
import { Combobox, Dialog, Transition } from '@headlessui/react'
import { Major, CheckedCourse, CheckedYearCourses, CheckedMajorCourses } from '../../@types'
import { AcademicCapIcon, CheckIcon, SelectorIcon, PencilAltIcon } from '@heroicons/react/solid'
import { Fragment, SetStateAction, useEffect, useState } from 'react'
import { getSchoolYear, getSemester } from '../../utils'

type Props = {
  majors: Major[]
  openHook: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
  majorHook: [Major, React.Dispatch<React.SetStateAction<Major>>]
  coursesHook: [CheckedMajorCourses, React.Dispatch<React.SetStateAction<CheckedMajorCourses>>]
}


const SelectionModal = ({ majors, openHook, majorHook, coursesHook }: Props) => {
  const initMajor = () => {
    const storedMajor = JSON.parse(localStorage.getItem('niaefeup-tts.major'))
    if (storedMajor === null) return { name: '' }
    else return majors.find((item) => item.name === storedMajor.name)
  }

  const [major, setMajor] = majorHook
  const [isOpen, setIsOpen] = openHook
  const [courses, setCourses] = coursesHook
  const [selected, setSelected] = useState<Major>(initMajor())
  const [majorQuery, setMajorQuery] = useState<string>('')
  const [alertLevel, setAlertLevel] = useState<AlertType>(AlertType.info)
  const atLeastOneCourse = courses.some((item) => item.some((course) => course.checked))
  const filteredMajors =
    majorQuery === ''
      ? majors
      : majors.filter((major: Major) =>
          major.name.toLowerCase().replace(/\s+/g, '').includes(majorQuery.toLowerCase().replace(/\s+/g, ''))
        )

  useEffect(() => {
    if (major.name !== '' && atLeastOneCourse) setAlertLevel(AlertType.success)
    else setAlertLevel(AlertType.info)
  }, [major, courses, atLeastOneCourse])

  const closeModal = () => {
    if (major.name !== '' && atLeastOneCourse) setIsOpen(false)
    else setAlertLevel(AlertType.warning)
  }

  const openModal = () => {
    setIsOpen(true)
  }

  const handleCheck = (event: React.ChangeEvent<HTMLInputElement>, year: number, courseIdx: number) => {
    courses[year][courseIdx].checked = event.target.checked
    setCourses([...courses])

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
  }

  return (
    <>
      <div className="flex w-full items-center justify-center">
        {/* Edit button */}
        <button
          type="button"
          onClick={openModal}
          className="flex h-auto w-full items-center justify-center space-x-2 rounded bg-primary px-4 py-3 text-sm font-medium text-white transition hover:-translate-y-1 hover:opacity-90"
        >
          <span>Editar UCs</span>
          <PencilAltIcon className="h-5 w-5 text-white" />
        </button>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <OuterMask />
          <div className="fixed inset-0 bottom-0 overflow-y-auto xl:bottom-12">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <InnerCustomTransition>
                <Dialog.Panel className="w-full max-w-5xl transform rounded-2xl bg-lightest p-6 text-left align-middle shadow-xl transition-all dark:bg-dark">
                  {/* Header */}
                  <Dialog.Title
                    as="header"
                    className="mb-4 flex w-full items-center justify-between space-x-2 text-center font-medium"
                  >
                    <div className="flex items-center justify-start space-x-1">
                      <AcademicCapIcon className="h-6 w-6 text-primary" aria-hidden="true" />
                      <h3 className="text-xl font-semibold leading-6 tracking-tight dark:text-white">Escolha de UCs</h3>
                    </div>

                    <div className="flex items-center justify-start space-x-2">
                      <span className="rounded bg-primary px-3 py-1 text-sm text-white transition-all duration-500">
                        {getSemester()}
                      </span>
                      <span className="rounded bg-primary px-3 py-1 text-sm text-white transition-all duration-500">
                        {getSchoolYear()}
                      </span>
                    </div>
                  </Dialog.Title>

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
                    <div className="relative mt-4">
                      <div className="relative w-full rounded text-left">
                        <Combobox.Input
                          placeholder="Digite ou escolha o seu ciclo de estudos"
                          className="w-full rounded bg-gray-50 py-4 px-4 text-xs leading-5 text-gray-900 focus:shadow focus:ring-0 md:text-sm"
                          displayValue={(major: Major) => major.name}
                          onChange={(event: { target: { value: SetStateAction<string> } }) =>
                            setMajorQuery(event.target.value)
                          }
                        />
                        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                          <SelectorIcon
                            className="h-7 w-7 rounded-full py-0.5 text-gray-500 transition hover:bg-primary hover:text-white"
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
                          className="absolute z-50 mt-1.5 max-h-64 w-full overflow-auto rounded-md border
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
                                    major.name !== '' ? 'pl-10' : 'pl-4'
                                  } ${active ? 'bg-primary text-white' : 'text-gray-900'}`
                                }
                                value={major}
                              >
                                {({ selected, active }) => (
                                  <>
                                    <span className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>
                                      {major.name}
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

                  {/* Courses checkboxes */}
                  {major.name !== '' ? (
                    <div className="mx-auto mt-6 flex max-w-2xl flex-col items-center justify-center space-x-0 md:flex-row md:items-start md:space-x-8">
                      {courses.map((year: CheckedYearCourses, yearIdx: number) => (
                        <div key={`year-${yearIdx}`}>
                          {/* Parent checkbox */}
                          <div className="flex items-center transition hover:opacity-90">
                            <input
                              type="checkbox"
                              className="cursor-pointer rounded border-2 p-2 text-primary focus:ring-primary"
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
                              <div
                                key={`checkbox-${yearIdx}-${courseIdx}`}
                                className="flex items-center transition hover:opacity-90"
                              >
                                <input
                                  type="checkbox"
                                  className="cursor-pointer rounded border-2 p-2 text-primary focus:ring-primary"
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
                      ))}
                    </div>
                  ) : null}

                  {/* Bottom action buttons */}
                  <footer className="mt-8 flex items-center justify-between">
                    <a
                      type="button"
                      className={classNames(
                        'inline-flex justify-center rounded-md px-4 py-2 text-sm font-medium text-slate-600',
                        'border-2 border-slate-400 bg-slate-100 transition hover:bg-slate-400 hover:text-white'
                      )}
                      href="mailto:projetos.niaefeup@gmail.com"
                    >
                      Contacte-nos
                    </a>

                    <button
                      type="button"
                      className={classNames(
                        'inline-flex justify-center rounded-md border-2 border-teal-700/30 bg-green-50',
                        'px-4 py-2 text-sm font-medium text-teal-700 transition',
                        major.name === '' || !atLeastOneCourse
                          ? 'cursor-not-allowed opacity-50'
                          : 'hover:bg-teal-700 hover:text-white'
                      )}
                      onClick={closeModal}
                      disabled={major.name === '' || !atLeastOneCourse}
                    >
                      Confirmar
                    </button>
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
