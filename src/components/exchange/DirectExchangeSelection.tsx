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
import { getCourseScheduleSigarra, getCourseStudents } from "../../api/backend"
import { ClassExchange, CourseOption, ExchangeCourseUnit } from "../../@types"

type props = {
    setCurrentDirectExchange: Dispatch<SetStateAction<Map<string, ClassExchange>>>,
    currentDirectExchange: Map<string, ClassExchange>,
    uc: ExchangeCourseUnit,
    setSelectedStudents: Dispatch<SetStateAction<any[]>>,
    selectedStudents: any[],
};

export function DirectExchangeSelection({
    setCurrentDirectExchange,
    currentDirectExchange,
    uc,
    setSelectedStudents,
    selectedStudents,
}: props) {
    const [open, setOpen] = useState<boolean>(false);
    const [value, setValue] = useState<string>("");
    const [selectedClass, setSelectedClass] = useState<string>("");
    const [student, setStudent] = useState<string>("");
    const [isExchangeSelectionIncluded, setIsExchangeSelectionIncluded] = useState<boolean>(false);

    const [students, setStudents] = useState([]);
    const [studentOpen, setStudentOpen] = useState<boolean>(false);
    const [studentValue, setStudentValue] = useState<string>("");
    const [searchTerm, setSearchTerm] = useState('');

    const [ucClasses, setUcClasses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getCourseScheduleSigarra(uc.code);
                setUcClasses(data.filter((otherUcClass) => otherUcClass.tipo === "TP" && uc.class !== otherUcClass.turma_sigla).sort((a, b) => a.turma_sigla.localeCompare(b.turma_sigla))
                    .map(otherUcClass => ({ value: otherUcClass.aula_id.toString(), label: otherUcClass.turma_sigla })));

                const studentsData = await getCourseStudents(uc.code);
                setStudents(studentsData);
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

    return (
        <div className="flex flex-col w-full justify-between space-y-4 items-start border-2 border-gray-200 shadow-sm bg-white p-4 mb-4 rounded-md">
            {isExchangeSelectionIncluded ? <>
                <div className="flex flex-col space-y-2 w-full">
                    <div className="flex flex-row justify-between">
                        <span className="font-bold text-center">{uc.name}</span>
                        <Button variant="destructive" className="w-4 h-6" onClick={() => {
                            setIsExchangeSelectionIncluded(false);
                            setValue("");
                            setSelectedClass("");
                            setStudent("");
                            currentDirectExchange.delete(uc.sigla);
                            setCurrentDirectExchange(currentDirectExchange);
                        }}>-</Button>
                    </div>
                    <div className="flex flex-row items-center space-x-2 w-full">
                        <Input disabled type="text" className="w-1/3 disabled:cursor-default disabled:opacity-100 placeholder:text-black dark:placeholder:text-white" placeholder={uc.class}></Input>
                        <span>
                            <ArrowRightIcon className="h-5 w-full"></ArrowRightIcon>
                        </span>
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={open}
                                    className="w-2/3 justify-between"
                                >
                                    {value
                                        ? ucClasses.find((ucClass) => ucClass.value === value)?.label
                                        : "Escolher turma..."}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0 max-h-[215px] overflow-y-auto">
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

                <div className="flex flex-col space-y-2 w-full">
                    <span className="font-bold text-sm">Estudante</span>
                    <div className="flex items-center">
                        <Popover open={studentOpen} onOpenChange={setStudentOpen}>
                            <PopoverTrigger asChild>
                                <Button
                                    variant="outline"
                                    role="combobox"
                                    aria-expanded={studentOpen}
                                    className="w-full justify-between"
                                >
                                    {studentValue
                                        ? students.find((student) => student.codigo === studentValue)?.codigo
                                        : "Escolher estudante..."}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-full p-0 max-h-[215px] overflow-y-auto">
                                <Command>
                                    <CommandInput
                                        className="border-none focus:ring-0"
                                        placeholder="Procurar estudante..."
                                        value={searchTerm}
                                        onValueChange={(newTerm) => setSearchTerm(newTerm)}
                                    />
                                    <CommandEmpty>Nenhum estudante encontrado.</CommandEmpty>
                                    <CommandGroup>
                                        {
                                            [...selectedStudents, ...students]
                                            .filter((student, index, self) =>
                                                index === self.findIndex((s) => s.codigo === student.codigo)
                                            )
                                            .filter((student) => student.codigo.startsWith(searchTerm))
                                            .map((student) => {
                                                const nameParts = student.nome.split(' ');
                                                const displayName = `${nameParts[0]} ${nameParts[nameParts.length - 1]}`;
                                                return (
                                                <CommandItem
                                                    className="pl-2"
                                                    key={student.codigo}
                                                    value={student.codigo}
                                                    onSelect={(currentValue) => {
                                                    setStudent(currentValue);
                                                    const exchange = currentDirectExchange.get(uc.sigla);
                                                    exchange.other_student = currentValue;
                                                    setCurrentDirectExchange(
                                                        new Map(currentDirectExchange.set(uc.sigla, exchange))
                                                    )
                                                    setStudentValue(currentValue === studentValue ? "" : currentValue)
                                                    setStudentOpen(false)
                                                    setSelectedStudents([student, ...selectedStudents]);
                                                    }}
                                                >
                                                    <div className="flex flex-col">
                                                    <div>{student.codigo}</div>
                                                    <div className="text-gray-600">{displayName}</div>
                                                    </div>
                                                </CommandItem>
                                                )
                                            })
                                        }
                                        </CommandGroup>
                                </Command>
                            </PopoverContent>
                        </Popover>
                    </div>
                </div>
            </>
                :
                <div className="flex flex-row items-center space-x-2 w-full">
                    <span className="font-bold text-center w-2/3">{uc.name}</span>
                    <Button variant="outline" className="w-1/3 bg-gray-100" onClick={() => setIsExchangeSelectionIncluded(true)}>Incluir</Button>
                </div>
            }
        </div>
    )
}
