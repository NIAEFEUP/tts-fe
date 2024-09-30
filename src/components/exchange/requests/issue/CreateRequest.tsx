import { ArrowLeftIcon, CheckBadgeIcon } from "@heroicons/react/24/outline"
import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react"
import { CourseInfo, CreateRequestCardMetadata, CreateRequestData } from "../../../../@types"
import exchangeRequestService from "../../../../api/services/exchangeRequestService"
import ScheduleContext from "../../../../contexts/ScheduleContext"
import useSchedule from "../../../../hooks/useSchedule"
import useStudentCourseUnits from "../../../../hooks/useStudentCourseUnits"
import { Desert } from "../../../svgs"
import { Button } from "../../../ui/button"
import { Checkbox } from "../../../ui/checkbox"
import { Switch } from "../../../ui/switch"
import { toast } from "../../../ui/use-toast"
import { CreateRequestCard } from "./cards/CreateRequestCard"
import { IncludeCourseUnitCard } from "./cards/IncludeCourseUnitCard"
import PreviewRequestForm from "./PreviewRequestForm"

type Props = {
  setCreatingRequest: Dispatch<SetStateAction<boolean>>
}

export const CreateRequest = ({
  setCreatingRequest
}: Props) => {
  const [requests, setRequests] = useState<Map<number, CreateRequestData | null>>(new Map());
  const [hasStudentToExchange, setHasStudentToExchange] = useState<boolean>(false);
  const { exchangeSchedule } = useContext(ScheduleContext);
  const [selectedCourseUnits, setSelectedCourseUnits] = useState<CourseInfo[]>([]);
  const [selectingCourseUnits, setSelectingCourseUnits] = useState<boolean>(false);
  const [previewingForm, setPreviewingForm] = useState<boolean>(false);
  const enrolledCourseUnits = useStudentCourseUnits(exchangeSchedule);

  const submitRequest = async () => {
    const json = await exchangeRequestService.submitExchangeRequest(requests);

    if (json.success) {
      setPreviewingForm(false);
      toast({
        title: 'Pedido submetido com sucesso!',
        // description: 'Não encontramos uma combinação com as turmas das disciplinas selecionadas sem conflitos',
        // position: 'top-right',
      });
    }
  }

  return <div className="flex flex-col">
    <div className="flex flex-col gap-y-4 max-h-screen overflow-y-auto">
      <div className="flex flex-row justify-between w-full items-center">
        <h1 className="font-bold text-xl">Criar pedido</h1>
        {!selectingCourseUnits &&
          <Button onClick={() => setSelectingCourseUnits(true)}>
            Disciplina +
          </Button>
        }
      </div>

      {!selectingCourseUnits &&
        <div className="flex flex-col">
          {selectedCourseUnits.length > 0 && <div className="flex flex-row gap-2">
            <Switch id="person-to-exchange" onCheckedChange={(checked) => {
              setHasStudentToExchange(checked)
              if (!checked) {
                requests.forEach((request, key) => {
                  request.other_student = null;
                })
                setRequests(new Map(requests));
              }
            }} />
            <label htmlFor="person-to-exchange">
              Tenho uma pessoa para trocar
            </label>
          </div>}
          <div className="mt-4 flex flex-row justify-between w-full gap-x-2">
            <div className="flex flex-row gap-x-2 w-full">
              <Button
                className={`${selectedCourseUnits.length > 0 ? "w-1/2" : "w-full"} bg-gray-200 text-gray-800 hover:bg-gray-150`}
                onClick={() => { setCreatingRequest(false) }}
              >
                <div className="flex flex-row gap-x-2">
                  <ArrowLeftIcon className="h-5 w-5" />
                  Voltar
                </div>
              </Button>
              {selectedCourseUnits.length > 0 &&
                <PreviewRequestForm
                  requests={requests}
                  requestSubmitHandler={submitRequest}
                  previewingFormHook={[previewingForm, setPreviewingForm]}
                />
              }
            </div>
          </div>
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
            key={"include-course-unit-" + courseInfo.id}
            courseInfo={courseInfo}
            selectedCourseUnitsHook={[selectedCourseUnits, setSelectedCourseUnits]}
          />
        ))}
      </div>
        : <div className="flex flex-col gap-y-2">
          {Array.from(selectedCourseUnits).map((courseInfo: CourseInfo) => (
            <CreateRequestCard
              key={courseInfo.id}
              hasStudentToExchange={hasStudentToExchange}
              requestsHook={[requests, setRequests]}
              courseInfo={courseInfo}
              setSelectedCourseUnits={setSelectedCourseUnits}
            />
          ))}

          {
            selectedCourseUnits.length === 0
              ? <>
                <Desert className="w-full" />
                <p className="text-center">Ainda não adicionaste nenhuma disciplina para fazer uma troca.</p>
              </>
              : <></>
          }
        </div>
      }

      {selectingCourseUnits &&
        <Button
          className="w-full bg-gray-200 text-gray-800 hover:bg-gray-150 flex flex-row gap-x-2"
          onClick={() => { setSelectingCourseUnits(false) }}
        >
          Confirmar disciplinas
          <CheckBadgeIcon className="h-5 w-5" />
        </Button>}
    </div>
  </div >
}
