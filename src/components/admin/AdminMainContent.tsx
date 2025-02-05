import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { MultipleStudentExchanges } from "./requests/MultipleStudentExchanges";
import { RequestFilters } from "./requests/RequestFilters";
import { SingleStudentExchanges } from "./requests/SingleStudentExchanges";
import { StudentEnrollments } from "./requests/StudentEnrollments";
import { AdminRequestState } from "../../contexts/admin/RequestFiltersContext";
import RequestFiltersContext from "../../contexts/admin/RequestFiltersContext";
import { AdminPagination } from "./AdminPagination";
import AdminPaginationContext from "../../contexts/admin/AdminPaginationContext";

export const AdminMainContent = () => {
    const [activeCourse, setActiveCourse] = useState<number | undefined>(undefined);
    const [activeCurricularYear, setActiveCurricularYear] = useState<number | undefined>(undefined);
    const [activeStates, setActiveStates] = useState<Array<AdminRequestState>>([]);

    const [currPage, setCurrPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);

    return (
        <AdminPaginationContext.Provider value={{
            currPage,
            setCurrPage,
            totalPages,
            setTotalPages
        }}>
            <RequestFiltersContext.Provider value={{
                activeCourse: activeCourse,
                setActiveCourse: setActiveCourse,
                activeCurricularYear: activeCurricularYear,
                setActiveCurricularYear: setActiveCurricularYear,
                activeStates: activeStates,
                setActiveStates: setActiveStates
            }}>
                <div className="flex flex-col gap-y-4 p-4">
                    <div className="flex justify-between">
                        <h1 className="text-3xl font-bold">Pedidos</h1>
                        <RequestFilters />
                    </div>
                    <Tabs defaultValue="exchange-with-student">
                        <TabsList className="w-full">
                            <TabsTrigger 
                                value="exchange-with-student"
                                onClick={() => setCurrPage(1)}
                            >
                                Trocas entre estudantes
                            </TabsTrigger>
                            <TabsTrigger 
                                value="exchange-singular"
                                onClick={() => setCurrPage(1)}
                            >
                                Trocas individuais
                            </TabsTrigger>
                            <TabsTrigger 
                                value="enrollments"
                                onClick={() => setCurrPage(1)}
                            >
                                Inscrições
                            </TabsTrigger>
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

                        <div className="mt-8">
                            <AdminPagination />
                        </div>
                    </Tabs>
                </div>
            </RequestFiltersContext.Provider>
        </AdminPaginationContext.Provider>
    )
}
