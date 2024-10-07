import { PlusIcon } from "@heroicons/react/24/outline";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { MarketplaceRequest } from "../../../../@types";
import useMarketplaceRequests from "../../../../hooks/useMarketplaceRequests";
import { Desert } from "../../../svgs";
import { Button } from "../../../ui/button";
import { Skeleton } from "../../../ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../ui/tabs";
import { MineRequestCard } from "./cards/MineRequestCard";
import { RequestCard } from "./cards/RequestCard";
import { ViewRequestsFilters } from "./ViewRequestsFilters";

type Props = {
  setCreatingRequest: Dispatch<SetStateAction<boolean>>
}

const requestTypeFilters = ["all", "mine", "received"];

const EmptyRequestsWarning = () => {
  return <div className="flex flex-col">
    <Desert className="w-full" />
    <p className="text-center">Não existem pedidos.</p>
  </div>
}

export const ViewRequests = ({
  setCreatingRequest
}: Props) => {
  const requestCardsContainerRef = useRef(null);
  const [hiddenRequests, setHiddenRequests] = useState<Set<number>>(new Set());
  const [currentRequestTypeFilter, setCurrentRequestTypeFilter] = useState<number>(0);
  const [filterCourseUnitNames, setFilterCourseUnitNames] = useState<Set<number>>(new Set());
  const [classesFilter, setClassesFilter] = useState<Map<string, Set<string>>>(new Map());

  // This is to keep track of the request of the request card that is currently open
  const [chosenRequest, setChosenRequest] = useState<MarketplaceRequest | null>(null);

  const { data, size, setSize, isLoading, isValidating } = useMarketplaceRequests(filterCourseUnitNames, requestTypeFilters[currentRequestTypeFilter]);

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
      <Button
        className="bg-white text-black border shadow-md mr-0 hover:bg-gray-50 flex flex-row gap-x-1"
        onClick={() => setCreatingRequest(true)}
      >
        Criar pedido
        <PlusIcon className="h-5 w-5" />
      </Button>
    </div>

    <Tabs defaultValue="todos" className="mt-2 w-full">
      <TabsList className="flex flex-row justify-between">
        <TabsTrigger onClick={() => setCurrentRequestTypeFilter(0)} value="todos">Todos</TabsTrigger>
        <TabsTrigger onClick={() => setCurrentRequestTypeFilter(1)} value="meus-pedidos">Enviados</TabsTrigger>
        <TabsTrigger onClick={() => setCurrentRequestTypeFilter(2)} value="recebidos">Recebidos</TabsTrigger>
      </TabsList>
      <TabsContent value="todos" className="mt-4">
        <ViewRequestsFilters
          filterCourseUnitsHook={[filterCourseUnitNames, setFilterCourseUnitNames]}
          classesFilterHook={[classesFilter, setClassesFilter]}
        />
        <div ref={requestCardsContainerRef} className="mt-4 flex flex-col gap-y-3 overflow-y-auto max-h-screen">
          {
            isLoading
              ? <div className="w-full">
                <Skeleton className="w-full h-full" />
              </div>
              : <>
                {
                  requests.length > 0 ?
                    <>
                      {requests?.filter((request) => request !== undefined).map((request: MarketplaceRequest) => (
                        <RequestCard
                          key={request.id}
                          request={request}
                          hiddenRequests={hiddenRequests}
                          setHiddenRequests={setHiddenRequests}
                          setChosenRequest={setChosenRequest}
                          chosenRequest={chosenRequest}
                        />
                      ))}
                    </>
                    : <EmptyRequestsWarning />}
              </>
          }
        </div>
      </TabsContent>
      <TabsContent value="meus-pedidos" className="mt-4">
        <ViewRequestsFilters
          filterCourseUnitsHook={[filterCourseUnitNames, setFilterCourseUnitNames]}
          classesFilterHook={[classesFilter, setClassesFilter]}
        />
        <div className="mt-4 flex flex-col gap-y-3 overflow-y-auto max-h-screen">
          {requests.length === 0
            ? <EmptyRequestsWarning />
            : <>
              {requests?.filter((request) => request !== undefined).map((request: MarketplaceRequest) => (
                <MineRequestCard
                  request={request}
                />
              ))}
            </>
          }
        </div>
      </TabsContent>
      <TabsContent value="recebidos">
        <ViewRequestsFilters
          filterCourseUnitsHook={[filterCourseUnitNames, setFilterCourseUnitNames]}
          classesFilterHook={[classesFilter, setClassesFilter]}
        />
        <div className="mt-4 flex flex-col gap-y-3 overflow-y-auto max-h-screen">
          {requests.length === 0
            ? <EmptyRequestsWarning />
            : <></>
          }
        </div>
      </TabsContent>
    </Tabs>
  </div >
    ;
}
