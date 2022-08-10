import { Fragment } from 'react'
import { Transition, Menu } from '@headlessui/react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline'
import { MultipleOptions } from '../../@types'

type Props = {
  multipleOptionsHook: [MultipleOptions, React.Dispatch<React.SetStateAction<MultipleOptions>>]
}

const OptionsController = ({ multipleOptionsHook }: Props) => {
  const [options, setOptions] = multipleOptionsHook
  const optionIndexes = Array.from({ length: 10 }, (_, i) => i)

  const setNextOptionIndex = () => {
    setOptions((prev) => {
      const value = {
        index: prev.index + 1,
        selected: prev.options[prev.index + 1],
        options: [...prev.options],
      }

      return value
    })
  }

  const setPreviousOptionIndex = () => {
    setOptions((prev) => ({
      index: prev.index - 1,
      selected: prev.options[prev.index - 1],
      options: [...prev.options],
    }))
  }

  const setOptionIndex = (newIndex: number) => {
    setOptions((prev) => ({
      index: newIndex,
      selected: prev.options[newIndex],
      options: [...prev.options],
    }))
  }

  return (
    <div className="flex w-full rounded">
      <button
        disabled={options.index === 0}
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
          font-medium text-white transition hover:opacity-80 dark:bg-secondary lg:text-sm"
        >
          <span>Horário #{options.index + 1}</span>
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
          <Menu.Items
            className="absolute right-0 z-20 mt-2 flex w-full origin-top-right flex-col gap-1
            divide-y divide-gray-100 rounded-md bg-white p-1.5 shadow-lg"
          >
            {optionIndexes.map((index: number) => (
              <Menu.Item key={`schedule-option-${index}`}>
                {({ active }) => (
                  <button
                    onClick={() => setOptionIndex(index)}
                    className={`
                      ${active ? 'bg-secondary text-white' : ''}
                      ${index === options.index ? 'bg-secondary text-white' : !active && 'text-gray-900'}
                      group relative flex w-full cursor-pointer select-none items-center rounded px-2 py-2 text-sm 
                    `}
                  >
                    Horário {index + 1}
                  </button>
                )}
              </Menu.Item>
            ))}
          </Menu.Items>
        </Transition>
      </Menu>

      <button
        disabled={options.index === 9}
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
