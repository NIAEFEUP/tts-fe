import { useState } from "react";
import { ClassDescriptor, UrgentRequest } from "../../../../@types"
import { Card, CardContent, CardHeader, CardTitle } from "../../../ui/card";
import { Button } from "../../../ui/button";
import { ArrowRightIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import { Person } from "./Person";
import { ExchangeStatus } from "./ExchangeStatus";
import { AdminPreviewSchedule } from "../AdminPreviewSchedule";
import { AdminRequestCardFooter } from "./AdminRequestCardFooter";
import useStudentsSchedule from "../../../../hooks/admin/useStudentsSchedule";
import { RequestDate } from "./RequestDate";
import { listEmailExchanges } from "../../../../utils/mail";
import { AdminRequestType } from "../../../../utils/exchange";

type Props = {
    exchange: UrgentRequest
}

export const SingleStudentExchangeCard = ({
    exchange
}: Props) => {
    const [open, setOpen] = useState<boolean>(false);
    const [exchangeState, setExchangeState] = useState(exchange);

    const { schedule } = useStudentsSchedule(exchange.issuer_nmec);

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
                                <ExchangeStatus exchange={exchangeState} />
                            </div>
                            <RequestDate
                                date={exchange.date}
                            />
                        </div>
                        {!open && <>
                            <Person name={exchange.issuer_name} nmec={exchange.issuer_nmec} />
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
                        <div className="flex flex-col gap-y-8" key={crypto.randomUUID()}>
                            <div className="flex justify-between">
                                <Person name={exchange.issuer_name} nmec={exchange.issuer_nmec} />
                                <div>
                                    <div
                                        key={crypto.randomUUID()}
                                        className="flex flex-col gap-y-2 items-center border-gray-200 border-2 rounded-md p-2 px-4"
                                    >
                                        <>{exchange.options.map((option) => (
                                            <div key={crypto.randomUUID()} className="flex gap-5 items-center">
                                                <h2 className="font-bold">{option.course_unit.acronym}</h2>
                                                <div className="flex gap-2 items-center">
                                                    <p>{option.class_user_goes_from.name}</p>
                                                    <p>{option.class_user_goes_from.vacancies ?? 'N/A'} vagas</p>
                                                    <ArrowRightIcon className="w-5 h-5" />
                                                    <p>{option.class_user_goes_to.name}</p>
                                                    <p>{option.class_user_goes_to.vacancies ?? 'N/A'} vagas</p>                                                    
                                                </div>
                                            </div>
                                        ))}
                                        </>
                                    </div>
                                </div>
                                <div>
                                    <AdminPreviewSchedule
                                        originalSchedule={schedule}
                                        classesToAdd={
                                            exchange.options.map((option): ClassDescriptor => {
                                                return {
                                                    classInfo: option.class_user_goes_to,
                                                    courseInfo: option.course_unit,
                                                    slotInfo: null
                                                }
                                            })
                                        }

                                    />
                                </div>
                            </div>
                            <div>
                                <h2 className="font-bold text-xl">Motivo</h2>
                                <p>{exchange.message}</p>
                            </div>
                        </div>
                    }
                </CardContent>

                {open &&
                    <AdminRequestCardFooter
                        nmecs={[exchange.issuer_nmec]}
                        exchangeMessage={listEmailExchanges(
                            exchange.options.map(option => ({
                                participant_name: exchange.issuer_name,
                                participant_nmec: exchange.issuer_nmec,
                                goes_from: option.class_user_goes_from.name,
                                goes_to: option.class_user_goes_to.name,
                                course_acronym: option.course_unit.acronym
                            }))
                        )}
                        requestType={AdminRequestType.URGENT_EXCHANGE}
                        requestId={exchange.id}
                        setExchange={setExchangeState}
                        courseId={exchange.options.map(option => option.course_unit.course)}
                    />
                }
            </Card>
        </>
    )
}