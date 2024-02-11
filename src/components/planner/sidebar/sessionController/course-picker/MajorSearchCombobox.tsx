import classNames from 'classnames'
import { Major } from '../../../../../@types'
import { Fragment, useState, useEffect, SetStateAction, useContext } from 'react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons//react/24/solid'
import MajorContext from '../../../../../contexts/MajorContext'

import { cn } from '../../../../../utils/utils'
import { Button } from '../../../../ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '../../../../ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '../../../../ui/popover'

/**
 * Combobox also with a searchbar in which the user will be able to write the major he / she
 * wants to select courses from. They can type the major or click on the rightmost corner to open
 * the list of possible majors.
 */
export const MajorSearchCombobox = () => {
  const { majors, setMajors, majorIndex, setMajorIndex } = useContext(MajorContext)
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState('')

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-[200px] justify-between">
          {/* TODO: verificar se no find em baixo podemos deixar a majorIndex ou se é preciso usar o value para comparar */}
          {value ? majors.find((major) => major.id === majorIndex)?.name : 'Selecionar curso...'}
          <ChevronUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="h-[300px] w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Procurar cursos..." />
          <CommandEmpty>Nenhum curso encontrado.</CommandEmpty>
          <CommandGroup>
            {majors.map((major) => (
              <CommandItem
                key={major.id.toString()}
                value={major.id.toString()}
                onSelect={(currentValue) => {
                  setValue(currentValue === value ? '' : currentValue)
                  setMajorIndex(currentValue === value ? null : major.id)
                  setOpen(false)
                }}
              >
                <CheckIcon
                  className={cn('mr-2 h-4 w-4', value === major.id.toString() ? 'opacity-100' : 'opacity-0')}
                />
                {major.name}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )

  // return (
  //   <Combobox
  //     value={majorIndex}
  //     onChange={(value) => {
  //       setMajorIndex(value)
  //     }}
  //   >
  //     <div className="relative w-full rounded text-left">
  //       <Combobox.Input
  //         placeholder={
  //           window.matchMedia('(max-width: 1024px)').matches === true
  //             ? 'Pesquise o seu curso pelo nome ou sigla'
  //             : 'Escolha e/ou digite o nome ou sigla do seu ciclo de estudos'
  //         }
  //         className={classNames(
  //           selected !== null ? 'font-semibold' : '',
  //           'w-full rounded border-2 py-3 pl-4 pr-8 text-xs leading-5 md:text-sm',
  //           'border-gray-700/25 bg-gray-50 text-gray-700 focus:shadow focus:ring-0'
  //         )}
  //         displayValue={(major: Major) => getDisplayMajorText(major)}
  //         onChange={(event: { target: { value: SetStateAction<string> } }) => setMajorQuery(event.target.value)}
  //       />
  //       <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
  //         <ChevronUpDownIcon
  //           className="h-7 w-7 rounded-full py-0.5 text-gray-500 transition hover:bg-gray-100 hover:text-primary"
  //           aria-hidden="true"
  //         />
  //       </Combobox.Button>
  //     </div>

  //     <Transition
  //       as={Fragment}
  //       leave="transition ease-in duration-100"
  //       leaveFrom="opacity-100"
  //       leaveTo="opacity-0"
  //       afterLeave={() => setMajorQuery('')}
  //     >
  //       <Combobox.Options
  //         className="absolute z-50 mt-1.5 max-h-64 w-full overflow-auto rounded border
  //                   border-gray-500 bg-lightest py-2 text-xs dark:bg-lighter sm:text-sm"
  //       >
  //         {filteredMajors.length === 0 && majorQuery !== '' ? (
  //           <div className="relative cursor-pointer select-none py-2 px-4 text-gray-700 dark:text-white">
  //             Nenhum curso encontrado com este nome.
  //           </div>
  //         ) : (
  //           filteredMajors.map((major: Major, majorIdx: number) => (
  //             <Combobox.Option
  //               key={`major-${majorIdx}`}
  //               className={({ active }) =>
  //                 `relative cursor-pointer select-none py-2 px-3 ${major?.name !== '' ? 'pl-10' : 'pl-4'} ${
  //                   active ? 'bg-primary text-white' : 'text-gray-900'
  //                 }`
  //               }
  //               value={major}
  //             >
  //               {({ selected, active }) => (
  //                 <>
  //                   <span className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>
  //                     {getDisplayMajorText(major)}
  //                   </span>
  //                   {selected && (
  //                     <span
  //                       className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
  //                         active ? 'text-white' : 'text-primary'
  //                       }`}
  //                     >
  //                       <CheckIcon className="h-5 w-5" aria-hidden="true" />
  //                     </span>
  //                   )}
  //                 </>
  //               )}
  //             </Combobox.Option>
  //           ))
  //         )}
  //       </Combobox.Options>
  //     </Transition>
  //   </Combobox>
  // )
}
