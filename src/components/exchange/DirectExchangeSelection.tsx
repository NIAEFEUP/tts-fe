"use client"

import { Dispatch, SetStateAction, useEffect, useState } from "react"
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
import { ClassExchange, CourseOption, ExchangeCourseUnit } from "../../@types"

type props = {
    setCurrentDirectExchange: Dispatch<SetStateAction<Map<string, ClassExchange>>>,
    currentDirectExchange: Map<string, ClassExchange>,
    uc: ExchangeCourseUnit
};

export function DirectExchangeSelection({
    setCurrentDirectExchange,
    currentDirectExchange,
    uc
}: props) {
    const [open, setOpen] = useState<boolean>(false);
    const [value, setValue] = useState<string>("");
    const [selectedClass, setSelectedClass] = useState<string>("");
    const [student, setStudent] = useState<string>("");
    const [include, setInclude] = useState<boolean>(false);

    const [ucClasses, setUcClasses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getCourseScheduleSigarra(uc.code);
                setUcClasses(data.filter((otherUcClass) => otherUcClass.tipo === "TP" && uc.class !== otherUcClass.turma_sigla).sort((a, b) => a.turma_sigla.localeCompare(b.turma_sigla))
                    .map(otherUcClass => ({ value: otherUcClass.aula_id.toString(), label: otherUcClass.turma_sigla })));

            } catch (err) {
                setError(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [uc.code]);

    if (isLoading) {
        return <p>Loading schedule...</p>;
    }

    if (error) {
        return <p>Error fetching schedule: {error.message}</p>;
    }

    return <>
        { include ?
            <div className="flex w-full justify-between space-x-1 items-end">
                <div className="flex flex-col space-y-2 w-4/6">
                    <span className="font-bold">{uc.name}</span>
                    <div className="flex flex-row items-center">
                        <Input disabled type="text" className="w-[85px] disabled:cursor-default disabled:opacity-100 placeholder:text-black dark:placeholder:text-white" placeholder={uc.class}></Input>
                        <span>
                            <ArrowRightIcon className="mx-2 h-5 w-5"></ArrowRightIcon>
                        </span>
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={open}
                                    className="w-full justify-between"
                                >
                                    {value
                                        ? ucClasses.find((ucClass) => ucClass.value === value)?.label
                                        : "Escolher turma..."}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-1/2 p-0">
                                <Command>
                                    <CommandInput className="border-none focus:ring-0" placeholder="Procurar turma..." />
                                    <CommandEmpty>Nenhuma turma encontrada.</CommandEmpty>
                                    <CommandGroup>
                                        {ucClasses.map((otherStudentUcClass) => (
                                            <CommandItem
                                                className="pl-2"
                                                key={otherStudentUcClass.value}
                                                value={otherStudentUcClass.value}
                                                onSelect={(currentValue) => {
                                                    setCurrentDirectExchange(
                                                        new Map(currentDirectExchange.set(uc.sigla, {
                                                            course_unit: uc.sigla,
                                                            old_class: otherStudentUcClass.label,
                                                            new_class: uc.class, // auth student class
                                                            other_student: student
                                                        }))
                                                    )
                                                    setSelectedClass(currentValue);
                                                    setValue(currentValue === value ? "" : currentValue)
                                                    setOpen(false)
                                                }}
                                            >
                                                {otherStudentUcClass.label}
                                            </CommandItem>
                                        ))}
                                    </CommandGroup>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>

                <div className="flex flex-row w-2/6">
                    <div className="flex flex-col space-y-2">
                        <span className="font-bold">Estudante</span>

                        <div className="flex flex-row space-x-1">
                            <Input onChange={(event) => {
                                setStudent(event.target.value);
                                const exchange = currentDirectExchange.get(uc.sigla);
                                exchange.other_student = event.target.value;
                                setCurrentDirectExchange(
                                    new Map(currentDirectExchange.set(uc.sigla, exchange))
                                )
                            }} value={student} />

                            <Button variant="destructive" className="w-1/5" onClick={() => {
                                setInclude(false);
                                setValue("");
                                setSelectedClass("");
                                setStudent("");
                                currentDirectExchange.delete(uc.sigla);
                                setCurrentDirectExchange(currentDirectExchange);
                            }}>-</Button>
                        </div>
                    </div>
                    </div>
            </div>
            :
            <div className="flex w-full justify-between space-x-4 items-center">
                <div className="flex flex-col space-y-2 w-full">
                    <span className="font-bold">{uc.name}</span>
                    <Button variant="outline" className="w-full" onClick={() => setInclude(true)}>Incluir</Button>
                </div>
            </div> 
        }
    </>
}
