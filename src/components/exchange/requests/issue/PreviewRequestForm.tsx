"use client";

import { Dispatch, SetStateAction, useContext, useState } from "react";
import { CreateRequestData, MarketplaceRequest } from "../../../../@types";
import exchangeUtils from "../../../../utils/exchange";
import { Button } from "../../../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../../ui/dialog";
import { ExchangeSubmissionConfirmation } from "./ExchangeSubmissionConfirmation";
import { RelatedExchanges } from "./RelatedExchanges";
import { CurrentView } from "./CustomizeRequest";
import exchangeRequestService from "../../../../api/services/exchangeRequestService";
import Alert, { AlertType } from '../../../planner/Alert'
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";
import { exchangeErrorToText } from "../../../../utils/error";
import { useNavigate } from "react-router-dom";
import ConflictsContext from "../../../../contexts/ConflictsContext";

type Props = {
  requests: Map<number, CreateRequestData>
  previewingFormHook: [boolean, Dispatch<SetStateAction<boolean>>]
  currentView: CurrentView,
  setCurrentView: Dispatch<SetStateAction<CurrentView>>,
  relatedExchanges: Array<MarketplaceRequest>
}

const PreviewRequestForm = ({
  requests, previewingFormHook, currentView, relatedExchanges, setCurrentView
}: Props) => {
  const navigate = useNavigate();

  const [previewingForm, setPreviewingForm] = previewingFormHook;
  const [sendUrgentMessage, setSendUrgentMessage] = useState<boolean>(false);
  const [submittingRequest, setSubmittingRequest] = useState<boolean>(false);

  const [error, setError] = useState<string>("");

  const submitRequest = async (urgentMessage: string) => {
    setSubmittingRequest(true);
    const res = await exchangeRequestService.submitExchangeRequest(requests, urgentMessage);

    try {
      if (res.ok) {
        setCurrentView(CurrentView.ACCEPTANCE)
      } else {
        setCurrentView(CurrentView.FAILURE)
        setError(exchangeErrorToText[(await res.json())["error"]])
      }
    } catch (e) {
      console.error(e)
      setError("Erro desconhecido")
    } finally {
      setSubmittingRequest(false);
    }
  }
  const { conflictSeverity , hasSomeConflict } = useContext(ConflictsContext);

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
        <DialogTitle className="text-center mb-4">
          Prever visualização do pedido
          </DialogTitle>
          {hasSomeConflict && (
            <Alert type={conflictSeverity ? AlertType.error : AlertType.warning}>
              <p>
                {conflictSeverity ? (
                  <>Colisões com aulas práticas são <strong>severas</strong> e não é possível fazer trocas.</>
                ) : (
                  <>Colisões com <strong>aulas teóricas e práticas</strong> só devem ser submetidas se forem inevitáveis ou se for possível assistir à aula teórica noutro turno.</>
                )}
              </p>
            </Alert>
          )}

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
        requestSubmitHandler={submitRequest}
        submittingRequest={submittingRequest}
        sendUrgentMessage={sendUrgentMessage}
        setSendUrgentMessage={setSendUrgentMessage}
      />}

      {currentView === CurrentView.ACCEPTANCE && (
        <div className="flex flex-col items-center space-y-4 py-6">
          <CheckCircle className="h-16 w-16 text-green-500" />
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold text-green-700">Pedido submetido com sucesso!</h3>
            <p className="text-sm text-muted-foreground">
              {exchangeUtils.isDirectExchange(Array.from(requests.values()))
                ? 'A proposta de troca foi realizada com sucesso. Podes confirmar a troca no email institucional ou na aba "recebidos" da página dos pedidos.'
                : sendUrgentMessage
                  ? "O pedido foi enviado para a comissão de inscrição de turmas"
                  : 'O pedido de troca foi submetido no marketplace. Podes consultar o estado na aba "Enviados"'}
            </p>
          </div>
          <div className="flex space-x-2">
            <Button onClick={() => setPreviewingForm(false)} className="bg-green-600 hover:bg-green-700">
              Fechar
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                navigate(0)
              }}
            >
              Ver pedidos
            </Button>
          </div>
        </div>
      )}

      {currentView === CurrentView.FAILURE && (
        <div className="flex flex-col items-center space-y-4 py-6">
          <XCircle className="h-16 w-16 text-red-500" />
          <div className="text-center space-y-2">
            <h3 className="text-lg font-semibold text-red-700">Erro ao submeter o pedido</h3>
            <p className="text-sm text-muted-foreground">
              Não foi possível submeter o teu pedido devido ao seguinte erro:
            </p>
            <div className="bg-red-50 border border-red-200 rounded-md p-3 mt-2">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Podes tentar novamente alterando o teu pedido. Se achares que deveria ser um pedido válido contacta ni@aefeup.pt.
            </p>
          </div>
        </div>
      )}

    </DialogContent>
  </Dialog >
};

export default PreviewRequestForm;
