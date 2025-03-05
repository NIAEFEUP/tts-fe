import { Dialog, Transition } from '@headlessui/react';
import { useContext, useState } from 'react';
import { Fragment } from 'react/jsx-runtime';
import { XMarkIcon } from '@heroicons/react/24/solid';
import CourseContext from '../../contexts/CourseContext';
import MultipleOptionsContext from '../../contexts/MultipleOptionsContext';
import { Button } from '../ui/button';
import { importSchedule } from '../../utils/ImportSchedule';
import { CheckCircleIcon,  TrashIcon } from '@heroicons/react/24/outline';

const PasteOptionModal = ({ pastedClasses } : { pastedClasses : string }) => {
  const [isModalOpen, setIsModalOpen] = useState(true);
  const closeModal = () => setIsModalOpen(false);
  const { pickedCourses,setPickedCourses } = useContext(CourseContext);
  const { multipleOptions,setMultipleOptions } = useContext(MultipleOptionsContext);
  const [ selectedCopyOption,setSelectedCopyOption ] = useState(-1);

  return (
    <Transition appear show={isModalOpen} as={Fragment}>
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
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white dark:bg-dark p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-600"
                    onClick={closeModal}
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>
                <p className='pb-5 dark:text-white font-bold'>
                  Escolha um horário para copiar e substituir:
                </p>
                <div className="grid grid-cols-3 md:grid-cols-5 lg:flex lg:flex-row gap-2 transition-colors duration-300 dark:group-hover:text-white group-hover:text-slate-700" >
                  {
                    [...multipleOptions].map((option,key) => {
                      return (
                        <Button
                          key={key}
                          variant='icon'
                          className={`flex-grow bg-lightish dark:bg-darkish 
                                    ${selectedCopyOption === option.id
                                      ? 'bg-primary/75 dark:bg-primary/50'
                                      : 'bg-lightish dark:bg-darkish'}`}
                          onClick={() => {
                            setSelectedCopyOption(option.id)
                          }}
                        >
                          <img src={option.icon} className="w-5 h-5 transform duration-200 ease-in-out group-hover:mt-3" alt={option.name} />
                        </Button> 
                      )
                    })
                  }
                </div>
                <div className='justify-end flex flex-col lg:flex-row gap-2 mt-10'>
                  <Button
                    onClick={closeModal}
                    variant="icon"
                    className="bg-lightish text-darkish gap-1.5"
                  >
                    <TrashIcon className="h-5 w-5" />
                    <span>Cancelar</span>
                  </Button>
                  <Button 
                    disabled={selectedCopyOption == -1}
                    variant="icon" className="bg-primary gap-1.5"
                    onClick={() => {
                      importSchedule(
                        pastedClasses,
                        multipleOptions,
                        setMultipleOptions,
                        selectedCopyOption,
                        pickedCourses,
                        setPickedCourses
                      )
                      closeModal()
                    }}
                  >
                    <CheckCircleIcon className="h-5 w-5" />
                    <p>Está feito</p>
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default PasteOptionModal