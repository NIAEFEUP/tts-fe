import { Fragment, useMemo } from 'react'
import { Lesson } from '../../../@types'
import { Dialog, Transition } from '@headlessui/react'
import Alert, { AlertType } from '../Alert'
import InspectLessonBox from './InspectLessonBox'
import { ClassInfo, SlotInfo, CourseInfo, ConflictInfo, ClassDescriptor } from '../../../@types/new_index'


type Props = {
  conflictsInfo: ConflictInfo,
  isOpenHook: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
}

const ConflictsPopover = ({ 
  conflictsInfo,
  isOpenHook 
}: Props) => {
  const [isOpen, setIsOpen] = isOpenHook
  
  // 1. Find better way to see the severe conflicts which are conflicts between tp and other tp classes.
  // We need to find a better way since before we were receiving a Lesson[] array, and now we are receiving an array
  // of conflict infos, which is far more intuitive
  //const severe = useMemo(() => lessons.filter((item) => item.schedule.lesson_type !== 'T').length > 1, [lessons])
  const severe = conflictsInfo.severe;

  const closeModal = () => {
    setIsOpen(false)
  }

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
          <div className="fixed inset-0 bg-black/50 dark:bg-black/50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center px-8 py-4 text-center">
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
                className="w-full max-w-5xl transform space-y-4 overflow-hidden rounded-2xl 
                bg-white p-6 text-left align-middle shadow-xl transition-all dark:bg-dark"
              >
                <Dialog.Title as="header">
                  <h3 className="mb-3 text-lg font-medium leading-none text-gray-700 dark:text-white">
                    Inspeção de Conflitos de Horários
                  </h3>
                  <Alert type={severe ? AlertType.error : AlertType.warning}>
                    <p>
                      Colisões com <strong>aulas teóricas</strong> são geralmente permitidas na maioria dos
                      casos. O mesmo <strong>não</strong> se verifica quando colidem <strong>aulas práticas</strong>.
                    </p>
                  </Alert>
                </Dialog.Title>

                <div className="flex h-full w-full items-center justify-start gap-4">
                  {conflictsInfo.conflictingClasses.map((classDescriptor: ClassDescriptor, lessonIdx: number) => (
                    <InspectLessonBox
                      key={`conflict-inspect-lesson-box-${lessonIdx}`}
                      courseInfo={classDescriptor.courseInfo}
                      classInfo={classDescriptor.classInfo}
                      slotInfo={classDescriptor.slotInfo} 
                    />
                  ))}
                </div>
                <footer className="flex justify-end">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded border-2 border-transparent bg-secondary px-4 py-2 text-sm font-medium 
                    text-white transition hover:opacity-80 focus:outline-none"
                  >
                    Ok, Entendido!
                  </button>
                </footer>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  )
}

export default ConflictsPopover
