import { useState } from "react";
import { DirectExchangeParticipant, DirectExchangeRequest } from "../../../../@types"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../../ui/card";
import { Button } from "../../../ui/button";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { Separator } from "../../../ui/separator";
import { Person } from "./Person";
import { ExchangeStatus } from "./ExchangeStatuts";
import { PersonExchanges } from "./PersonExchanges";

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

    return (
        <>
            <Card>
                <CardHeader className="flex flex-row justify-between items-center">
                    <div className="flex gap-4 items-center">
                        <div className="flex flex-col gap-1 ">
                            <div className="flex gap-2 items-center">
                                <CardTitle>
                                    <h2 className="font-bold">
                                        {`#${exchange.id}`}
                                    </h2>
                                </CardTitle>
                                <ExchangeStatus exchange={exchange} />
                            </div>
                            <p className="text-sm">Criado às 15h30 de 15/09/2020</p>
                            <p className="text-sm">Atualizado às 15h30 de 15/09/2020</p>
                        </div>
                        {!open && <>
                            {exchange.options.map((participant: DirectExchangeParticipant) => (
                                <Person name={participant.participant_name} nmec={participant.participant_nmec} />
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
                                exchanges={exchanges}
                                participant_name={participant_nmec}
                                participant_nmec={participant_nmec}
                            />
                        ))
                    }
                </CardContent>

                {open &&
                    <>
                        <Separator className="my-4" />
                        <CardFooter className="justify-end gap-4">
                            <Button variant="secondary">
                                Rejeitar
                            </Button>
                            <Button>
                                Tratar
                            </Button>
                        </CardFooter>
                    </>
                }
            </Card>
        </>
    )
}