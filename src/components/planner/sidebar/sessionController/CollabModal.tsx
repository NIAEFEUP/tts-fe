import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { XMarkIcon, PlayCircleIcon } from '@heroicons/react/24/solid';
import { UserGroupIcon } from '@heroicons/react/24/solid';

const CollabModal = ({ isOpen, closeModal }) => {
  return (
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

        <div className="fixed inset-0 overflow-y-auto" >
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
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-600"
                    onClick={closeModal}
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
                <div className="text-center">
                  <UserGroupIcon className="h-40 w-40 mx-auto text-primary" />
                  <h3 className="mt-4 text-xl font-bold  leading-6 text-primary">
                    Colaboração ao vivo...
                  </h3>
            
                  <p className="mt-2 text-sm text-gray-600">
                    <span className="font-bold block">Podes convidar amigos para as tuas opções para colaborar contigo. </span>Não te preocupes, todas as tuas opções continuam a guardar localmente no teu dispositivo.
                  </p>
                  <button
                    type="button"
                    className="mt-4 pass inline-flex items-center px-4 py-4 bg-primary text-white text-sm font-medium rounded-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
                  >
                    <PlayCircleIcon className="h-8 w-8 mr-2" />
                    Iniciar sessão
                  </button>
                </div>
                <div className="mt-6 text-center">
                    <h4 className="text-md font-medium text-gray-900">Sessões anteriores</h4>
                    <p className="text-sm text-gray-600">
                        As sessões têm um tempo de vida, pelo que se não quiseres perder as tuas opções, terás de guardar para o teu dispositivo localmente
                    </p>
                    <ul className="mt-4 grid grid-cols-1 gap-y-4">
                        <li className="grid grid-cols-7 items-center text-sm text-gray-800 gap-4">
                            <span className="col-span-2 truncate whitespace-nowrap">asdipuhaosd</span>
                            <span className="col-span-2 text-gray-600 truncate whitespace-nowrap">editado há 3 dias</span>
                            <span className="col-span-2 text-gray-600 truncate whitespace-nowrap">expira em 1 semana</span>
                            <div className="col-span-1 flex justify-end space-x-4">
                                <a href="#" className="text-red-600 hover:underline">Entrar</a>
                                <button className="text-red-600 hover:text-red-800">&times;</button>
                            </div>
                        </li>
                        <li className="grid grid-cols-7 items-center text-sm text-gray-800 gap-4">
                            <span className="col-span-2 truncate whitespace-nowrap">uyavfiuya8gf3</span>
                            <span className="col-span-2 text-gray-600 truncate whitespace-nowrap">editado há 1 semana</span>
                            <span className="col-span-2 text-gray-600 truncate whitespace-nowrap">expira em 14 dias</span>
                            <div className="col-span-1 flex justify-end space-x-4">
                                <a href="#" className="text-red-600 hover:underline">Entrar</a>
                                <button className="text-red-600 hover:text-red-800">&times;</button>
                            </div>
                        </li>
                    </ul>
                </div>

              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default CollabModal;
