import { ArrowRightIcon } from "lucide-react";
import { ClassDescriptor, DirectExchangeParticipant } from "../../../../@types";
import { Person } from "./Person";
import { AdminPreviewSchedule } from "../AdminPreviewSchedule";
import { AdminSendEmail } from "../AdminSendEmail";
import useStudentsSchedule from "../../../../hooks/admin/useStudentsSchedule";
import { TreatExchangeButton } from "./TreatExchangeButton";

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
            <div className="flex justify-between">
                <Person name={participant_name} nmec={participant_nmec} />
                <div>
                    {exchanges.map((exchange) => (
                        <div
                            key={crypto.randomUUID()}
                            className="flex flex-col gap-y-2 items-center border-gray-200 border-2 rounded-md p-2 px-4"
                        >
                            <div className="flex gap-5 items-center">
                                <h2 className="font-bold">{exchange.course_info.acronym}</h2>
                                <div className="flex gap-2 items-center">
                                    <p>{exchange.class_participant_goes_from.name}</p>
                                    <ArrowRightIcon className="w-5 h-5" />
                                    <p>{exchange.class_participant_goes_to.name}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="flex flex-row gap-x-2">
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
                            courseUnitId={exchanges.map(exchange => Number(exchange.course_unit_id))[0]}
                            variant="secondary"
                            courseId={exchanges[0].course_info.id}
                        />
                    }
                    <AdminSendEmail
                        nmec={participant_nmec}
                    />
                </div>
            </div>
        </>
    )
};
