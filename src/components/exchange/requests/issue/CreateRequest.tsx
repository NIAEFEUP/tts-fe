import { Dispatch, SetStateAction } from "react"
import { Button } from "../../../ui/button"
import { CreateRequestCard } from "./cards/CreateRequestCard"

type Props = {
  setCreatingRequest: Dispatch<SetStateAction<boolean>>
}

export const CreateRequest = ({
  setCreatingRequest
}: Props) => {
  return <div className="flex flex-col h-full">
    <div className="flex flex-col gap-y-4">
      <h1 className="font-bold text-xl">Criar pedido</h1>
      <div className="flex flex-col gap-y-2">
        <CreateRequestCard courseUnitName="Inteligência Artificial" requesterClassName="3LEIC09" />
        <CreateRequestCard courseUnitName="Computação Gráfica" requesterClassName="3LEIC09" />
        <CreateRequestCard courseUnitName="Computação Paralela e Distribuída" requesterClassName="3LEIC09" />
      </div>
    </div>
    <div className="mt-2 flex flex-row justify-between w-full gap-x-2">
      <Button
        className="w-full bg-gray-200 text-gray-800 hover:bg-gray-150"
        onClick={() => setCreatingRequest(false)}
      >
        Voltar
      </Button>
      <Button className="w-full">Submeter pedido</Button>
    </div>
  </div>
}
