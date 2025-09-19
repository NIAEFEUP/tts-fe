import { ArrowRightIcon } from "lucide-react";
import { ClassDescriptor, DirectExchangeParticipant } from "../../../../@types";
import { Person } from "./Person";
import { AdminPreviewSchedule } from "../AdminPreviewSchedule";
import { AdminSendEmail } from "../AdminSendEmail";
import useStudentsSchedule from "../../../../hooks/admin/useStudentsSchedule";
import { TreatExchangeButton } from "./TreatExchangeButton";
import { listEmailExchanges } from "../../../../utils/mail";

type Props = {
    participant_nmec: string
    participant_name: string
    exchanges: Array<DirectExchangeParticipant>
    showTreatButton?: boolean
}

export const PersonExchanges = ({
    exchanges,
    participant_name,
    participant_nmec,
    showTreatButton = false
}: Props) => {
    const { schedule } = useStudentsSchedule(participant_nmec);


    return (
        <>
            <div className="flex w-full items-center">
                {/* Nome + NMEC (40%) */}
                <div className="basis-[40%] shrink-0 overflow-hidden">
                <Person name={participant_name} nmec={participant_nmec} />
            </div>

            {/* Trocas de turmas (30%) */}
            <div className="basis-[30%] flex justify-end overflow-hidden">
                <div className="flex flex-wrap gap-2">
                    {exchanges.map((exchange) => (
                        <div
                            key={crypto.randomUUID()}
                            className="flex flex-col gap-y-2 items-center border-gray-200 border-2 rounded-md p-2 px-4"
                        >
                            <div className="flex gap-5 items-center">
                                <h2 className="font-bold truncate">{exchange.course_info.acronym}</h2>
                                <div className="flex gap-2 items-center">
                                    <p className="truncate >{exchange.class_participant_goes_from.name}</p>
                                    <p>{exchange.class_participant_goes_from.vacancies ?? 'N/A'} vagas</p>
                                    <ArrowRightIcon className="w-5 h-5" />
                                    <p className="truncate >{exchange.class_participant_goes_to.name}</p>
                                    <p>{exchange.class_participant_goes_to.vacancies ?? 'N/A'} vagas</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                </div>

                {/* Botões (30%) */}
                <div className="basis-[30%] shrink-0 flex justify-end gap-x-2">
                    <AdminPreviewSchedule 
                        originalSchedule={schedule}
                        classesToAdd={
                            exchanges.map((exchange): ClassDescriptor => {
                                return {
                                    classInfo: exchange.class_participant_goes_to,
                                    courseInfo: exchange.course_info,
                                    slotInfo: null
                                }
                            })
                        }
                    />
                    {showTreatButton && 
                        <TreatExchangeButton
                            nmec={participant_nmec}
                            variant="secondary"
                            courseId={exchanges.map(exchange => exchange.course_info.course)}
                        />
                    }
                    <AdminSendEmail
                        nmec={participant_nmec}
                        subject="Pedido de troca de turmas"
                        message={listEmailExchanges(
                            exchanges.map(option => ({
                                participant_nmec: option.participant_nmec,
                                participant_name: option.participant_name,
                                goes_from: option.class_participant_goes_from.name,
                                goes_to: option.class_participant_goes_to.name,
                                course_acronym: option.course_unit
                            }))
                        )}
                        onClick={async () => {}} //no action needed here
                        
                        
                    />
                </div>
            </div>
        </>
    )
};
