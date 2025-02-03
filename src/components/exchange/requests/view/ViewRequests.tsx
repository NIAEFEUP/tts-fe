import { PlusIcon } from "@heroicons/react/24/outline";
import { Dispatch, SetStateAction, useContext, useEffect, useRef, useState } from "react";
import { DirectExchangeRequest, MarketplaceRequest } from "../../../../@types";
import ScheduleContext from "../../../../contexts/ScheduleContext";
import useMarketplaceRequests from "../../../../hooks/useMarketplaceRequests";
import { Desert } from "../../../svgs";
import { Button } from "../../../ui/button";
import { Skeleton } from "../../../ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../ui/tabs";
import { CommonRequestCard } from "./cards/CommonRequestCard";
import { MineRequestCard } from "./cards/MineRequestCard";
import { ReceivedRequestCard } from "./cards/ReceivedRequestCard";
import { RequestCard } from "./cards/RequestCard";
import { ViewRequestsFilters } from "./ViewRequestsFilters";
import { ExchangeSidebarStatus } from "../../../../pages/Exchange";

type Props = {
    setExchangeSidebarStatus: Dispatch<SetStateAction<ExchangeSidebarStatus>>
}

const requestTypeFilters = ["all", "mine", "received"];

const EmptyRequestGuard = ({ requests, children }: { requests: Array<MarketplaceRequest | DirectExchangeRequest>, children: React.ReactNode }) => {
    return <>
        {requests.length === 0 ?
            <div className="flex flex-col">
                <Desert className="w-full" />
                <p className="text-center">Não existem pedidos.</p>
            </div>
            : <>
                {children}
            </>
        }
    </>
}

const RequestCardSkeletons = () => {
    const skeletons = Array.from({ length: 3 }, (_, i) => (
        <div className="flex flex-row w-full space-x-4 items-center" key={`view-request-skeleton-${i}`}>
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="flex flex-col w-full space-y-2">
                <Skeleton className="h-4 w-full" />
                <div className="w-1/2 flex flex-row space-x-2">
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
            </div>
        </div>
    ))

    return <>
        {skeletons}
    </>
}

export const ViewRequests = ({
    setExchangeSidebarStatus
}: Props) => {
    const { originalExchangeSchedule, setExchangeSchedule } = useContext(ScheduleContext);
    const requestCardsContainerRef = useRef(null);
    const [hiddenRequests, setHiddenRequests] = useState<Set<number>>(new Set());
    const [currentRequestTypeFilter, setCurrentRequestTypeFilter] = useState<number>(0);
    const [filterCourseUnitNames, setFilterCourseUnitNames] = useState<Set<number>>(new Set());
    const [classesFilter, setClassesFilter] = useState<Map<string, Set<string>>>(new Map());

    // This is to keep track of the request of the request card that is currently open
    const [chosenRequest, setChosenRequest] = useState<MarketplaceRequest | null>(null);

    const { data, size, setSize, isLoading } = useMarketplaceRequests(
        filterCourseUnitNames, requestTypeFilters[currentRequestTypeFilter], classesFilter
    );

    const requests = data ? [].concat(...data) : [];

    const onScroll = () => {
        if (!requestCardsContainerRef.current) return;

        if ((requestCardsContainerRef.current.scrollHeight - requestCardsContainerRef.current.scrollTop)
            <= requestCardsContainerRef.current.clientHeight + 100
        ) {
            setSize(size + 1);
        }
    }

    useEffect(() => {
        if (!requestCardsContainerRef.current) return;

        requestCardsContainerRef.current.addEventListener('scroll', onScroll);
        return () => {
            if (requestCardsContainerRef.current) requestCardsContainerRef.current.removeEventListener('scroll', onScroll);
        }
    }, []);

    return <div className="relative flex flex-row flex-wrap items-center justify-center gap-x-2 gap-y-2 lg:justify-start">
        <div className="flex flex-row justify-between items-center w-full">
            <h1 className="font-bold text-xl">Pedidos</h1>
            <div className="flex flex-row gap-x-2">
                <Button
                    className="add-item-button"
                    onClick={() => {
                        setExchangeSidebarStatus(ExchangeSidebarStatus.CREATING_REQUEST);
                        setExchangeSchedule(originalExchangeSchedule);
                    }}
                >
                    Criar pedido
                    <PlusIcon className="h-5 w-5" />
                </Button>
            </div>
        </div>

        <Tabs defaultValue="todos" className="mt-2 w-full">
            <TabsList className="flex flex-row justify-between dark:text-white">
                <TabsTrigger onClick={() => setCurrentRequestTypeFilter(0)} value="todos">Todos</TabsTrigger>
                <TabsTrigger onClick={() => setCurrentRequestTypeFilter(1)} value="meus-pedidos">Enviados</TabsTrigger>
                <TabsTrigger onClick={() => setCurrentRequestTypeFilter(2)} value="recebidos">Recebidos</TabsTrigger>
            </TabsList>
            <TabsContent value="todos" className="mt-4">
                <ViewRequestsFilters
                    filterCourseUnitsHook={[filterCourseUnitNames, setFilterCourseUnitNames]}
                    classesFilterHook={[classesFilter, setClassesFilter]}
                />
                <div ref={requestCardsContainerRef} className="mt-4 flex flex-col gap-y-3 overflow-y-auto max-h-[70vh]">
                    {
                        isLoading
                            ? <RequestCardSkeletons /> : <>
                                {
                                    <EmptyRequestGuard requests={requests}>
                                        {requests?.filter((request) => request !== undefined).map((request: MarketplaceRequest) => (
                                            <CommonRequestCard
                                                key={request.id}
                                                request={request}
                                                hiddenRequests={hiddenRequests}
                                                setHiddenRequests={setHiddenRequests}
                                                setChosenRequest={setChosenRequest}
                                                chosenRequest={chosenRequest}
                                                type={request.type}
                                            >
                                                <RequestCard />
                                            </CommonRequestCard>
                                        ))}
                                    </EmptyRequestGuard>
                                }
                            </>
                    }
                </div>
            </TabsContent>
            <TabsContent value="meus-pedidos" className="mt-4">
                <ViewRequestsFilters
                    filterCourseUnitsHook={[filterCourseUnitNames, setFilterCourseUnitNames]}
                    classesFilterHook={[classesFilter, setClassesFilter]}
                />
                {/* <ViewSentRequests /> */}
                <div className="mt-4 flex flex-col gap-y-3 overflow-y-auto max-h-screen">
                    {isLoading
                        ? <RequestCardSkeletons />
                        : <EmptyRequestGuard requests={requests}>
                            {requests?.filter((request) => request !== undefined).map((request: MarketplaceRequest) => (
                                <CommonRequestCard
                                    key={request.id}
                                    request={request}
                                    hiddenRequests={hiddenRequests}
                                    setHiddenRequests={setHiddenRequests}
                                    setChosenRequest={setChosenRequest}
                                    chosenRequest={chosenRequest}
                                    type={request.type}
                                >
                                    <MineRequestCard
                                        request={request}
                                    />
                                </CommonRequestCard>

                            ))}
                        </EmptyRequestGuard>
                    }
                </div>
            </TabsContent>
            <TabsContent value="recebidos" className="mt-4">
                <ViewRequestsFilters
                    filterCourseUnitsHook={[filterCourseUnitNames, setFilterCourseUnitNames]}
                    classesFilterHook={[classesFilter, setClassesFilter]}
                />
                <div className="mt-4 flex flex-col gap-y-3 overflow-y-auto max-h-screen">
                    {isLoading
                        ? <RequestCardSkeletons />
                        : <EmptyRequestGuard requests={requests}>
                            {requests.map((request) => (
                                <CommonRequestCard
                                    key={request.id}
                                    request={request}
                                    hiddenRequests={hiddenRequests}
                                    setHiddenRequests={setHiddenRequests}
                                    setChosenRequest={setChosenRequest}
                                    chosenRequest={chosenRequest}
                                    type={request.type}
                                >
                                    <ReceivedRequestCard
                                        request={request}
                                    />
                                </CommonRequestCard>
                            ))}
                        </EmptyRequestGuard>
                    }
                </div>
            </TabsContent>
        </Tabs>
    </div >
        ;
}