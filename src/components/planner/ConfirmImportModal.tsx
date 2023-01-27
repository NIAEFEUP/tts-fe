import { Dialog, Transition } from '@headlessui/react'
import { XIcon,  CheckIcon} from '@heroicons/react/outline'
import { Fragment, useState } from 'react'

const ConfirmImportModal = (flag : boolean) => {
    const [isOpen, setIsOpen] = useState(flag)
  
    function closeModal() {
      setIsOpen(false)
    }
  
    return (
    <>
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
                        <Dialog.Panel
                        className="w-full w-1/4 h-50 transform overflow-hidden rounded-2xl bg-white p-6
                        text-left align-middle text-gray-700 shadow-xl transition-all dark:bg-dark dark:text-white"
                        >
                        <div className="flex justify-end">  
                        <button
                            type="button"
                            onClick={closeModal}
                            className="float-right rounded text-rose-700 transition hover:bg-rose-700 hover:text-white"
                            >
                            <XIcon className="h-6 w-6" />
                            </button> 
                        </div>    
                        <div className="flex justify-end">  
                            <div className="mx-auto">              
                                <Dialog.Title as="h1" className="text-2xl rounded-ld font-semibold leading-6 mx-auto">
                                    IMPORTAR  
                                </Dialog.Title>
                            </div>  
                        </div>   
                        <div className="mt-3 flex flex-col text-center">
                            <p>O seguinte processo irá substituir todos horários das unidades curriculares selecionadas.</p>
                        </div>

                        <div className="flex mt-8">
                            <button
                            type="button"
                            className="flex items-center space-x-2 mx-auto rounded bg-tertiary px-3 py-2 text-center text-sm font-medium text-white 
                            transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
                            onClick={closeModal}
                            >
                            <span>CONFIRMO</span>
                            <CheckIcon className="h-5 w-5" />
                            </button>
                            
                        </div>
                        </Dialog.Panel>
                    </Transition.Child>
                    </div>
                </div>
                </Dialog>
            </Transition>
        </>
    )

}

export default ConfirmImportModal
