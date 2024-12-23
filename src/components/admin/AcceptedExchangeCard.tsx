import { ArrowRightIcon, ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline"
import { Button } from "../ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../ui/tabs"
import { useState } from "react"
import { DirectExchangeParticipant } from "../../@types"
import ExchangeSchedule from "../exchange/schedule/ExchangeSchedule"
import ScheduleContext from "../../contexts/ScheduleContext"


type Props = {
    participant_nmec: number
    participant_name: string
    exchanges: Array<DirectExchangeParticipant>
    schedule: any
}

export const AcceptedExchangeCard = ({
    participant_name,
    participant_nmec,
    exchanges,
    schedule
}: Props) => {
    const [open, setOpen] = useState<boolean>(false);

    return (
        <Card>
            <CardHeader className="flex flex-row justify-between items-center">
                <div>
                    <CardTitle>
                        {participant_name}
                    </CardTitle>
                    <CardDescription>
                        {participant_nmec}
                    </CardDescription>
                </div>
                <div>
                    <Button
                        onClick={() => setOpen(prev => !prev)}
                    >
                        {open
                            ? <ChevronUpIcon className="w-5 h-5" />
                            : <ChevronDownIcon className="w-5 h-5" />
                        }
                    </Button>
                </div>
            </CardHeader>

            <CardContent>
                {open &&
                    <div className="flex flex-row">
                        <div className="w-1/3">
                            <h2 className="font-bold mb-2">Trocas feitas</h2>
                            {
                                exchanges.map((exchange) => (
                                    <div 
                                        key={crypto.randomUUID()}
                                        className="flex flex-col gap-y-2 items-center border-gray-500 border-2 rounded-md p-2 w-1/2"
                                    >
                                        <h2 className="font-bold">{exchange.course_unit}</h2>
                                        <div className="flex flex-row gap-x-2 items-center">
                                            <p>{exchange.class_participant_goes_from.name}</p>
                                            <ArrowRightIcon className="w-5 h-5" />
                                            <p>{exchange.class_participant_goes_to.name}</p>
                                        </div>
                                    </div>
                                ))
                            }
                        </div>
                        <div className="w-2/3 h-full">
                            <h2 className="font-bold mb-2">Horário</h2>
                            <ScheduleContext.Provider value={{
                                "exchangeSchedule": schedule,
                                "originalExchangeSchedule": [],
                                "loadingSchedule": false,
                                "setExchangeSchedule": () => {},
                                "enrolledCourseUnits": []
                            }}>
                                <ExchangeSchedule />
                            </ScheduleContext.Provider>
                        </div>
                    </div>
                }
            </CardContent>
        </Card>
    )
}