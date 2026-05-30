import { useState } from "react"
import { Popover } from "../../../ui/new/popover"
import { Button } from "../../../ui/new/button"
import { Command, CommandGroup, CommandItem } from "../../../ui/command"
import { Check, ChevronDown } from "lucide-react"

interface PageSizeSelectorProps {
  value: number
  onChange: (value: number) => void
}

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100]

export const PageSizeSelector = ({ value, onChange }: PageSizeSelectorProps) => {
  const [open, setOpen] = useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen} placement="bottom-start">
      <Popover.Trigger asChild>
        <Button variant="outline" className="justify-between w-32">
          {value}
          <ChevronDown size="18" />
        </Button>
      </Popover.Trigger>
      <Popover.Content className="w-32 p-0">
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
                <div className="flex flex-row items-center gap-x-2">
                  <div className="w-4 h-4">{value === size && <Check className="w-4 h-4" />}</div>
                  <p>{size}</p>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </Popover.Content>
    </Popover>
  )
}
