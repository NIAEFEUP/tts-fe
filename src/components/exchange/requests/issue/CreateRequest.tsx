import { Dispatch, SetStateAction, useState } from "react"
import { CourseInfo, CreateRequestData } from "../../../../@types"
import useStudentCourseUnits from "../../../../hooks/useStudentCourseUnits"
import { Button } from "../../../ui/button"
import { ChooseIncludedCourseUnits } from "./ChooseIncludedCourseUnits"
import { CustomizeRequest } from "./CustomizeRequest"
import { ExchangeSidebarStatus } from "../../../../pages/Exchange"

type Props = {
  setExchangeSidebarStatus: Dispatch<SetStateAction<ExchangeSidebarStatus>>
}

export const CreateRequest = ({
  setExchangeSidebarStatus
}: Props) => {
  const [requests, setRequests] = useState<Map<number, CreateRequestData | null>>(new Map());
  const [selectedCourseUnits, setSelectedCourseUnits] = useState<CourseInfo[]>([]);
  const [selectingCourseUnits, setSelectingCourseUnits] = useState<boolean>(false);
  const [hasStudentToExchange, setHasStudentToExchange] = useState<boolean>(false);
  const { enrolledCourseUnits } = useStudentCourseUnits();

  return <div className="flex flex-col">
    <div className="flex flex-col gap-y-4 max-h-screen overflow-y-auto">
      <div className="flex flex-row justify-between w-full items-center">
        <h1 className="font-bold text-xl">Criar pedido</h1>
        {!selectingCourseUnits &&
          <Button 
            className="add-item-button" 
            onClick={() => setSelectingCourseUnits(true)}
          >
            Disciplina +
          </Button>
        }
      </div>

      <div>
        {
          selectingCourseUnits
            ? <ChooseIncludedCourseUnits
              setSelectedCourseUnits={setSelectedCourseUnits}
              enrolledCourseUnits={enrolledCourseUnits}
              selectedCourseUnits={selectedCourseUnits}
              setSelectingCourseUnits={setSelectingCourseUnits}
            />
            : <CustomizeRequest
              selectedCourseUnits={selectedCourseUnits}
              setExchangeSidebarStatus={setExchangeSidebarStatus}
              requests={requests}
              setRequests={setRequests}
              setSelectedCourseUnits={setSelectedCourseUnits}
              hasStudentToExchange={hasStudentToExchange}
              setHasStudentToExchange={setHasStudentToExchange}
            />
        }
      </div>
    </div>
  </div>
}
