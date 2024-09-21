import { PlusIcon } from "@heroicons/react/24/outline";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
import { ClassDescriptor, MarketplaceRequest } from "../../../../@types";
import useMarketplaceRequests from "../../../../hooks/useMarketplaceRequests";
import useSchedule from "../../../../hooks/useSchedule";
import { Badge } from "../../../ui/badge";
import { Button } from "../../../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../ui/tabs";
import { RequestCard } from "./cards/RequestCard";
import { ViewRequestsFilters } from "./ViewRequestsFilters";

type Props = {
  setCreatingRequest: Dispatch<SetStateAction<boolean>>
}

const requestTypeFilters = ["all", "mine", "received"];

export const ViewRequests = ({
  setCreatingRequest
}: Props) => {
  const requestCardsContainerRef = useRef(null);
  const [hiddenRequests, setHiddenRequests] = useState<Set<number>>(new Set());
  const [currentRequestTypeFilter, setCurrentRequestTypeFilter] = useState<number>(0);
  const [filterCourseUnitNames, setFilterCourseUnitNames] = useState<Set<number>>(new Set());

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

  console.log("isValidating: ", isValidating);

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
        <TabsTrigger onClick={() => setCurrentRequestTypeFilter(1)} value="meus-pedidos">Meus pedidos</TabsTrigger>
        <TabsTrigger onClick={() => setCurrentRequestTypeFilter(2)} value="recebidos">Recebidos</TabsTrigger>
      </TabsList>
      <TabsContent value="todos">
        <ViewRequestsFilters
          availableClasses={["3LEIC01", "3LEIC02", "3LEIC03"]}
          filterCourseUnitsHook={[filterCourseUnitNames, setFilterCourseUnitNames]}
        />
        <div ref={requestCardsContainerRef} className="mt-4 flex flex-col gap-y-3 overflow-y-auto max-h-screen">
          {
            isLoading
              ? <></>
              : <>
                {
                  requests?.filter((request) => request !== undefined).map((request: MarketplaceRequest) => (
                    <RequestCard
                      key={request.id}
                      request={request}
                      hiddenRequests={hiddenRequests}
                      setHiddenRequests={setHiddenRequests}
                    />
                  ))
                }
              </>
          }
        </div>
      </TabsContent>
      <TabsContent value="meus-pedidos">
        <ViewRequestsFilters
          availableClasses={["3LEIC01", "3LEIC02", "3LEIC03"]}
          filterCourseUnitsHook={[filterCourseUnitNames, setFilterCourseUnitNames]}
        />
      </TabsContent>
      <TabsContent value="recebidos">
        <ViewRequestsFilters
          availableClasses={["3LEIC01", "3LEIC02", "3LEIC03"]}
          filterCourseUnitsHook={[filterCourseUnitNames, setFilterCourseUnitNames]}
        />
      </TabsContent>
    </Tabs>
  </div >
    ;
}
