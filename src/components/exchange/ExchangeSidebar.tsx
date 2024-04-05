import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { DirectExchange } from "./DirectExchange";
import { Dispatch, SetStateAction, useContext } from "react";
import { CourseOption } from "../../@types";
import { SessionContext } from "../../contexts/SessionContext";
import { useSchedule } from "../../api/hooks/useSchedule";

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
    const {
        data: schedule,
        isLoading: isScheduleLoading,
        isValidating: isScheduleValidating
    } = useSchedule(username, loggedIn);

    return (
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
    );
}
