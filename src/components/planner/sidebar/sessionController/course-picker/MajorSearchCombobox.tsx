import { useState, useContext } from 'react'
import { CheckIcon, ChevronUpDownIcon } from '@heroicons//react/24/solid'
import { Command, CommandEmpty, CommandList, CommandItem, CommandInput } from '../../../../ui/command'
import { Major } from '../../../../../@types'
import MajorContext from '../../../../../contexts/MajorContext'
import { cn, plausible } from '../../../../../utils'
import { Button } from '../../../../ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '../../../../ui/popover'
import { AnalyticsTracker } from '../../../../../utils/AnalyticsTracker'

interface Props {
  selectedMajor: Major | null
  setSelectedMajor: (major: Major | null) => void
}

/**
 * Combobox also with a searchbar in which the user will be able to write the major he / she
 * wants to select courses from. They can type the major or click on the rightmost corner to open
 * the list of possible majors.
 */
const MajorSearchCombobox = ({ selectedMajor, setSelectedMajor }: Props) => {
  const { majors } = useContext(MajorContext)
  const [open, setOpen] = useState(false)
  const [triggerWidth, setTriggerWidth] = useState<number | undefined>(undefined)

  const match = (string: string, query: string) =>
    string.toLowerCase().replace(/\s+/g, '').includes(query.toLowerCase().replace(/\s+/g, ''))
    || string
      .toLowerCase()
      .normalize('NFD')
      .replace(/\p{Diacritic}/gu, '')
      .replace(/\s+/g, '')
      .replace('.', '')
      .replace(':', '')
      .includes(query.toLowerCase().replace(/\s+/g, ''))

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
          className="w-full justify-between dark:bg-darker dark:text-slate-50"
        >
          <p className="truncate">
            {selectedMajor ? selectedMajor.name : 'Seleciona um curso...'}
          </p>
          <ChevronUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent style={{ width: triggerWidth }} className="p-0">
        <Command
          className="dark:bg-darker w-full"
          filter={(value, search) => {
            if (value === 'remove') return 1
            const major = majors.find((major) => major.id === parseInt(value))
            if (!major) return 0;
            return Number(match(major.name, search) || match(major?.name, search) || match(major?.acronym, search) || match(major?.acronym, search))
          }}
        >
          <CommandInput placeholder="Procurar curso..." className="h-9" />
          <CommandEmpty>Nenhum curso corresponde à tua pesquisa.</CommandEmpty>
          <CommandList
            className="min-h-fit overflow-y-auto"
            // This is needed to allow scroll of the result contents with the mouse wheel. Without this,
            // the event would be handled by the <Popover> component, not allowing the <CommandList> to
            // handle that event and actually be scrollable with the mouse wheel
            onWheel={(e) => e.stopPropagation()}
          >
            <CommandItem value="remove" onSelect={() => setSelectedMajor(null)}>
              Remover Seleção
            </CommandItem>
            {majors &&
              majors.map((major) => (
                <CommandItem
                  key={major.id}
                  value={major.id.toString()}
                  onSelect={(currentMajorId) => {
                    const currentMajor = majors.find((major) => major.id === parseInt(currentMajorId))
                    setSelectedMajor(currentMajor.id === selectedMajor?.id ? null : currentMajor)
                    setOpen(false)

                    AnalyticsTracker.majorSelected(currentMajor)
                  }}
                >
                  {`${major.name} (${major.acronym}) - ${major.faculty_id.toUpperCase()}`}
                  <CheckIcon
                    className={cn('ml-auto h-4 w-4', selectedMajor?.id === major.id ? 'opacity-100' : 'opacity-0')}
                  />
                </CommandItem>
              ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export default MajorSearchCombobox
