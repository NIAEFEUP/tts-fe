import { useState } from "react";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { MultipleStudentExchanges } from "./requests/MultipleStudentExchanges";
import { RequestFilters } from "./requests/RequestFilters";
import { SingleStudentExchanges } from "./requests/SingleStudentExchanges";
import { StudentEnrollments } from "./requests/StudentEnrollments";
import { AdminRequestState } from "../../@types";
import RequestFiltersContext from "../../contexts/admin/RequestFiltersContext";

export const AdminMainContent = () => {
    const [activeCourse, setActiveCourse] = useState<number | undefined>(undefined);
    const [activeCurricularYear, setActiveCurricularYear] = useState<number | undefined>(undefined);
    const [activeState, setActiveState] = useState<AdminRequestState | undefined>(undefined);

    return (
        <RequestFiltersContext.Provider value={{
            activeCourse: activeCourse,
            setActiveCourse: setActiveCourse,
            activeCurricularYear: activeCurricularYear,
            setActiveCurricularYear: setActiveCurricularYear,
            activeState: activeState,
            setActiveState: setActiveState
        }}>
            <div className="flex flex-col gap-y-4 p-4">
                <div className="flex justify-between">
                    <h1 className="text-3xl font-bold">Pedidos</h1>
                    <RequestFilters />
                </div>
                <Tabs defaultValue="exchange-with-student">
                    <TabsList className="w-full">
                        <TabsTrigger value="exchange-with-student">Trocas entre estudantes</TabsTrigger>
                        <TabsTrigger value="exchange-singular">Trocas individuais</TabsTrigger>
                        <TabsTrigger value="enrollments">Inscrições</TabsTrigger>
                    </TabsList>
                    <TabsContent value="exchange-with-student">
                        <MultipleStudentExchanges />
                    </TabsContent>
                    <TabsContent value="exchange-singular">
                        <SingleStudentExchanges />
                    </TabsContent>
                    <TabsContent value="enrollments">
                        <StudentEnrollments />
                    </TabsContent>
                </Tabs>
            </div>
        </RequestFiltersContext.Provider>
    )
}
