import { useState } from "react"
import { Button } from "../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { ExchangeStatus } from "./requests/cards/ExchangeStatus"
import { Person } from "./requests/cards/Person"
import { RequestDate } from "./requests/cards/RequestDate"
import { ArrowRightIcon, ChevronDownIcon, ChevronUpIcon } from "lucide-react"
import { AdminPreviewSchedule } from "./requests/AdminPreviewSchedule"
import useStudentsSchedule from "../../hooks/admin/useStudentsSchedule"
import { ClassDescriptor, MarketplaceRequest } from "../../@types"
import { AdminRequestCardFooter } from "./requests/cards/AdminRequestCardFooter"
import { listEmailExchanges } from "../../utils/mail"
import { AdminRequestType } from "../../utils/exchange"

type Props = {
    exchange: MarketplaceRequest
}

export const AdminMarketplaceExchangesCard = ({
    exchange
}: Props) => {

    const [open, setOpen] = useState<boolean>(false);
    const [exchangeState, setExchangeState] = useState(exchange);

    const { schedule } = useStudentsSchedule(exchange.issuer_nmec);

    return (
        <Card>
            <CardHeader className="flex flex-row justify-between items-center py-4 px-9">
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
                        {!open && <RequestDate
                            date={exchange.date}
                        />}
                    </div>
                    {!open && <>
                        <Person name={exchange.issuer_name} nmec={exchange.issuer_nmec} />
                    </>}

                </div>
                <div>
                    <Button
                        onClick={() => setOpen(prev => !prev)}
                        variant="outline"
                        className="ml-6 h-9 w-9 p-0 border-2 border-slate-200 bg-white text-slate-500 hover:border-slate-400 hover:text-slate-700 transition-all duration-200 shadow-sm"
                    >
                        {open ? (
                            <ChevronUpIcon size={18} strokeWidth={2.5} />
                        ) : (
                            <ChevronDownIcon size={18} strokeWidth={2.5} />
                        )
                        }
                    </Button>
                </div>
            </CardHeader>

            <CardContent className={`w-full ${open ? "pt-0 pb-4 px-9" : "p-0"}`}>
                {open && (
                    <div className="flex flex-col gap-y-6">
                        <div className="flex justify-between items-center gap-6 py-2">
                            <Person name={exchange.issuer_name} nmec={exchange.issuer_nmec} />
                            <div className="flex-1 max-w-md">
                                <div className="flex flex-col gap-y-2 border-gray-200 border-2 rounded-md p-2 px-4">
                                    {exchange.options.map((option) => (
                                        <div key={crypto.randomUUID()} className="flex justify-between items-center gap-3">
                                            <span className="font-bold">{option.course_info.acronym}</span>
                                            <div className="flex gap-2 items-center text-muted-foreground">
                                                <span>{option.class_issuer_goes_from?.name}</span>
                                                <ArrowRightIcon size={14} />
                                                <span className="text-foreground font-medium">{option.class_issuer_goes_to?.name}</span>
                                            </div>
                                            <span className="text-xs italic">
                                                ({option.class_issuer_goes_from?.vacancies ?? 'N/A'}
                                                <ArrowRightIcon className="inline mx-0.5" size={10} />
                                                {option.class_issuer_goes_to?.vacancies ?? 'N/A'} {"vagas"})
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <AdminPreviewSchedule
                                    originalSchedule={schedule}
                                    classesToAdd={
                                        exchange.options.map((option): ClassDescriptor => {
                                            return {
                                                classInfo: option.class_issuer_goes_to,
                                                courseInfo: option.course_info,
                                                slotInfo: null
                                            }
                                        })
                                    }
                                />
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>

            {open &&
                <AdminRequestCardFooter
                    nmecs={[exchange.issuer_nmec]}
                    exchangeMessage={listEmailExchanges(
                        exchange.options.map(option => ({
                            participant_name: exchange.issuer_name,
                            participant_nmec: exchange.issuer_nmec,
                            goes_from: option.class_issuer_goes_from?.name,
                            goes_to: option.class_issuer_goes_to?.name,
                            course_acronym: option.course_info.acronym
                        }))
                    )}
                    requestType={AdminRequestType.URGENT_EXCHANGE}
                    requestId={exchange.id}
                    setExchange={setExchangeState}
                    courseId={exchange.options.map(option => option.course_info.course)}
                />
            }
        </Card>
    )
}