"use client"

import { useState } from "react"
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { Input } from '../ui/input'
import { Select } from '../ui/select'
import { SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@radix-ui/react-select'
import { cn } from "../../utils/utils"
import { Button } from "../ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "../ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "../ui/popover"


const frameworks = [
    {
        value: "next.js",
        label: "Next.js",
    },
    {
        value: "sveltekit",
        label: "SvelteKit",
    },
    {
        value: "nuxt.js",
        label: "Nuxt.js",
    },
    {
        value: "remix",
        label: "Remix",
    },
    {
        value: "astro",
        label: "Astro",
    },
]

export function DirectExchangeSelection(props) {
    const [open, setOpen] = useState<boolean>(false)
    const [value, setValue] = useState<string>("")

    return (
        <div className="flex w-full justify-between">
            <div className="mt-4 flex flex-col space-y-4">
                <p>{props.UC}</p>
                <div className="flex flex-row items-center">
                    <span className="w-fit bg-slate-200 p-2 text-center">{props.Class}</span>
                    <span>
                        <ArrowRightIcon className="mx-2 h-5 w-5"></ArrowRightIcon>
                    </span>
                </div>
            </div>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        className="w-[200px] justify-between"
                    >
                        {value
                            ? frameworks.find((framework) => framework.value === value)?.label
                            : "Select framework..."}
                        {/*<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />*/}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                    <Command>
                        <CommandInput placeholder="Search framework..." />
                        <CommandEmpty>No framework found.</CommandEmpty>
                        <CommandGroup>
                            {frameworks.map((framework) => (
                                <CommandItem
                                    key={framework.value}
                                    value={framework.value}
                                    onSelect={(currentValue) => {
                                        setValue(currentValue === value ? "" : currentValue)
                                        setOpen(false)
                                    }}
                                >
                                    {/*<Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === framework.value ? "opacity-100" : "opacity-0"
                                        )}
                                    />*/}
                                    {framework.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </Command>
                </PopoverContent>
            </Popover>
            <div className="mt-4 flex flex-col space-y-4">
                <p>Estudante</p>
                <Input></Input>
            </div>
        </div>
    )
}
