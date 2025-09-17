"use client";

import { Dispatch, SetStateAction, useState } from "react";
import { CreateRequestData, MarketplaceRequest } from "../../../../@types";
import exchangeUtils from "../../../../utils/exchange";
import { Button } from "../../../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../../ui/dialog";
import { ExchangeSubmissionConfirmation } from "./ExchangeSubmissionConfirmation";
import { RelatedExchanges } from "./RelatedExchanges";
import { CurrentView } from "./CustomizeRequest";

type Props = {
  requests: Map<number, CreateRequestData>
  requestSubmitHandler: (message: string) => void
  previewingFormHook: [boolean, Dispatch<SetStateAction<boolean>>]
  submittingRequest: boolean
  currentView: CurrentView,
  setCurrentView: Dispatch<SetStateAction<CurrentView>>,
  relatedExchanges: Array<MarketplaceRequest>
}

const PreviewRequestForm = ({
  requests, requestSubmitHandler, previewingFormHook, submittingRequest, currentView, relatedExchanges, setCurrentView
}: Props) => {
  const [previewingForm, setPreviewingForm] = previewingFormHook;
  const [sendUrgentMessage, setSendUrgentMessage] = useState<boolean>(false);

  return <Dialog open={previewingForm} onOpenChange={(open) => {
    setPreviewingForm(open)
  }}>
    <DialogTrigger asChild>
      <Button
        className="w-full"
      >
        Submeter pedido
      </Button>
    </DialogTrigger>
    <DialogContent className="flex flex-col">
      <DialogHeader>
        <DialogTitle>Prever visualização do pedido</DialogTitle>
        <DialogDescription>
          {currentView === CurrentView.CONFIRMATION &&
            (
              exchangeUtils.isDirectExchange(Array.from(requests.values()))
                ? "Após submeteres o pedido, irá ser enviado e-mails de confirmação para todos os estudantes de destino que selecionaste."
                : "Após submeteres o pedido, irá ser mostrado na página de visualização de pedidos."
            )
          }

          {currentView === CurrentView.OTHER_REQUESTS &&
            (
              "Foram encontrados pedidos de troca que já satisfazem o teu. Podes escolher das opções."
            )
          }
        </DialogDescription>
      </DialogHeader>

      {currentView === CurrentView.OTHER_REQUESTS && <RelatedExchanges setUrgentMessage={setSendUrgentMessage} setCurrentView={setCurrentView} requests={relatedExchanges} />}
      {currentView === CurrentView.CONFIRMATION && <ExchangeSubmissionConfirmation
        requests={requests}
        requestSubmitHandler={requestSubmitHandler}
        submittingRequest={submittingRequest}
        sendUrgentMessage={sendUrgentMessage}
        setSendUrgentMessage={setSendUrgentMessage}
      />}

    </DialogContent>
  </Dialog >
};

export default PreviewRequestForm;
