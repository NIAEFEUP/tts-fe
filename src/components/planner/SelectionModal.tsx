import '../../styles/modal.css'
import { Fragment, SetStateAction, useState } from 'react'
import { Combobox, Dialog, Transition } from '@headlessui/react'
import { CheckIcon, SelectorIcon, AcademicCapIcon } from '@heroicons/react/solid'
import Alert, { AlertType } from './Alert'
import { Major } from '../../@types'

type Props = {
  majors: any
  openHook: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
  selectedMajorHook: [any, React.Dispatch<React.SetStateAction<any>>]
}

const SelectionModal = ({ majors, openHook, selectedMajorHook }: Props) => {
  const [isOpen, setIsOpen] = openHook
  const [query, setQuery] = useState('')
  const [selectedMajor, setSelectedMajor] = selectedMajorHook

  const filteredMajors =
    query === ''
      ? majors
      : majors.filter((major: Major) =>
          major.name.toLowerCase().replace(/\s+/g, '').includes(query.toLowerCase().replace(/\s+/g, ''))
        )

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center">
        {/* Edit button */}
        <button
          type="button"
          onClick={openModal}
          className="rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30"
        >
          Editar UCs
        </button>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <OuterMask />
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <InnerCustomTransition>
                <Dialog.Panel className="dialog">
                  <Dialog.Title as="header" className="dialog-header">
                    <AcademicCapIcon className="h-6 w-6 text-primary" aria-hidden="true" />
                    <h3 className="text-xl font-semibold leading-6 tracking-tight">Escolha de UCs</h3>
                  </Dialog.Title>

                  <Alert type={AlertType.info}>
                    Por favor selecione o seu curso principal, seguido das UCs pretendidas.
                  </Alert>

                  <Combobox value={selectedMajor} onChange={setSelectedMajor}>
                    <div className="relative mt-4">
                      <div className="relative w-full border-2 border-slate-200 overflow-hidden rounded text-left sm:text-sm">
                        <Combobox.Input
                          className="w-full bg-lighter py-4 px-4 leading-5 text-gray-900 focus:ring-0"
                          displayValue={(major: { name: string }) => major.name}
                          onChange={(event: { target: { value: SetStateAction<string> } }) =>
                            setQuery(event.target.value)
                          }
                        />
                        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-4">
                          <SelectorIcon className="h-6 w-6 text-gray-500" aria-hidden="true" />
                        </Combobox.Button>
                      </div>

                      <Transition
                        as={Fragment}
                        leave="transition ease-in duration-100"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                        afterLeave={() => setQuery('')}
                      >
                        <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md py-1 text-base bg-slate-50 sm:text-sm">
                          {majors.length === 0 && query !== '' ? (
                            <div className="relative cursor-default select-none py-2 px-4 text-gray-700">
                              Nothing found.
                            </div>
                          ) : (
                            majors.map((major: Major, majorIdx: number) => (
                              <Combobox.Option
                                key={majorIdx}
                                className={({ active }) =>
                                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                                    active ? 'bg-primary text-white' : 'text-gray-900'
                                  }`
                                }
                                value={major}
                              >
                                {({ selected, active }) => (
                                  <>
                                    <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
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

                  <footer className="flex items-center justify-between mt-8">
                    <button type="button" className="contact-button bg-slate-50" onClick={closeModal}>
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
    <div className="fixed inset-0 bg-black bg-opacity-25" />
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
