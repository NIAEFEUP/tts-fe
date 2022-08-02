import { Dialog, Transition } from '@headlessui/react'
import { XIcon, LightBulbIcon } from '@heroicons/react/outline'
import { Fragment, useState } from 'react'

const ScheduleColorLabels = () => {
  const [isOpen, setIsOpen] = useState(false)

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }

  return (
    <div className="mt-4">
      <div className="w-full">
        <button
          type="button"
          onClick={openModal}
          className="inline-flex w-full items-center justify-center gap-1 rounded bg-secondary p-2 text-center text-sm font-normal text-white 
            transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span>Ver tipos de aulas</span>
          <LightBulbIcon className="h-5 w-5" />
        </button>
      </div>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
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

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <header className="flex items-center justify-between">
                    <Dialog.Title as="h3" className="text-xl font-semibold leading-6 text-secondary">
                      Tipos de aulas
                    </Dialog.Title>

                    <button
                      type="button"
                      onClick={closeModal}
                      className="rounded p-1 text-secondary transition hover:bg-secondary hover:text-white"
                    >
                      <XIcon className="h-6 w-6" />
                    </button>
                  </header>

                  <p className="mt-2 text-sm text-gray-600 ">
                    Existem muitos tipos de aula nos sistemas do SIGARRA. Nesta plataforma estão identificados os
                    seguintes:
                  </p>

                  <div className="mt-4">
                    <div className="flex flex-col space-y-1 text-sm 2xl:space-y-2 2xl:text-base">
                      <div className="inline-flex items-center gap-1 lg:gap-1.5">
                        <span className="h-3.5 w-3.5 rounded bg-schedule-t/80 shadow 2xl:h-4 2xl:w-4" />
                        <span>Teórica</span>
                      </div>
                      <div className="inline-flex items-center gap-1 lg:gap-1.5">
                        <span className="h-3.5 w-3.5 rounded bg-schedule-tp/80 shadow 2xl:h-4 2xl:w-4" />
                        <span>Teórico-Prática</span>
                      </div>
                      <div className="inline-flex items-center gap-1 lg:gap-1.5">
                        <span className="h-3.5 w-3.5 rounded bg-schedule-pl/80 shadow 2xl:h-4 2xl:w-4" />
                        <span>Prática Laboratorial</span>
                      </div>
                      <div className="inline-flex items-center gap-1 lg:gap-1.5">
                        <span className="h-3.5 w-3.5 rounded bg-schedule-ot/80 shadow 2xl:h-4 2xl:w-4" />
                        <span>Orientação Tutorial</span>
                      </div>
                      <div className="inline-flex items-center gap-1 lg:gap-1.5">
                        <span className="h-3.5 w-3.5 rounded bg-schedule-s/80 shadow 2xl:h-4 2xl:w-4" />
                        <span>Seminário</span>
                      </div>
                      <div className="inline-flex items-center gap-1 lg:gap-1.5">
                        <span className="h-3.5 w-3.5 rounded bg-schedule-p/80 shadow 2xl:h-4 2xl:w-4" />
                        <span>Prática</span>
                      </div>
                      <div className="inline-flex items-center gap-1 lg:gap-1.5">
                        <span className="h-3.5 w-3.5 rounded bg-schedule-tc/80 shadow 2xl:h-4 2xl:w-4" />
                        <span>Teórica de Campo</span>
                      </div>
                      <div className="inline-flex items-center gap-1 lg:gap-1.5">
                        <span className="h-3.5 w-3.5 rounded bg-schedule-other/80 shadow 2xl:h-4 2xl:w-4" />
                        <span>Outros</span>
                      </div>
                    </div>
                  </div>

                  <footer className="mt-6">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="w-full rounded bg-secondary p-2 text-white transition hover:opacity-80"
                    >
                      Ok, entendido!
                    </button>
                  </footer>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  )
}

export default ScheduleColorLabels
