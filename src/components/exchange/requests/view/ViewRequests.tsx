import { PlusIcon } from "@heroicons/react/24/outline";
import { Dispatch, SetStateAction, useState } from "react";
import { MarketplaceRequest } from "../../../../@types";
import useMarketplaceRequests from "../../../../hooks/useMarketplaceRequests";
import { Badge } from "../../../ui/badge";
import { Button } from "../../../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../ui/tabs";
import { RequestCard } from "./cards/RequestCard";
import { ViewRequestsFilters } from "./ViewRequestsFilters";

type Props = {
  setCreatingRequest: Dispatch<SetStateAction<boolean>>
}

export const ViewRequests = ({
  setCreatingRequest
}: Props) => {
  const [hiddenRequests, setHiddenRequests] = useState<Set<number>>(new Set());
  const [filterCourseUnitNames, setFilterCourseUnitNames] = useState<Set<string>>(new Set());

  const { data, setSize, isLoading } = useMarketplaceRequests();
  const requests = data ? [].concat(...data) : [];

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
        <TabsTrigger value="todos">Todos</TabsTrigger>
        <TabsTrigger value="meus-pedidos">Meus pedidos</TabsTrigger>
        <TabsTrigger value="recebidos">Recebidos</TabsTrigger>
      </TabsList>
      <TabsContent value="todos">
        <ViewRequestsFilters
          enrolledCourseUnits={["CG", "CPD", "IA"]}
          availableClasses={["3LEIC01", "3LEIC02", "3LEIC03"]}
          filterCourseUnitsHook={[filterCourseUnitNames, setFilterCourseUnitNames]}
        />
        {
          isLoading
            ? <></>
            : <div className="mt-4 flex flex-col gap-y-2">
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
            </div>
        }
      </TabsContent>
      <TabsContent value="meus-pedidos"></TabsContent>
      <TabsContent value="recebidos"></TabsContent>
    </Tabs>
  </div>
    ;
}
