import { ArrowLeftIcon } from "@heroicons/react/24/outline"
import { Dispatch, SetStateAction, useState } from "react"
import { CourseInfo, CreateRequestData } from "../../../../@types"
import exchangeRequestService from "../../../../api/services/exchangeRequestService"
import { Desert } from "../../../svgs"
import { Button } from "../../../ui/button"
import { Switch } from "../../../ui/switch"
import { toast } from "../../../ui/use-toast"
import { CreateRequestCard } from "./cards/CreateRequestCard"
import PreviewRequestForm from "./PreviewRequestForm"
import { ExchangeSidebarStatus } from "../../../../pages/Exchange"
import { exchangeErrorToText } from "../../../../utils/error"

type Props = {
  selectedCourseUnits: CourseInfo[]
  setExchangeSidebarStatus: Dispatch<SetStateAction<ExchangeSidebarStatus>>
  requests: Map<number, CreateRequestData>
  setRequests: Dispatch<SetStateAction<any>>
  setSelectedCourseUnits: Dispatch<SetStateAction<CourseInfo[]>>
  hasStudentToExchange: boolean
  setHasStudentToExchange: Dispatch<SetStateAction<boolean>>
}

export const CustomizeRequest = ({
  selectedCourseUnits,
  setExchangeSidebarStatus,
  requests,
  setRequests,
  setSelectedCourseUnits,
  hasStudentToExchange,
  setHasStudentToExchange
}: Props) => {
  const [submittingRequest, setSubmittingRequest] = useState<boolean>(false);
  const [previewingForm, setPreviewingForm] = useState<boolean>(false);


  const submitRequest = async (urgentMessage: string) => {
    setSubmittingRequest(true);
    const res = await exchangeRequestService.submitExchangeRequest(requests, urgentMessage);

    if (res.ok) {
      setPreviewingForm(false);
      toast({
        title: 'Pedido submetido com sucesso!',
        description: 
          exchangeRequestService.isDirectExchange(requests.values())
            ? 'A proposta de troca foi realizada com sucesso. Podes confirmar a troca no email institucional ou na aba "recebidos" da página dos pedidos.'
            : `${urgentMessage ? 'O pedido foi enviado para a comissão de inscrição de turmas' : 'O pedido de troca foi submetido no marketplace. Podes consultar o estado na aba "Enviados"'}`
      });
    } else{
      setPreviewingForm(false);
      toast({
        title: 'Erro ao submeter o pedido.',
        description: exchangeErrorToText[(await res.json())["error"]]
      });
    }

    setSubmittingRequest(false);
  }

  return <div className="flex flex-col gap-y-4">
    {selectedCourseUnits.length === 0
      ? <div className="flex flex-col gap-y-4">
        <Desert className="w-full" />
        <p className="text-center">Ainda não adicionaste nenhuma disciplina para fazer uma troca.</p>
        <Button
          className={`${selectedCourseUnits.length > 0 ? "w-1/2" : "w-full"} add-item-button`}
          onClick={() => {setExchangeSidebarStatus(ExchangeSidebarStatus.SHOWING_REQUESTS)}}
        >
          <div className="flex flex-row gap-x-2">
            <ArrowLeftIcon className="h-5 w-5" />
            Voltar
          </div>
        </Button>
      </div>
      : <>
        <div className="mt-4 flex flex-row justify-between w-full gap-x-2">
          <div className="flex flex-row gap-x-2 w-full">
            {selectedCourseUnits.length > 0 &&
              <>
                <Button
                  className={`${selectedCourseUnits.length > 0 ? "w-1/2" : "w-full"} bg-gray-200 text-gray-800 hover:bg-gray-150`}
                  onClick={() => { setExchangeSidebarStatus(ExchangeSidebarStatus.SHOWING_REQUESTS) }}
                >
                  <div className="flex flex-row gap-x-2">
                    <ArrowLeftIcon className="h-5 w-5" />
                    Voltar
                  </div>
                </Button>
                <PreviewRequestForm
                  requests={requests}
                  requestSubmitHandler={submitRequest}
                  previewingFormHook={[previewingForm, setPreviewingForm]}
                  submittingRequest={submittingRequest}
                />
              </>
            }
          </div>
        </div>

        <div className="flex flex-row gap-2">
          <Switch id="person-to-exchange" onCheckedChange={(checked) => {
            setHasStudentToExchange(checked)
            if (!checked) {
              requests.forEach((request) => {
                request.other_student = null;
              })
              setRequests(new Map(requests));
            }
          }} />
          <label htmlFor="person-to-exchange">
            Tenho pessoas com quem trocar
          </label>
        </div>

        {
          Array.from(selectedCourseUnits).map((courseInfo: CourseInfo) => (
            <CreateRequestCard
              key={courseInfo.id}
              hasStudentToExchange={hasStudentToExchange}
              requestsHook={[requests, setRequests]}
              courseInfo={courseInfo}
              setSelectedCourseUnits={setSelectedCourseUnits}
            />
          ))
        }
      </>
    }

  </div>
}
