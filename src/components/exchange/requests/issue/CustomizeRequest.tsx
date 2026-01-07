import { ArrowLeftIcon } from "@heroicons/react/24/outline"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { CourseInfo, CreateRequestData } from "../../../../@types"
import { Desert } from "../../../svgs"
import { Button } from "../../../ui/button"
import { Switch } from "../../../ui/switch"
import { CreateRequestCard } from "./cards/CreateRequestCard"
import PreviewRequestForm from "./PreviewRequestForm"
import { ExchangeSidebarStatus } from "../../../../pages/Exchange"
import useRelatedExchanges from "../../../../hooks/exchange/useRelatedExchanges"
import exchangeUtils from "../../../../utils/exchange"

type Props = {
  selectedCourseUnits: CourseInfo[]
  setExchangeSidebarStatus: Dispatch<SetStateAction<ExchangeSidebarStatus>>
  requests: Map<number, CreateRequestData>
  setRequests: Dispatch<SetStateAction<any>>
  setSelectedCourseUnits: Dispatch<SetStateAction<CourseInfo[]>>
  hasStudentToExchange: boolean
  setHasStudentToExchange: Dispatch<SetStateAction<boolean>>
}

export enum CurrentView {
  NONE,
  CONFIRMATION,
  ACCEPTANCE,
  FAILURE,
  OTHER_REQUESTS
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
  const [previewingForm, setPreviewingForm] = useState<boolean>(false);

  const [currentPreviewView, setCurrentPreviewView] = useState<CurrentView>(CurrentView.NONE);

  const { relatedExchanges, loading } = useRelatedExchanges(previewingForm + [requests.entries()].map(([k, v]) => `${k}=${v}`).join(","), requests);

  useEffect(() => {
    if (exchangeUtils.isDirectExchange(Array.from(requests.values()))) {
      setCurrentPreviewView(CurrentView.CONFIRMATION);
      return;
    }

    if (relatedExchanges && !loading && relatedExchanges.length === 0) setCurrentPreviewView(CurrentView.CONFIRMATION);
    if (relatedExchanges && !loading && relatedExchanges.length > 0) setCurrentPreviewView(CurrentView.OTHER_REQUESTS);
  }, [relatedExchanges]);

  return <div className="flex flex-col gap-y-4">
    {selectedCourseUnits.length === 0
      ? <div className="flex flex-col gap-y-4">
        <Desert className="w-full" />
        <p className="text-center">Ainda não adicionaste nenhuma disciplina para fazer uma troca.</p>
        <Button
          className={`${selectedCourseUnits.length > 0 ? "w-1/2" : "w-full"} add-item-button`}
          onClick={() => { setExchangeSidebarStatus(ExchangeSidebarStatus.SHOWING_REQUESTS) }}
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
                  previewingFormHook={[previewingForm, setPreviewingForm]}
                  currentView={currentPreviewView}
                  setCurrentView={setCurrentPreviewView}
                  relatedExchanges={relatedExchanges ?? []}
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
