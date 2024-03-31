import { useContext, useState } from "react";
import { DirectExchangeContext } from "../../contexts/DirectExchangeContext";
import { Button } from "../ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "../ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

export const ExchangeStudentSelection = ({
    studentOpen,
    setStudentOpen,
    studentValue,
    setStudentValue,
    students,
    student,
    setStudent,
    uc
}) => {
    const { currentDirectExchange, setCurrentDirectExchange } = useContext(DirectExchangeContext);
    const [searchTerm, setSearchTerm] = useState("");

    return <div className="flex flex-col space-y-2 w-full">
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
                <PopoverContent className="w-full p-2 max-h-[20em] overflow-y-auto">
                    <Command>
                        <CommandInput
                            className="border-none focus:ring-0"
                            placeholder="Procurar estudante..."
                            value={searchTerm}
                            onValueChange={(newTerm) => setSearchTerm(newTerm)}
                        />
                        <CommandEmpty>Nenhum estudante encontrado.</CommandEmpty>
                        <CommandGroup>
                            {students.filter((student) => student.codigo.startsWith(searchTerm)).map((student) => {
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
                                        }}
                                    >
                                        <div className="flex flex-col">
                                            <div>{student.codigo}</div>
                                            <div className="text-gray-600">{displayName}</div>
                                        </div>
                                    </CommandItem>
                                )
                            })}
                        </CommandGroup>
                    </Command>
                </PopoverContent>
            </Popover>
        </div>
    </div>

}
