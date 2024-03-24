import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { Button } from "../ui/button";
import { DirectExchangeSelection } from "./DirectExchangeSelection";
import { getStudentSchedule, logout } from "../../api/backend";
import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { SessionContext } from "../../contexts/SessionContext";
import { SubmitDirectExchangeButton } from "./SubmitDirectExchangeButton";
import { ClassExchange, CourseOption, ExchangeCourseUnit } from "../../@types";
import { MoonLoader } from "react-spinners";
import { getProfessorInformationFromSigarraScheduleApi } from "../../utils/utils";

type Props = {
    setCourseOptions: Dispatch<SetStateAction<CourseOption[]>>
}

export function DirectExchange({
    setCourseOptions
}: Props) {
    const [currentDirectExchange, setCurrentDirectExchange] = useState<Map<string, ClassExchange>>(new Map<string, ClassExchange>());
    const [schedule, setSchedule] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const { loggedIn, setLoggedIn } = useContext(SessionContext);

    const username = localStorage.getItem("username");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getStudentSchedule(username);
                if (data.status === 403) {
                    setLoggedIn(false);
                    await logout();
                } else {
                    setSchedule(data.filter(course => course.tipo === "TP")
                        .map(course => ({
                            sigla: course.ucurr_sigla,
                            name: course.ucurr_nome,
                            class: course.turma_sigla,
                            code: course.ocorrencia_id
                        })));
                    setCourseOptions(data.filter(course => course.tipo === "TP").map(course => ({
                        shown: {
                            T: false,
                            TP: true,
                        },
                        locked: false,
                        course: {
                            checked: true,
                            info: {
                                id: parseInt(course.ocorrencia_id, 10),
                                course_id: parseInt(course.ocorrencia_id, 10),
                                course_unit_id: parseInt(course.ocorrencia_id, 10),
                                sigarra_id: parseInt(course.ocorrencia_id, 10),
                                course: course.ucurr_sigla,
                                name: course.ucurr_sigla,
                                acronym: course.ucurr_sigla,
                                url: "",
                                course_unit_year: 3,
                                semester: 2,
                                year: 2023,
                                schedule_url: "",
                                ects: 6,
                                last_updated: "none"
                            }
                        },
                        option: {
                            day: course.dia - 2,
                            duration: course.aula_duracao.toString(),
                            start_time: course.hora_inicio,
                            location: course.sala_sigla,
                            lesson_type: course.tipo,
                            is_composed: false,
                            class_name: course.turma_sigla,
                            course_unit_id: course.ocorrencia_id,
                            last_updated: "",
                            composed_class_name: "",
                            professors_link: "",
                            professor_information: []
                        },
                        schedules: [{
                            day: course.dia - 2,
                            duration: course.aula_duracao.toString(),
                            start_time: (course.hora_inicio / 3600).toString(),
                            location: course.sala_sigla,
                            lesson_type: course.tipo,
                            is_composed: false,
                            class_name: course.turma_sigla,
                            course_unit_id: course.ocorrencia_id,
                            last_updated: "",
                            composed_class_name: "",
                            professors_link: "",
                            professor_information: getProfessorInformationFromSigarraScheduleApi(course)
                        }],
                        teachers: [],
                        filteredTeachers: []
                    })))
                }
            } catch (err) {
                setError(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [username]);

    // if (isLoading) {
    //     return <p>Loading schedule...</p>;
    // }

    if (error) {
        return <p>Error fetching schedule: {error.message}</p>;
    }

    return <>
        <div className="flex justify-center flex-col space-y-4 mt-4">
            <Button variant="info" className="w-full">
                <InformationCircleIcon className="h-5 w-5 mr-2"></InformationCircleIcon>
                Como funcionam as trocas diretas?
            </Button>
            <SubmitDirectExchangeButton currentDirectExchange={currentDirectExchange} />
            {!isLoading ?
                <div>
                    {
                        schedule.map((uc) => {
                            return (
                                <DirectExchangeSelection
                                    setCurrentDirectExchange={setCurrentDirectExchange}
                                    currentDirectExchange={currentDirectExchange}
                                    uc={uc}
                                    key={uc.name}
                                />
                            )
                        })
                    }
                </div> : <div className="mt-4">
                    <MoonLoader className="mx-auto my-auto" loading={isLoading} />
                    <p className="text-center">A carregar os horários</p>
                </div>}
        </div>
    </>;
}
