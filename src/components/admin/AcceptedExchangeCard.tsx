import { ArrowRightIcon, ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { useState } from "react"
import { DirectExchangeParticipant } from "../../@types"
import ExchangeSchedule from "../exchange/schedule/ExchangeSchedule"
import ScheduleContext from "../../contexts/ScheduleContext"
import api from "../../api/backend"
import { Separator } from "../ui/separator"

type Props = {
    participant_nmec: number
    participant_name: string
    date: string
    exchanges: Array<DirectExchangeParticipant>
    schedule: any
}

const Person = ({ name, nmec }: { name: string, nmec: number }) => (
    <div className="flex gap-1 items-center">
        <img src="https://gravatar.com/avatar/8c64fbfa02d0a9f45ca4a903826e2e5e?s=400&d=robohash&r=x" alt="Foto do estudante" className="w-16 h-16 rounded-full" />
        <div className="flex flex-col gap-1">
            <CardTitle>
                <a className="hover:underline" href={`https://sigarra.up.pt/feup/pt/fest_geral.cursos_list?pv_num_unico=${nmec}`}>
                    {name}
                </a>
            </CardTitle>
            <CardDescription>
                {nmec}
            </CardDescription>
        </div>
    </div>
);

const PersonExchanges = ({ exchanges, participant_name, participant_nmec }: { exchanges: Array<DirectExchangeParticipant>, participant_name: string, participant_nmec: number }) => (
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
            <Button variant="secondary">
                Visualizar
            </Button>
        </div>
    </div>
);

export const AcceptedExchangeCard = ({
    participant_name,
    participant_nmec,
    date,
    exchanges,
    schedule
}: Props) => {
    const [open, setOpen] = useState<boolean>(false);

    return (
        <Card>
            <CardHeader className="flex flex-row justify-between items-center">
                <div className="flex gap-4 items-center">
                    <div className="flex flex-col gap-1 ">
                        <div className="flex gap-2 items-center">
                            <CardTitle>
                                <h2 className="font-bold">#42</h2>
                            </CardTitle>
                            <p className="bg-green-200 text-green-800 rounded-full px-4 py-1 text-sm">
                                Aceite
                            </p>
                        </div>
                        <p className="text-sm">Criado às 15h30 de 15/09/2020</p>
                        <p className="text-sm">Atualizado às 15h30 de 15/09/2020</p>
                    </div>
                    {!open && <>
                        <Person name={participant_name} nmec={participant_nmec} />
                        <Person name={participant_name} nmec={participant_nmec} />
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

            {open &&
                <CardContent className="w-full ">
                    <Separator className="my-4" />
                    <PersonExchanges exchanges={exchanges} participant_name={participant_name} participant_nmec={participant_nmec} />
                    <Separator className="my-4" />
                    <PersonExchanges exchanges={exchanges} participant_name={participant_name} participant_nmec={participant_nmec} />
                </CardContent>
            }

            {open &&
                <>
                    <Separator className="my-4" />
                    <CardFooter className="justify-end gap-4">
                        <Button variant="secondary">
                            Rejeitar
                        </Button>
                        <Button>
                        </Button>
                    </CardFooter>
                </>
            }
        </Card>
    )
}
