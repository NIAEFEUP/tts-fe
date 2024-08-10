import { PlusIcon } from "@heroicons/react/24/outline";
import { Dispatch, SetStateAction } from "react";
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
        <ViewRequestsFilters />
        <div className="mt-4 flex flex-col gap-y-2">
          <RequestCard requesterStudent={{ name: "Tozé Manuel", mecNumber: "202108880" }} exchangeOptions={[
            {
              acronym: "IA",
              name: "Inteligência Artifical",
              classNameRequesterGoesFrom: "3LEIC09",
              classNameRequesterGoesTo: "3LEIC05"
            },
            {
              acronym: "CG",
              name: "Computação Gráfica",
              classNameRequesterGoesFrom: "3LEIC09",
              classNameRequesterGoesTo: "3LEIC05"
            }
          ]} />
          <RequestCard requesterStudent={{ name: "Armindo Santos", mecNumber: "202108881" }} exchangeOptions={[
            {
              acronym: "CPD",
              name: "Computação Paralela e Distribuída",
              classNameRequesterGoesFrom: "3LEIC09",
              classNameRequesterGoesTo: "3LEIC05"
            },
          ]} />

        </div>
      </TabsContent>
      <TabsContent value="meus-pedidos"></TabsContent>
      <TabsContent value="recebidos"></TabsContent>
    </Tabs>
  </div>
    ;
}
