import { Fragment } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Dialog, Transition } from '@headlessui/react'

const ConfirmationModal = ({isOpen, closeModal, confirmationAction}) => (
    <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10 text-sm" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-75" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex items-center justify-center min-h-full p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel
                  className="w-1/4 p-6 overflow-hidden text-left text-gray-700 align-middle transition-all transform bg-white shadow-xl h-50 rounded-2xl dark:bg-dark dark:text-white"
                >
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="float-right transition rounded text-rose-700 hover:bg-rose-700 hover:text-white"
                    >
                      <XMarkIcon className="w-6 h-6" />
                    </button>
                  </div>
                  <div className="flex justify-end">
                    <div className="mx-auto">
                      <Dialog.Title as="h1" className="mx-auto text-2xl font-semibold leading-6 rounded-ld">
                        A IMPORTAR
                      </Dialog.Title>
                    </div>
                  </div>
                  <div className="flex flex-col mt-3 text-center">
                    <p>O horário a ser importado é de um curso diferente do selecionado. Se continuar, as suas <b>opções atuais serão perdidas</b>.</p>
                  </div>

                  <div className="flex mt-8">
                    <button
                      type="button"
                      className="flex items-center px-3 py-2 mx-auto mr-3 space-x-2 text-sm font-medium text-center text-white transition bg-gray-500 rounded hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
                      onClick={closeModal}
                    >
                      <span>Cancelar</span>
                    </button>
                    <button
                      type="button"
                      className="flex items-center px-3 py-2 mx-auto ml-3 space-x-2 text-sm font-medium text-center text-white transition rounded bg-tertiary hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
                      onClick={confirmationAction}
                    >
                      <span>Importar</span>
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
)

export default ConfirmationModal;