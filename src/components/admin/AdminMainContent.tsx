import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs";
import { MultipleStudentExchanges } from "./requests/MultipleStudentExchanges";
import { SingleStudentExchanges } from "./requests/SingleStudentExchanges";
import { StudentEnrollments } from "./requests/StudentEnrollments";

export const AdminMainContent = () => {
    return (
        <div className="flex flex-col gap-y-4 p-4">
            <div className="flex justify-between">
                <h1 className="text-3xl font-bold">Pedidos</h1>
                <div className="flex gap-4">
                    <Select>
                        <SelectTrigger className="w-[100px]">
                            <SelectValue placeholder="Curso" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="m.eic">M.EIC</SelectItem>
                            <SelectItem value="l.eic">L.EIC</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select>
                        <SelectTrigger className="w-[80px]">
                            <SelectValue placeholder="Ano" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1">1</SelectItem>
                            <SelectItem value="2">2</SelectItem>
                            <SelectItem value="3">3</SelectItem>
                            <SelectItem value="4">4</SelectItem>
                            <SelectItem value="5">5</SelectItem>
                        </SelectContent>
                    </Select>
                    <Select>
                        <SelectTrigger className="w-[120px]">
                            <SelectValue placeholder="Estado" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="light">Aceite</SelectItem>
                            <SelectItem value="procurando">Procurando</SelectItem>
                            <SelectItem value="pendente">Pendente</SelectItem>
                            <SelectItem value="rejeitado">Rejeitado</SelectItem>
                            <SelectItem value="tratado">Tratado</SelectItem>
                        </SelectContent>
                    </Select>
                    <Button>Resetar</Button>
                </div>
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
    )
}
