import { useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../../../ui/popover'
import { Button } from '../../../ui/new/button'
import { Command, CommandGroup, CommandItem } from '../../../ui/command'
import { Check, ChevronDownIcon } from 'lucide-react'

interface PageSizeSelectorProps {
  value: number
  onChange: (value: number) => void
}

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100]

export const PageSizeSelector = ({ value, onChange }: PageSizeSelectorProps) => {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex flex-row gap-x-2">
          <p>{value}</p>
          <ChevronDownIcon className="w-5 h-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-36 p-0">
        <Command>
          <CommandGroup>
            {PAGE_SIZE_OPTIONS.map((size) => (
              <CommandItem
                key={size}
                onSelect={() => {
                  onChange(size)
                  setOpen(false)
                }}
              >
                <div className="flex flex-row gap-x-2 items-center">
                  <p>{size}</p>
                  {value === size && <Check className="w-4 h-4" />}
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
