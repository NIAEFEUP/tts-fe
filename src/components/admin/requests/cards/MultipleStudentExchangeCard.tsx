import { useState } from "react";
import { DirectExchangeParticipant, DirectExchangeRequest } from "../../../../@types"
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";
import { Button } from "../../../ui/button";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { Person } from "./Person";
import { ExchangeStatus } from "./ExchangeStatus";
import { PersonExchanges } from "./PersonExchanges";
import { AdminRequestCardFooter } from "./AdminRequestCardFooter";
import { RequestDate } from "./RequestDate";
import { listEmailExchanges } from "../../../../utils/mail";
import { AdminRequestType } from "../../../../utils/exchange";
import { ValidateRequestButton } from "./ValidateRequestButton";

type Props = {
    exchange: DirectExchangeRequest
}

const participantExchangesMap = (exchange: DirectExchangeRequest) => {
    const participants = exchange.options;
    const map = new Map<string, Array<DirectExchangeParticipant>>();

    participants.forEach((participant) => {
        const existingEntry = map.get(participant.participant_nmec);

        if (existingEntry) {
            existingEntry.push(participant);
        } else {
            map.set(participant.participant_nmec, [participant]);
        }
    })

    return map;
}

export const MultipleStudentExchangeCard = ({
    exchange
}: Props) => {
    const [open, setOpen] = useState<boolean>(false);
    const [exchangeState, setExchangeState] = useState(exchange);

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row justify-between items-center">
                    <div className="flex gap-4 items-center">
                        <div className="flex flex-col gap-2 ">
                            <div className="flex gap-2 items-center">
                                <CardTitle>
                                    <h2 className="font-bold">
                                        {`#${exchange.id}`}
                                    </h2>
                                </CardTitle>
                                <ExchangeStatus exchange={exchangeState} />
                            </div>
                            <RequestDate
                                date={exchange.date}
                            />
                            <div className="mt-4">
                                <ValidateRequestButton
                                    id={exchange.id}
                                />
                            </div>
                        </div>
                        {!open && <>
                            {exchange.options.map((participant: DirectExchangeParticipant) => (
                                <Person
                                    key={"multiple-student-person-" + participant.participant_nmec}
                                    name={participant.participant_name}
                                    nmec={participant.participant_nmec}
                                />
                            ))}
                        </>}

                    </div>
                    <div>
                        <Button
                            onClick={() => setOpen(prev => !prev)}
                            className="bg-white text-black border-2 border-black hover:text-white"
                        >
                            {open
                                ? <ChevronUpIcon className="w-5 h-5" />
                                : <ChevronDownIcon className="w-5 h-5" />
                            }
                        </Button>
                    </div>
                </CardHeader>

                <CardContent className="w-full ">
                    {open &&
                        Array.from(participantExchangesMap(exchange).entries()).map(([participant_nmec, exchanges]) => (
                            <PersonExchanges
                                key={"multiple-student-person-exchanges-" + participant_nmec}
                                exchanges={exchanges}
                                participant_name={participant_nmec}
                                participant_nmec={participant_nmec}
                                showTreatButton={true}
                            />
                        ))
                    }
                </CardContent>

                {open &&
                    <AdminRequestCardFooter
                        nmecs={
                            exchange.options.map(option => option.participant_nmec)
                        }
                        exchangeMessage={listEmailExchanges(
                            exchange.options.map(option => ({
                                goes_from: option.class_participant_goes_from.name,
                                goes_to: option.class_participant_goes_to.name,
                                course_acronym: option.course_unit
                            }))
                        )}
                        requestType={AdminRequestType.DIRECT_EXCHANGE}
                        requestId={exchange.id}
                        showTreatButton={false}
                        setExchange={setExchangeState}
                        courseId={exchange.options[0].course_info.id}
                    />
                }
            </Card>
        </>
    )
}