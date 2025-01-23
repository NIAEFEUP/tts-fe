import useAdminExchanges from "../../hooks/useAdminExchanges";
import { AcceptedExchangeCard } from "./AcceptedExchangeCard";

export const AdminMainContent = () => {
    const { exchanges } = useAdminExchanges();

    /*
    export type DirectExchangeParticipant = {
      id: number,
      course_info: CourseInfo,
      participant_name: string,
      participant_nmec: string,
      class_participant_goes_from: ClassInfo,
      class_participant_goes_to: ClassInfo,
      course_unit: string,
      course_unit_id: string,
      accepted: boolean
      date: string
    }

    export type CourseInfo = {
      id: number,
      course_unit_year: number,
      course_unit_id: number,
      ects: number,
      acronym: string,
      name: string,
      url: string,
      hash: string,
      classes?: Array<ClassInfo>
    }


    export type ClassInfo = {
      // course_unit_id: number, // é mesmo necessário ??
      // composed_name: string,
      id: number,
      name: string,
      filteredTeachers: Array<number>,
      slots: Array<SlotInfo>
    }
    */
    return (
        <div className="flex flex-col gap-y-4 p-4">
            <h1 className="text-3xl font-bold">Pedidos</h1>
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
