import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { Button } from "../ui/button";
import { DirectExchangeSelection } from "./DirectExchangeSelection";
import { getStudentSchedule, logout } from "../../api/backend";
import { Dispatch, SetStateAction, useContext, useEffect, useRef, useState } from "react";
import { SessionContext } from "../../contexts/SessionContext";
import { useSchedule } from "../../api/hooks/useSchedule";
import { SubmitDirectExchangeButton } from "./SubmitDirectExchangeButton";
import { ClassExchange, CourseOption, ExchangeCourseUnit } from "../../@types";
import { MoonLoader } from "react-spinners";
import { convertSigarraCourseToTtsCourse } from "../../utils/utils";

type Props = {
    setCourseOptions: Dispatch<SetStateAction<CourseOption[]>>
    courseOptions: CourseOption[]
}

export function DirectExchange({
    courseOptions,
    setCourseOptions
}: Props) {

    const [currentDirectExchange, setCurrentDirectExchange] = useState<Map<string, ClassExchange>>(new Map<string, ClassExchange>());
    const [error, setError] = useState(null);


    useEffect(() => {
        // const fetchData = async () => {
        //     try {
        //         const data = await getStudentSchedule(username);
        //         if (data.status === 403) {
        //             setLoggedIn(false);
        //             await logout();
        //         } else {
        //             setSchedule(data.filter(course => course.tipo === "TP")
        //                 .map(course => ({
        //                     sigla: course.ucurr_sigla,
        //                     name: course.ucurr_nome,
        //                     class: course.turma_sigla,
        //                     code: course.ocorrencia_id
        //                 })));
        //             setCourseOptions(data.filter(course => course.tipo === "TP").map(course => {
        //                 const convertedCourse = convertSigarraCourseToTtsCourse(course);
        //                 return convertedCourse;
        //             }))
        //         }
        //     } catch (err) {
        //         setError(err);
        //     } finally {
        //         setIsLoading(false);
        //     }
        // };

        // fetchData();
    }, []);

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
                                    courseOptions={courseOptions}
                                    setCourseOptions={setCourseOptions}
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
