import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react"
import { CourseInfo, CreateRequestCardMetadata, CreateRequestData } from "../../../../@types"
import exchangeRequestService from "../../../../api/services/exchangeRequestService"
import ScheduleContext from "../../../../contexts/ScheduleContext"
import useSchedule from "../../../../hooks/useSchedule"
import useStudentCourseUnits from "../../../../hooks/useStudentCourseUnits"
import { Desert } from "../../../svgs"
import { Button } from "../../../ui/button"
import { Checkbox } from "../../../ui/checkbox"
import { CreateRequestCard } from "./cards/CreateRequestCard"
import { IncludeCourseUnitCard } from "./cards/IncludeCourseUnitCard"

type Props = {
  setCreatingRequest: Dispatch<SetStateAction<boolean>>
}

export const CreateRequest = ({
  setCreatingRequest
}: Props) => {
  const [requests, setRequests] = useState<Map<number, CreateRequestData | null>>(new Map());
  const { exchangeSchedule } = useContext(ScheduleContext);
  const [selectedCourseUnits, setSelectedCourseUnits] = useState<CourseInfo[]>([]);
  const [selectingCourseUnits, setSelectingCourseUnits] = useState<boolean>(false);
  const enrolledCourseUnits = useStudentCourseUnits(exchangeSchedule);

  return <div className="flex flex-col">
    <div className="flex flex-col gap-y-8 max-h-screen overflow-y-auto">
      <div className="flex flex-row justify-between w-full items-center">
        <h1 className="font-bold text-xl">Criar pedido</h1>
        {!selectingCourseUnits &&
          <Button onClick={() => setSelectingCourseUnits(true)}>
            Adicionar disciplina
          </Button>
        }
      </div>

      {!selectingCourseUnits &&
        <div className="mt-4 flex flex-row justify-between w-full gap-x-2">
          <Button
            className="w-full bg-gray-200 text-gray-800 hover:bg-gray-150"
            onClick={() => { setCreatingRequest(false) }}
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
      }

      {selectingCourseUnits ? <div className="flex flex-col gap-y-2">
        <div className="flex flex-row gap-2">
          <Checkbox
            id="selecting-course-units"
            onCheckedChange={(checked) => {
              if (!checked) {
                setSelectedCourseUnits([]);
              } else {
                setSelectedCourseUnits(Array.from(enrolledCourseUnits));
              }
            }}
            checked={selectedCourseUnits.length === enrolledCourseUnits.length}
          />
          <label htmlFor="selecting-course-units">
            Selecionar todas as disciplinas
          </label>
        </div>
        {Array.from(enrolledCourseUnits).map((courseInfo: CourseInfo) => (
          <IncludeCourseUnitCard
            courseInfo={courseInfo}
            selectedCourseUnitsHook={[selectedCourseUnits, setSelectedCourseUnits]}
          />
        ))}
      </div>
        : <div className="flex flex-col gap-y-2">
          {Array.from(selectedCourseUnits).map((courseInfo: CourseInfo) => (
            <CreateRequestCard
              requestsHook={[requests, setRequests]}
              courseInfo={courseInfo}
            />
          ))}

          {
            selectedCourseUnits.length === 0
              ? <>
                <Desert className="w-full" />
                <p className="text-center">Ainda não adicionaste nenhuma disciplina para fazer uma troca</p>
              </>
              : <></>
          }
        </div>
      }

      {selectingCourseUnits &&
        <Button
          className="w-full bg-gray-200 text-gray-800 hover:bg-gray-150"
          onClick={() => { setSelectingCourseUnits(false) }}
        >
          Confirmar disciplinas
        </Button>}
    </div>
  </div >
}
