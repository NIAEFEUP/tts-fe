import useAdminExchanges from "../../hooks/useAdminExchanges";
import { Button } from "../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { AcceptedExchangeCard } from "./AcceptedExchangeCard";
import { TrashIcon } from "@heroicons/react/24/outline"

export const AdminMainContent = () => {
    const { exchanges } = useAdminExchanges();
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
            <div className="flex flex-col gap-y-2">
                <article key={`João Pereira`}>
                    <AcceptedExchangeCard
                        participant_name="João Pereira"
                        participant_nmec={202108848}
                        date={new Date().toISOString()}
                        exchanges={[
                            {
                                id: 1,
                                course_info: {
                                    id: 1,
                                    name: "MIEIC",
                                    acronym: "MIEIC",
                                    course_unit_year: 1,
                                    course_unit_id: 1,
                                    ects: 6,
                                    url: "https://sigarra.up.pt/feup/pt/ucurr_geral.ficha_uc_view?pv_ocorrencia_id=459489",
                                    hash: "MIEIC1",
                                },
                                participant_name: "João Pereira",
                                participant_nmec: "202108848",
                                class_participant_goes_from: {
                                    id: 1,
                                    name: "1MEIC05",
                                    filteredTeachers: [1, 2],
                                    slots: [],
                                },
                                class_participant_goes_to: {
                                    id: 1,
                                    name: "1MEIC06",
                                    filteredTeachers: [1, 2],
                                    slots: [],
                                },
                                course_unit: "AC",
                                course_unit_id: "MNUM",
                                accepted: true,
                                date: new Date().toISOString(),
                            },
                        ]
                        }
                        schedule={[]}
                    />
                </article>

                {(!exchanges || exchanges.length === 0) && (
                    <h2>Nenhum pedido encontrado de momento</h2>
                )}
                {exchanges?.map((exchange) => (
                    <article key={`${exchange.participant_nmec}`}>
                        <AcceptedExchangeCard
                            participant_name={exchange.participant_name}
                            participant_nmec={exchange.participant_nmec}
                            date={exchange.date}
                            exchanges={exchange.exchanges}
                            schedule={exchange.schedule}
                        />
                    </article>
                ))}
            </div>
        </div>
    )
}
