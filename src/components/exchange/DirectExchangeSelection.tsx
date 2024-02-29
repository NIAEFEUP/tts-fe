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


const ucClasses = [
    {
        value: "1",
        label: "3LEIC01",
    },
    {
        value: "2",
        label: "3LEIC02",
    },
    {
        value: "3",
        label: "3LEIC03",
    },
    {
        value: "4",
        label: "3LEIC04",
    },
    {
        value: "5",
        label: "3LEIC05",
    },

]

export function DirectExchangeSelection(props) {
    const [open, setOpen] = useState<boolean>(false)
    const [value, setValue] = useState<string>("")

    return (
        <div className="flex w-full justify-between space-x-4 items-center">
            <div className="flex flex-col space-y-2">
                <span className="font-bold">{props.UC}</span>
                <div className="flex flex-row items-center">
                    <Input disabled type="text" className="w-[80px] disabled:cursor-default disabled:opacity-100 placeholder:text-black dark:placeholder:text-white" placeholder={props.ucClass}></Input>
                    <span>
                        <ArrowRightIcon className="mx-2 h-5 w-5"></ArrowRightIcon>
                    </span>
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={open}
                                className="w-[150px] justify-between"
                            >
                                {value
                                    ? ucClasses.find((ucClass) => ucClass.value === value)?.label
                                    : "Escolher turma..."}
                                {/*<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />*/}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[180px] p-0">
                            <Command>
                                <CommandInput className="border-none focus:ring-0" placeholder="Procurar turma..." />
                                <CommandEmpty>Nenhuma turma encontrada.</CommandEmpty>
                                <CommandGroup>
                                    {ucClasses.map((ucClass) => (
                                        <CommandItem
                                            className="pl-2"
                                            key={ucClass.value}
                                            value={ucClass.value}
                                            onSelect={(currentValue) => {
                                                setValue(currentValue === value ? "" : currentValue)
                                                setOpen(false)
                                            }}
                                        >
                                            {ucClass.label}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </Command>
                        </PopoverContent>
                    </Popover>
                </div>
            </div>
            
            <div className="flex flex-col space-y-2">
                <span className="font-bold">Estudante</span>
                <Input />
            </div>
        </div>
    )
}
