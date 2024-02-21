import { Major } from '../../../../../@types/new_index'
import { useState, useContext } from 'react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons//react/24/solid'
import MajorContext from '../../../../../contexts/MajorContext'
import { cn } from '../../../../../utils'
import { Button } from '../../../../../components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '../../../../../components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '../../../../../components/ui/popover'

/**
 * Combobox also with a searchbar in which the user will be able to write the major he / she
 * wants to select courses from. They can type the major or click on the rightmost corner to open
 * the list of possible majors.
 */
const MajorSearchCombobox = () => {
  const { majors, selectedMajor, setSelectedMajor } = useContext(MajorContext)
  const [open, setOpen] = useState(false)
  const [triggerWidth, setTriggerWidth] = useState<number | undefined>(undefined)

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

  const getDisplayMajorText = (major: Major) => (major === null ? '' : `${major?.name} (${major?.acronym})`)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          ref={(node) => {
            if (node) setTriggerWidth(node.offsetWidth)
          }}
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedMajor ? majors.find((major) => major.id === selectedMajor.id)?.name : 'Seleciona um curso...'}
          <ChevronUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent style={{ width: triggerWidth }} className="p-0">
        <Command
          filter={(value, search) => {
            const major = majors.find((major) => major.id === parseInt(value))
            return match(major?.name, search, true) ||
              match(major?.name, search, false) ||
              match(major?.acronym, search, true) ||
              match(major?.acronym, search, false)
              ? 1
              : 0
          }}
        >
          <CommandInput placeholder="Procurar curso..." className="h-9" />
          <CommandEmpty>Nenhum curso corresponde à tua pesquisa.</CommandEmpty>
          <CommandGroup className="h-fit max-h-64 overflow-y-auto scroll-smooth">
            {/* <ScrollArea className="h-64"> */}
            {majors.map((major) => (
              <CommandItem
                key={major.id}
                value={major.id.toString()}
                onSelect={(currentMajorId) => {
                  const currentMajor = majors.find((major) => major.id === parseInt(currentMajorId))
                  setSelectedMajor(currentMajor.id === selectedMajor.id ? null : currentMajor)
                  setOpen(false)
                }}
              >
                {getDisplayMajorText(major)}
                <CheckIcon
                  className={cn('ml-auto h-4 w-4', selectedMajor.id === major.id ? 'opacity-100' : 'opacity-0')}
                />
              </CommandItem>
            ))}
            {/* </ScrollArea> */}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default MajorSearchCombobox
