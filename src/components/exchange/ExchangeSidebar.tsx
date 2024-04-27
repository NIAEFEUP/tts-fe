import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { DirectExchange } from "./DirectExchange";
import { Dispatch, SetStateAction, useContext, useEffect, useRef, useState } from "react";
import { CourseOption } from "../../@types";
import { SessionContext } from "../../contexts/SessionContext";
import { useSchedule } from "../../api/hooks/useSchedule";
import { StudentScheduleContext } from "../../contexts/StudentScheduleContext";
import { convertSigarraCoursesToTtsCourses } from "../../utils/utils";

type Props = {
    setCourseOptions: Dispatch<SetStateAction<CourseOption[]>>
    courseOptions: CourseOption[]
}

export const ExchangeSidebar = ({
    setCourseOptions,
    courseOptions
}: Props) => {
    const username = localStorage.getItem("username");

    const { loggedIn, setLoggedIn } = useContext(SessionContext);
    const originalSchedule = useRef([]);
    const {
        data: schedule,
        isLoading: isLoadingSchedule,
        isValidating: isValidatingSchedule
    } = useSchedule(username, setLoggedIn);

    console.log(schedule);

    useEffect(() => {
        if (!isLoadingSchedule && !isValidatingSchedule) {
            const tts_schedule = []

            schedule.forEach(course => {
                const convertedCourse = convertSigarraCoursesToTtsCourses([course]);
                tts_schedule.push(convertedCourse[0]);
            })

            setCourseOptions(tts_schedule);
            originalSchedule.current = [...tts_schedule];
        }

    }, [schedule, setCourseOptions, isLoadingSchedule, isValidatingSchedule])

    return (
        <StudentScheduleContext.Provider value={{ schedule, isLoadingSchedule, isValidatingSchedule, courseOptions, originalSchedule: originalSchedule.current }}>
            <div className="sidebar">
                <Tabs defaultValue="direta" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="direta">Troca direta</TabsTrigger>
                        <TabsTrigger value="indireta">Troca indireta</TabsTrigger>
                    </TabsList>
                    <TabsContent value="direta">
                        <DirectExchange courseOptions={courseOptions} setCourseOptions={setCourseOptions} />
                    </TabsContent>
                    <TabsContent value="indireta"></TabsContent>
                </Tabs>
            </div>
        </StudentScheduleContext.Provider>
    );
}
