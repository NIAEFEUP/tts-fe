import { PlusIcon } from "@heroicons/react/24/outline";
import { Dispatch, SetStateAction } from "react";
import { Button } from "../../ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../ui/tabs";

type Props = {
  setCreatingRequest: Dispatch<SetStateAction<boolean>>
}

export const SeeRequests = ({
  setCreatingRequest
}: Props) => {
  return <div className="lg:min-h-adjusted order-2 col-span-12 flex min-h-min flex-col justify-between rounded bg-lightest px-3 py-3 dark:bg-dark lg:col-span-3 2xl:px-4 2xl:py-4">
    <div className="space-y-2">
      <div className="relative flex flex-row flex-wrap items-center justify-center gap-x-2 gap-y-2 lg:justify-start">
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
          <TabsContent value="todos"></TabsContent>
          <TabsContent value="meus-pedidos"></TabsContent>
          <TabsContent value="recebidos"></TabsContent>
        </Tabs>

      </div>
    </div>
  </div >
    ;
}
