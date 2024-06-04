"use client"

import { Dispatch, SetStateAction, useContext, useEffect, useState, useRef } from "react"
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

import { getClassScheduleSigarra, getCourseScheduleSigarra, getCourseStudents } from "../../api/backend"
import { ClassExchange, CourseOption, ExchangeCourseUnit } from "../../@types"
import { convertSigarraCoursesToTtsCourses } from "../../utils/utils"
import { DirectExchangeContext } from "../../contexts/DirectExchangeContext"
import { ExchangeStudentSelection } from "./ExchangeStudentSelection"
import { StudentScheduleContext } from "../../contexts/StudentScheduleContext"

type props = {
    courseOptions: CourseOption[],
    setCourseOptions: Dispatch<SetStateAction<CourseOption[]>>,
    uc: ExchangeCourseUnit,
    setSelectedStudents: Dispatch<SetStateAction<any[]>>,
    selectedStudents: any[],
};

export function DirectExchangeSelection({
    setCourseOptions,
    uc,
    setSelectedStudents,
    selectedStudents,
}: props) {
    const { marketplaceToggled, currentDirectExchange, setCurrentDirectExchange } = useContext(DirectExchangeContext);
    const { originalSchedule } = useContext(StudentScheduleContext);

    const [open, setOpen] = useState<boolean>(false);
    const [selectedToExchangeClass, setSelectedToExchangeClass] = useState<string>("");
    const [student, setStudent] = useState<string>("");
    const [isExchangeSelectionIncluded, setIsExchangeSelectionIncluded] = useState<boolean>(false);

    const [students, setStudents] = useState([]);
    const [studentOpen, setStudentOpen] = useState<boolean>(false);
    const [studentValue, setStudentValue] = useState<string>("");

    const [ucClasses, setUcClasses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getCourseScheduleSigarra(uc.code);
                setUcClasses(data.filter((otherUcClass) => otherUcClass.type === "TP" && uc.class !== otherUcClass.class).sort((a, b) => a.class.localeCompare(b.class))
                    .map(otherUcClass => ({ value: otherUcClass.class.toString(), label: otherUcClass.class })));

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
                            const originalCourseSchedule = originalSchedule.filter((courseOption) => courseOption.course.info.acronym === uc.acronym);
                            setCourseOptions((prev) => ([
                                ...(prev.filter(schedule => schedule.course.info.name !== uc.acronym)),
                                ...originalCourseSchedule
                            ]));
                            setIsExchangeSelectionIncluded(false);
                            setSelectedToExchangeClass("");
                            setStudent("");
                            currentDirectExchange.delete(uc.acronym);
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
                                    {selectedToExchangeClass
                                        ? selectedToExchangeClass.toUpperCase()
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
                                                onSelect={async (classId) => {
                                                    const selectedClassSchedule = await getClassScheduleSigarra(uc.code, otherStudentUcClass.label);
                                                    setCourseOptions((prev) => ([
                                                        ...(prev.filter(schedule => schedule.course.info.name !== uc.acronym)),
                                                        ...convertSigarraCoursesToTtsCourses(selectedClassSchedule),
                                                    ]));
                                                    currentDirectExchange.get(uc.acronym).old_class = otherStudentUcClass.value;

                                                    setSelectedToExchangeClass(classId === selectedToExchangeClass ? "" : classId)
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

                {!marketplaceToggled
                    ? <ExchangeStudentSelection
                        studentOpen={studentOpen}
                        setStudentOpen={setStudentOpen}
                        studentValue={studentValue}
                        setStudentValue={setStudentValue}
                        students={students}
                        student={student}
                        setStudent={setStudent}
                        uc={uc}
                        setSelectedStudents={setSelectedStudents}
                        selectedStudents={selectedStudents}
                    />
                    : ""}
            </>
                :
                <div className="flex flex-row items-center space-x-2 w-full">
                    <span className="font-bold text-center w-2/3">{uc.name}</span>
                    <Button variant="outline" className="w-1/3 bg-gray-100" onClick={() => {
                        setStudent("");
                        setStudentValue("");
                        setCurrentDirectExchange(
                            new Map(currentDirectExchange.set(uc.acronym, {
                                course_unit: uc.acronym,
                                course_unit_id: uc.code,
                                old_class: "",
                                new_class: uc.class, // auth student class
                                other_student: student
                            }))
                        );
                        setIsExchangeSelectionIncluded(true);
                    }}>Incluir</Button>
                </div>
            }
        </div >
    )
}
