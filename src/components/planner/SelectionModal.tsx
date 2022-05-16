import '../../styles/modal.css'
import { Major, MajorCourses } from '../../@types'
import { Fragment, SetStateAction, useState, useEffect } from 'react'
import { Combobox, Dialog, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon, AcademicCapIcon } from '@heroicons/react/solid'
import Alert, { AlertType } from './Alert'
import { coursesData } from '../../utils/data'
import { TruncatedCourse, YearCourses } from '../../@types'

type Props = {
  majors: any
  openHook: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
  selectedMajorHook: [any, React.Dispatch<React.SetStateAction<any>>]
}

const truncateCourses = (courses: MajorCourses) => {
  return courses.map((year, yearIdx) => {
    return year.map(({ acronym, course_unit_id }) => ({
      checked: false,
      acronym: acronym,
      course_unit_id: course_unit_id,
    }))
  })
}

const SelectionModal = ({ majors, openHook, selectedMajorHook }: Props) => {
  const truncatedCourses = truncateCourses(coursesData)
  const [isOpen, setIsOpen] = openHook
  const [query, setQuery] = useState('')
  const [alertLevel, setAlertLevel] = useState(AlertType.info)
  const [selectedMajor, setSelectedMajor] = selectedMajorHook
  const [selectedCourses, setSelectedCourses] = useState<TruncatedCourse[][]>(truncatedCourses)

  const filteredMajors =
    query === ''
      ? majors
      : majors.filter((major: Major) =>
          major.name.toLowerCase().replace(/\s+/g, '').includes(query.toLowerCase().replace(/\s+/g, ''))
        )

  useEffect(() => {
    if (selectedMajor !== '') setAlertLevel(AlertType.success)
    else setAlertLevel(AlertType.info)
  }, [selectedMajor])

  function closeModal() {
    if (selectedMajor === '') setAlertLevel(AlertType.warning)
    else setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }

  function handleCheck(event: React.ChangeEvent<HTMLInputElement>, i: number, j: number) {
    let copy = selectedCourses
    let newEntry: TruncatedCourse = {
      checked: event.target.checked,
      acronym: truncatedCourses[i][j].acronym,
      course_unit_id: truncatedCourses[i][j].course_unit_id,
    }
    copy[i][j] = newEntry

    setSelectedCourses([...copy])
  }

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center">
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
          <div className="fixed inset-0 bottom-0 overflow-y-auto md:bottom-24">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <InnerCustomTransition>
                <Dialog.Panel className="dialog">
                  {/* Header */}
                  <Dialog.Title as="header" className="dialog-header">
                    <AcademicCapIcon className="h-6 w-6 text-primary" aria-hidden="true" />
                    <h3 className="text-xl font-semibold leading-6 tracking-tight">Escolha de UCs</h3>
                  </Dialog.Title>

                  {/* Alert banner */}
                  <Alert type={alertLevel}>
                    Selecione o seu <strong>curso principal</strong>, seguido das <strong>Unidades Curriculares</strong>{' '}
                    pretendidas.
                  </Alert>

                  {/* Select major dropdown */}
                  <Combobox value={selectedMajor} onChange={setSelectedMajor}>
                    <div className="relative mt-4">
                      <div className="relative w-full rounded border-2 border-gray-200 text-left">
                        <Combobox.Input
                          placeholder="Digite ou escolha o seu ciclo de estudos"
                          className="w-full bg-gray-50 py-4 px-4 text-xs leading-5 text-gray-900 focus:ring-0 md:text-sm"
                          displayValue={(major: { name: string }) => major.name}
                          onChange={(event: { target: { value: SetStateAction<string> } }) =>
                            setQuery(event.target.value)
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
                        afterLeave={() => setQuery('')}
                      >
                        <Combobox.Options
                          className="absolute z-50 mt-1 max-h-64 w-full overflow-auto rounded-md border-2 
                        border-gray-200 bg-lightest py-2 text-xs dark:bg-lighter sm:text-sm"
                        >
                          {filteredMajors.length === 0 && query !== '' ? (
                            <div className="relative cursor-pointer select-none py-2 px-4 text-gray-700 dark:text-white">
                              Nenhum curso encontrado com este nome.
                            </div>
                          ) : (
                            filteredMajors.map((major: Major, majorIdx: number) => (
                              <Combobox.Option
                                key={majorIdx}
                                className={({ active }) =>
                                  `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
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
                  {alertLevel === AlertType.success ? (
                    <div className="mx-auto mt-4 flex max-w-md items-center justify-between">
                      {truncatedCourses.map((year: TruncatedCourse[], yearIdx: number) => (
                        <div key={`year-${yearIdx}`}>
                          {/* Parent checkbox */}
                          <div className="flex items-center">
                            <input
                              id={`year-checkbox-${yearIdx}`}
                              type="checkbox"
                              className="form-checkbox rounded text-primary"
                            />
                            <label htmlFor={`year-checkbox-${yearIdx}`} className="ml-2 block text-sm">
                              {yearIdx + 1}º Ano
                            </label>
                          </div>

                          {/* Children checkboxes */}
                          <div className="mt-2 ml-3 grid grid-flow-row grid-rows-3 gap-1">
                            {year.map((course: TruncatedCourse, courseIdx: number) => (
                              <div key={`checkbox-${yearIdx}-${courseIdx}`} className="flex items-center">
                                <input
                                  type="checkbox"
                                  className="rounded text-primary"
                                  checked={selectedCourses[yearIdx][courseIdx].checked}
                                  id={`course-checkbox-${yearIdx}-${courseIdx}`}
                                  onChange={(event) => {
                                    handleCheck(event, yearIdx, courseIdx)
                                  }}
                                />
                                <label
                                  className="ml-2 block text-sm"
                                  htmlFor={`course-checkbox-${yearIdx}-${courseIdx}`}
                                >
                                  {course.acronym}
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
                    <button type="button" className="contact-button bg-slate-100" onClick={closeModal}>
                      Contacte-nos
                    </button>

                    <button type="button" className="confirm-button bg-rose-50" onClick={closeModal}>
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
    <div className="fixed inset-0 bg-darkest bg-opacity-25" />
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
