import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { Button } from "../ui/button";
import { DirectExchangeSelection } from "./DirectExchangeSelection";
import { getStudentSchedule } from "../../api/backend";
import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { SessionContext } from "../../contexts/SessionContext";
import { SubmitDirectExchangeButton } from "./SubmitDirectExchangeButton";
import { ClassExchange, CourseOption } from "../../@types";

type props = {
    setCourseOptions: Dispatch<SetStateAction<CourseOption[]>>
}

export function DirectExchange({
    setCourseOptions
}) {
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
                } else {
                    setSchedule(data.filter(course => course.tipo === "TP")
                        .map(course => ({ ucSigla: course.ucurr_sigla, ucName: course.ucurr_nome, ucClass: course.turma_sigla, ucCode: course.ocorrencia_id })));
                    // setCourseOptions(data.filter(course => course.tipo === "TP").map(course => ({
                    //     shown: {
                    //         T: false,
                    //         TP: true,
                    //     },
                    //     locked: false,
                    //     course: {
                    //         checked: true,
                    //         info: {}
                    //     },
                    //     option: {
                    //         day: course.dia,
                    //         duration: course.aula_duracao,
                    //         start_time: course.hora_inicio,
                    //         location: course.sala_sigla,
                    //         lesson_type: course.tipo,
                    //         is_composed: false,
                    //         course_unit_id: course.ocorrencia_id,
                    //         last_updated: "",
                    //         composed_class_name: "",
                    //         professors_link: "",
                    //         professor_information: []
                    //     },
                    //     schedules: [{
                    //         day: course.dia,
                    //         duration: course.aula_duracao,
                    //         start_time: course.hora_inicio,
                    //         location: course.sala_sigla,
                    //         lesson_type: course.tipo,
                    //         is_composed: false,
                    //         course_unit_id: course.ocorrencia_id,
                    //         last_updated: "",
                    //         composed_class_name: "",
                    //         professors_link: "",
                    //         professor_information: []
                    //     }],
                    //     teachers: [],
                    //     filteredTeachers: []
                    // })))
                }
            } catch (err) {
                setError(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, [username]);

    if (isLoading) {
        return <p>Loading schedule...</p>;
    }

    if (error) {
        return <p>Error fetching schedule: {error.message}</p>;
    }

    return (
        <div className="flex justify-center flex-col space-y-4 mt-4">
            <Button variant="info" className="w-full">
                <InformationCircleIcon className="h-5 w-5 mr-2"></InformationCircleIcon>
                Como funcionam as trocas diretas?
            </Button>
            <SubmitDirectExchangeButton currentDirectExchange={currentDirectExchange} />
            {
                schedule.map((uc) => {
                    console.log("uc is: ", uc)
                    return (
                        <DirectExchangeSelection
                            setCurrentDirectExchange={setCurrentDirectExchange}
                            currentDirectExchange={currentDirectExchange}
                            ucName={uc.ucName}
                            ucSigla={uc.ucSigla}
                            ucClass={uc.ucClass}
                            ucCode={uc.ucCode}
                            key={uc.ucName}
                        />
                    )
                })
            }
        </div>
    );
}
