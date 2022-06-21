import { Fragment } from 'react'
import { Lesson } from '../../../@types'
import { Dialog, Transition } from '@headlessui/react'
import ResponsiveLessonBox from './ResponsiveLessonBox'

type Props = {
  lessons: Lesson[]
  isOpenHook: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
}

const ConflictsPopover = ({ lessons, isOpenHook }: Props) => {
  const [isOpen, setIsOpen] = isOpenHook

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
          <div className="fixed inset-0 bg-black bg-opacity-25" />
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
                className="w-full max-w-3xl transform space-y-4 overflow-hidden rounded-2xl 
                bg-white p-6 text-left align-middle shadow-xl transition-all"
              >
                <Dialog.Title as="h3" className="text-lg font-medium leading-6 text-gray-700">
                  Inspeção de Conflitos de Horários
                </Dialog.Title>

                <div className="flex h-full w-full items-center justify-start gap-4">
                  {lessons.map((lesson: Lesson, lessonIdx: number) => (
                    <ResponsiveLessonBox
                      key={`responsive-lesson-box-${lessonIdx}`}
                      lesson={lesson}
                      conflict={false}
                      active={true}
                      extraClassNames="py-4 pl-4 pr-6 text-lg"
                    />
                  ))}
                </div>

                <footer className="flex justify-end">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded border-2 border-transparent text-white px-4 py-2 text-sm font-medium 
                    transition bg-teal-700 hover:opacity-80 focus:outline-none"
                  >
                    Entendido
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
