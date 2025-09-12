import { Dispatch, SetStateAction, useState } from "react"
import { MarketplaceRequest } from "../../../../@types"
import { Checkbox } from "../../../ui/checkbox"
import { CommonRequestCard } from "../view/cards/CommonRequestCard"
import { RequestCard } from "../view/cards/RequestCard"
import { CurrentView } from "./CustomizeRequest"

type Props = {
  requests: Array<MarketplaceRequest>
  setCurrentView: Dispatch<SetStateAction<CurrentView>>
  setUrgentMessage: Dispatch<SetStateAction<boolean>>
}

export const RelatedExchanges = ({
  requests,
  setCurrentView,
  setUrgentMessage
}: Props) => {
  const [hiddenRequests, setHiddenRequests] = useState<Set<number>>(new Set());
  const [chosenRequest, setChosenRequest] = useState<MarketplaceRequest | null>(null);

  return (
    <>
      <div className="flex flex-row gap-x-4">
        <Checkbox
          onClick={() => {
            setUrgentMessage(true)
            setCurrentView(CurrentView.CONFIRMATION)
          }}
        >
        </Checkbox>
        <p>O meu pedido é urgente por razões médicas ou outras</p>
      </div>
      {requests.map((request) => (
        <CommonRequestCard
          key={request.id}
          request={request}
          hiddenRequests={hiddenRequests}
          setHiddenRequests={setHiddenRequests}
          chosenRequest={chosenRequest}
          setChosenRequest={setChosenRequest}
          type={request.type}
        >
          <RequestCard />
        </CommonRequestCard>
      ))}
    </>
  )
}
