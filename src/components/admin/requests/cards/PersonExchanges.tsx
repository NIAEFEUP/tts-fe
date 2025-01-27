import { ArrowRightIcon } from "lucide-react";
import { ClassDescriptor, DirectExchangeParticipant } from "../../../../@types";
import { Person } from "./Person";
import { Button } from "../../../ui/button";
import { AdminPreviewSchedule } from "../AdminPreviewSchedule";

type Props = {
    participant_nmec: string
    participant_name: string
    exchanges: Array<DirectExchangeParticipant>
}

export const PersonExchanges = ({
    exchanges,
    participant_name,
    participant_nmec
}: Props) => {
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
                                <h2 className="font-bold">{exchange.course_unit}</h2>
                                <div className="flex gap-2 items-center">
                                    <p>{exchange.class_participant_goes_from.name}</p>
                                    <ArrowRightIcon className="w-5 h-5" />
                                    <p>{exchange.class_participant_goes_to.name}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
                <div>
                    <AdminPreviewSchedule 
                        originalSchedule={exchanges[0].schedule}
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
                </div>
            </div>
        </>
    )
};
