import classNames from 'classnames'
import { Combobox, Transition } from '@headlessui/react'
import { Major } from '../../../../../@types'
import { Fragment, useState, useEffect, SetStateAction } from 'react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons//react/24/solid'

type Props = {
  majors: Major[]
  majorHook: [Major, React.Dispatch<React.SetStateAction<Major>>]
}

/**
 * Combobox also with a searchbar in which the user will be able to write the major he / she
 * wants to select courses from. They can type the major or click on the rightmost corner to open
 * the list of possible majors.
 */
export const MajorSearchCombobox = ({ majors, majorHook }: Props) => {
  const [major, setMajor] = majorHook
  const [majorQuery, setMajorQuery] = useState<string>('')
  const [selected, setSelected] = useState<Major>(major)

  const match = (str: string, query: string, simple?: boolean) =>
    simple
      ? str.toLowerCase().replace(/\s+/g, '').includes(query.toLowerCase().replace(/\s+/g, ''))
      : str
          .toLowerCase()
          .normalize('NFD')
          .replace(/\p{Diacritic}/gu, '')
          .replace(/\s+/g, '')
          .replace('.', '')
          .replace(':', '')
          .includes(query.toLowerCase().replace(/\s+/g, ''))

  const filteredMajors =
    majors !== null && majors?.length !== 0 && Array.isArray(majors)
      ? majorQuery === ''
        ? majors
        : majors.filter(
            (major: Major) =>
              match(major?.name, majorQuery, true) ||
              match(major?.name, majorQuery, false) ||
              match(major?.acronym, majorQuery, true) ||
              match(major?.acronym, majorQuery, false)
          )
      : []

  const getDisplayMajorText = (major: Major) => (major === null ? '' : `${major?.name} (${major?.acronym})`)

  useEffect(() => {
    setMajorQuery((prev) => `${prev} `)
  }, [])

  return (
    <Combobox
      value={major}
      onChange={(value) => {
        setMajor(value)
        setSelected(value)
      }}
    >
      <div className="relative w-full rounded text-left">
        <Combobox.Input
          placeholder={
            window.matchMedia('(max-width: 1024px)').matches === true
              ? 'Pesquise o seu curso pelo nome ou sigla'
              : 'Escolha e/ou digite o nome ou sigla do seu ciclo de estudos'
          }
          className={classNames(
            selected !== null ? 'font-semibold' : '',
            'w-full rounded border-2 py-3 pl-4 pr-8 text-xs leading-5 md:text-sm',
            'border-gray-700/25 bg-gray-50 text-gray-700 focus:shadow focus:ring-0'
          )}
          displayValue={(major: Major) => getDisplayMajorText(major)}
          onChange={(event: { target: { value: SetStateAction<string> } }) => setMajorQuery(event.target.value)}
        />
        <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
          <ChevronUpDownIcon
            className="h-7 w-7 rounded-full py-0.5 text-gray-500 transition hover:bg-gray-100 hover:text-primary"
            aria-hidden="true"
          />
        </Combobox.Button>
      </div>

      <Transition
        as={Fragment}
        leave="transition ease-in duration-100"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
        afterLeave={() => setMajorQuery('')}
      >
        <Combobox.Options
          className="absolute z-50 mt-1.5 max-h-64 w-full overflow-auto rounded border
                    border-gray-500 bg-lightest py-2 text-xs dark:bg-lighter sm:text-sm"
        >
          {filteredMajors.length === 0 && majorQuery !== '' ? (
            <div className="relative cursor-pointer select-none py-2 px-4 text-gray-700 dark:text-white">
              Nenhum curso encontrado com este nome.
            </div>
          ) : (
            filteredMajors.map((major: Major, majorIdx: number) => (
              <Combobox.Option
                key={`major-${majorIdx}`}
                className={({ active }) =>
                  `relative cursor-pointer select-none py-2 px-3 ${major?.name !== '' ? 'pl-10' : 'pl-4'} ${
                    active ? 'bg-primary text-white' : 'text-gray-900'
                  }`
                }
                value={major}
              >
                {({ selected, active }) => (
                  <>
                    <span className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>
                      {getDisplayMajorText(major)}
                    </span>
                    {selected && (
                      <span
                        className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                          active ? 'text-white' : 'text-primary'
                        }`}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Combobox.Option>
            ))
          )}
        </Combobox.Options>
      </Transition>
    </Combobox>
  )
}
