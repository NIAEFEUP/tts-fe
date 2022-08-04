import { Fragment } from 'react'
import { Transition, Menu } from '@headlessui/react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline'

type Props = {
  optionIndexHook: [number, React.Dispatch<React.SetStateAction<number>>]
}

const OptionsController = ({ optionIndexHook }: Props) => {
  const [optionIndex, setOptionIndex] = optionIndexHook
  const scheduleOptions = Array.from({ length: 10 }, (_, i) => i)
  const setNextOptionIndex = () => setOptionIndex((idx) => idx + 1)
  const setPreviousOptionIndex = () => setOptionIndex((idx) => idx - 1)

  return (
    <div className="flex w-full rounded">
      <button
        disabled={optionIndex === 0}
        onClick={setPreviousOptionIndex}
        title="Ver opção de horário anterior"
        className="w-min items-center justify-center gap-1.5 rounded-l border-2 border-transparent bg-secondary px-3 py-2
        text-center text-sm font-normal text-white transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ChevronLeftIcon className="h-5 w-5" />
      </button>

      <Menu as="div" className="relative inline-block w-full text-left">
        <Menu.Button
          title="Escolher uma opção de horário"
          className="flex h-auto w-full items-center justify-center space-x-2 border-2 border-secondary bg-secondary px-2 py-3 text-xs 
          font-medium text-white transition hover:opacity-80 dark:bg-secondary/10 lg:text-sm"
        >
          <span>Horário #{optionIndex + 1}</span>
        </Menu.Button>
        <Transition
          as={Fragment}
          enter="transition ease-out duration-100"
          enterFrom="transform opacity-0 scale-95"
          enterTo="transform opacity-100 scale-100"
          leave="transition ease-in duration-75"
          leaveFrom="transform opacity-100 scale-100"
          leaveTo="transform opacity-0 scale-95"
        >
          <Menu.Items className="absolute right-0 z-20 mt-2 w-full origin-top-right divide-y divide-gray-100 rounded-md bg-white p-2 shadow-lg">
            {scheduleOptions.map((scheduleOption: number) => (
              <Menu.Item>
                <button
                  className="group relative flex w-full cursor-default select-none items-center rounded 
                  px-2 py-2 text-sm text-gray-900 hover:bg-secondary/75 hover:text-white hover:dark:bg-secondary/75"
                >
                  Horário {scheduleOption + 1}
                </button>
              </Menu.Item>
            ))}
          </Menu.Items>
        </Transition>
      </Menu>

      <button
        disabled={optionIndex === 9}
        onClick={setNextOptionIndex}
        title="Ver opção de horário seguinte"
        className="w-min items-center justify-center gap-1.5 rounded-r border-2 border-transparent bg-secondary px-3 py-2
        text-center text-sm font-normal text-white transition hover:opacity-80 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <ChevronRightIcon className="h-5 w-5" />
      </button>
    </div>
  )
}

export default OptionsController
