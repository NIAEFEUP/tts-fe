"use client"

import { useEffect, useState } from "react"
import { ArrowRightIcon } from '@heroicons/react/24/outline'
import { Input } from '../ui/input'
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
import { getCourseScheduleSigarra } from "../../api/backend"


export function DirectExchangeSelection(props) {
    const [open, setOpen] = useState<boolean>(false);
    const [value, setValue] = useState<string>("");

    const [ucClasses, setUcClasses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getCourseScheduleSigarra(props.ucCode);
                setUcClasses(data.filter((ucClass) => ucClass.tipo === "TP").sort((a, b) => a.turma_sigla.localeCompare(b.turma_sigla))
                    .map(ucClass => ({ value: ucClass.aula_id.toString(), label: ucClass.turma_sigla})));

            } catch (err) {
                setError(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [props.ucCode]);

    if (isLoading) {
        return <p>Loading schedule...</p>;
    }

    if (error) {
        return <p>Error fetching schedule: {error.message}</p>;
    }

    return (
        <div className="flex w-full justify-between space-x-4 items-center">
            <div className="flex flex-col space-y-2">
                <span className="font-bold">{props.ucName}</span>
                <div className="flex flex-row items-center">
                    <Input disabled type="text" className="w-[85px] disabled:cursor-default disabled:opacity-100 placeholder:text-black dark:placeholder:text-white" placeholder={props.ucClass}></Input>
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
