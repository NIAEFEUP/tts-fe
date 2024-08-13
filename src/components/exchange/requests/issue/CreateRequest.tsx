import { Dispatch, SetStateAction, useState } from "react"
import { CourseInfo, CreateRequestCardMetadata, ExchangeOption } from "../../../../@types"
import { Button } from "../../../ui/button"
import { Separator } from "../../../ui/separator"
import { CreateRequestCard } from "./cards/CreateRequestCard"

type Props = {
  setCreatingRequest: Dispatch<SetStateAction<boolean>>
}

export const CreateRequest = ({
  setCreatingRequest
}: Props) => {
  const [requests, setRequests] = useState<Map<string, ExchangeOption>>(new Map());
  const requestEligbleCourseUnits: Array<CreateRequestCardMetadata> = [{
    courseUnitName: "Inteligência Artifical",
    courseUnitAcronym: "IA",
    requesterClassName: "3LEIC09",
    availableClasses: [
      "3LEIC01",
      "3LEIC02"
    ]
  }];

  return <div className="flex flex-col">
    <div className="flex flex-col gap-y-4">
      <h1 className="font-bold text-xl">Criar pedido</h1>
      <div className="flex flex-col gap-y-2">
        {requestEligbleCourseUnits.map((metadata: CreateRequestCardMetadata) => (
          <CreateRequestCard
            requestsHook={[requests, setRequests]}
            requestMetadata={metadata}
          />
        ))}

        {
          requestEligbleCourseUnits.length === 0
            ? <p className="text-center">Não foram encontradas cadeiras com inscrição tua!</p>
            : <></>
        }
      </div>
    </div>
    <div className="mt-4 flex flex-row justify-between w-full gap-x-2">
      <Button
        className="w-full bg-gray-200 text-gray-800 hover:bg-gray-150"
        onClick={() => setCreatingRequest(false)}
      >
        Voltar
      </Button>
      <Button className="w-full border border-green-800 bg-green-500" disabled>Submeter pedido</Button>
    </div>
  </div>
}
