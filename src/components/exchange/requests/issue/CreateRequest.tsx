import { Dispatch, SetStateAction, useContext, useState } from "react"
import { CourseInfo, CreateRequestCardMetadata, CreateRequestData } from "../../../../@types"
import exchangeRequestService from "../../../../api/services/exchangeRequestService"
import ScheduleContext from "../../../../contexts/ScheduleContext"
import useSchedule from "../../../../hooks/useSchedule"
import useStudentCourseUnits from "../../../../hooks/useStudentCourseUnits"
import { Button } from "../../../ui/button"
import { CreateRequestCard } from "./cards/CreateRequestCard"

type Props = {
  setCreatingRequest: Dispatch<SetStateAction<boolean>>
}

export const CreateRequest = ({
  setCreatingRequest
}: Props) => {
  const [requests, setRequests] = useState<Map<number, CreateRequestData>>(new Map());
  const { exchangeSchedule } = useContext(ScheduleContext);
  const enrolledCourseUnits = useStudentCourseUnits(exchangeSchedule);

  return <div className="flex flex-col">
    <div className="flex flex-col gap-y-4 max-h-screen overflow-y-auto">
      <h1 className="font-bold text-xl">Criar pedido</h1>
      <div className="flex flex-col gap-y-2">
        {Array.from(enrolledCourseUnits).map((courseInfo: CourseInfo) => (
          <CreateRequestCard
            requestsHook={[requests, setRequests]}
            courseInfo={courseInfo}
          />
        ))}

        {
          enrolledCourseUnits.length === 0
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
      {
        requests.size > 0 ?
          <Button
            className="w-full border border-green-800 bg-green-500"
            onClick={async () => {
              await exchangeRequestService.submitExchangeRequest(requests);
            }}
          >
            Submeter pedido
          </Button>
          : <></>
      }
    </div>
  </div>
}
