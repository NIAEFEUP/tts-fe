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
            <div className="flex justify-between items-center gap-6 py-2">
                <Person name={participant_name} nmec={participant_nmec} />

                <div className="flex-1 max-w-md">
                <div className="flex flex-col gap-y-2 border-gray-200 border-2 rounded-md p-2 px-4">
                    {exchanges.map((exchange) => (
                        <div
                            key={crypto.randomUUID()}
                            className="flex justify-between items-center gap-3"
                            >
                                <span className="font-bold">{exchange.course_info.acronym}</span>
                                <div className="flex gap-2 items-center text-muted-foreground">
                                    <span>{exchange.class_participant_goes_from.name}</span>
                                    <ArrowRightIcon size={14} />
                                    <span className="text-foreground font-medium">{exchange.class_participant_goes_to.name}</span>
                            </div>
                            <span className="text-xs italic">
                                ({exchange.class_participant_goes_from.vacancies ?? 'N/A'}
                                <ArrowRightIcon className="inline mx-0.5" size={10} />
                                {exchange.class_participant_goes_to.vacancies ?? 'N/A'} {"vagas"})
                            </span>
                        </div>
                    ))}
                </div>
                </div>

                <div className="flex gap-2">
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
    )
};
