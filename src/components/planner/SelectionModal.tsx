import '../../styles/modal.css'
import classNames from 'classnames'
import Alert, { AlertType } from './Alert'
import { Combobox, Dialog, Transition } from '@headlessui/react'
import { Major, CheckedCourse, CheckedMajorCourses, CheckedYearCourses, Course } from '../../@types'
import { AcademicCapIcon, CheckIcon, SelectorIcon } from '@heroicons/react/solid'
import { Fragment, SetStateAction, useEffect, useState } from 'react'

type Props = {
  majors: Major[]
  checkedCourses: CheckedMajorCourses
  openHook: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
  selectedMajorHook: [any, React.Dispatch<React.SetStateAction<any>>]
  selectedCoursesHook: [any, React.Dispatch<React.SetStateAction<any>>]
}

const SelectionModal = ({ majors, checkedCourses, openHook, selectedMajorHook, selectedCoursesHook }: Props) => {
  const [isOpen, setIsOpen] = openHook
  const [majorQuery, setMajorQuery] = useState('')
  const [alertLevel, setAlertLevel] = useState(AlertType.info)
  const [selectedMajor, setSelectedMajor] = selectedMajorHook
  const [selectedCourses, setSelectedCourses] = selectedCoursesHook

  const atLeastOneCourse = selectedCourses.some((item) => item.some((course) => course.checked))
  const filteredMajors =
    majorQuery === ''
      ? majors
      : majors.filter((major: Major) =>
          major.name.toLowerCase().replace(/\s+/g, '').includes(majorQuery.toLowerCase().replace(/\s+/g, ''))
        )

  useEffect(() => {
    if (selectedMajor !== '') setAlertLevel(AlertType.success)
    else setAlertLevel(AlertType.info)
  }, [selectedMajor])

  function closeModal() {
    if (selectedMajor !== '' && atLeastOneCourse) setIsOpen(false)
    else setAlertLevel(AlertType.warning)
  }

  function openModal() {
    setIsOpen(true)
  }

  function handleCheck(event: React.ChangeEvent<HTMLInputElement>, year: number, course: number) {
    let copy = selectedCourses
    let newEntry: CheckedCourse = {
      checked: event.target.checked,
      info: copy[year][course],
    }

    copy[year][course] = newEntry
    setSelectedCourses([...copy])

    let some = copy[year].some((course) => course.checked)
    let every = copy[year].every((course) => course.checked)

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

  function handleCheckGroup(event: React.ChangeEvent<HTMLInputElement>, year: number) {
    let copy = selectedCourses
    let newGroupEntry: CheckedYearCourses = []
    copy[year].forEach((course: Course) => {
      let newEntry: CheckedCourse = {
        checked: event.target.checked,
        info: course,
      }
      newGroupEntry.push(newEntry)
    })

    copy[year] = newGroupEntry
    setSelectedCourses([...copy])
  }

  return (
    <>
      <div className="flex items-center justify-center">
        {/* Edit button */}
        <button
          type="button"
          onClick={openModal}
          className="rounded-md bg-darkest bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30"
        >
          Editar UCs
        </button>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <OuterMask />
          <div className="fixed inset-0 bottom-0 overflow-y-auto xl:bottom-12">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <InnerCustomTransition>
                <Dialog.Panel className="dialog">
                  {/* Header */}
                  <Dialog.Title as="header" className="dialog-header">
                    <AcademicCapIcon className="h-6 w-6 text-primary" aria-hidden="true" />
                    <h3 className="text-xl font-semibold leading-6 tracking-tight dark:text-white">Escolha de UCs</h3>
                  </Dialog.Title>

                  {/* Alert banner */}
                  <Alert type={alertLevel}>
                    Selecione o seu <strong>curso principal</strong>, seguido das <strong>Unidades Curriculares</strong>{' '}
                    pretendidas.
                  </Alert>

                  {/* Select major dropdown */}
                  <Combobox value={selectedMajor} onChange={setSelectedMajor}>
                    <div className="relative mt-4">
                      <div className="relative w-full rounded text-left">
                        <Combobox.Input
                          placeholder="Digite ou escolha o seu ciclo de estudos"
                          className="w-full rounded bg-gray-50 py-4 px-4 text-xs leading-5 text-gray-900 focus:shadow focus:ring-0 md:text-sm"
                          displayValue={(major: { name: string }) => major.name}
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
                                  `relative cursor-pointer select-none py-2 px-3 pl-10 ${
                                    active ? 'bg-primary text-white' : 'text-gray-900'
                                  }`
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
                  {selectedMajor !== '' ? (
                    <div className="checkboxes">
                      {checkedCourses.map((year: CheckedYearCourses, yearIdx: number) => (
                        <div key={`year-${yearIdx}`}>
                          {/* Parent checkbox */}
                          <div className="flex items-center transition hover:opacity-90">
                            <input
                              type="checkbox"
                              className="cursor-pointer rounded text-primary focus:ring-primary"
                              checked={selectedCourses[yearIdx].every((course) => course.checked)}
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
                                  className="cursor-pointer rounded text-primary focus:ring-primary"
                                  checked={selectedCourses[yearIdx][courseIdx].checked}
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
                        selectedMajor === '' || !atLeastOneCourse
                          ? 'cursor-not-allowed opacity-50'
                          : 'hover:bg-teal-700 hover:text-white'
                      )}
                      onClick={closeModal}
                      disabled={selectedMajor === '' || !atLeastOneCourse}
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
