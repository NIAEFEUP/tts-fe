import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon, LightBulbIcon } from '@heroicons/react/24/outline'
import { Fragment, useState } from 'react'

const LessonTypesModal = () => {
  const [isOpen, setIsOpen] = useState(false)

  function closeModal() {
    setIsOpen(false)
  }

  function openModal() {
    setIsOpen(true)
  }

  return (
    <>
      <div className="w-full">
        <button
          type="button"
          onClick={openModal}
          className="inline-flex w-full items-center justify-center gap-1.5 whitespace-nowrap rounded bg-secondary p-2 
          text-center text-sm font-normal text-white transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <span>Tipos de aula</span>
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
            <div className="fixed inset-0 bg-black/50 dark:bg-black/50" />
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
                <Dialog.Panel className="w-full max-w-xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-dark">
                  <header className="flex items-center justify-between">
                    <Dialog.Title as="h3" className="text-xl font-semibold leading-6 text-secondary dark:text-white">
                      Tipos de aulas
                    </Dialog.Title>

                    <button
                      type="button"
                      onClick={closeModal}
                      className="rounded p-1 text-secondary transition hover:bg-secondary hover:text-white dark:text-white"
                    >
                      <XMarkIcon className="h-6 w-6" />
                    </button>
                  </header>

                  <p className="mt-2 text-sm text-gray-600 dark:text-white">
                    Existem muitos tipos de aula nos sistemas do SIGARRA. Nesta plataforma estão identificados os
                    seguintes:
                  </p>

                  <div className="mt-4 "></div>

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
    </>
  )
}

export default LessonTypesModal
