import { CheckBadgeIcon } from "@heroicons/react/24/outline";
import { BeatLoader } from "react-spinners";
import { Dispatch, SetStateAction, useState } from "react";
import { CreateRequestData } from "../../../../@types";
import exchangeUtils from "../../../../utils/exchange";
import { Desert } from "../../../svgs";
import { Button } from "../../../ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../../../ui/dialog";
import PreviewRequestCard from "./cards/PreviewRequestCard";
import { Checkbox } from "../../../ui/checkbox";
import { Textarea } from "../../../ui/textarea";

type Props = {
  requests: Map<number, CreateRequestData>
  requestSubmitHandler: (message: string) => void
  previewingFormHook: [boolean, Dispatch<SetStateAction<boolean>>]
  submittingRequest: boolean
}

const PreviewRequestForm = ({ requests, requestSubmitHandler, previewingFormHook, submittingRequest }: Props) => {
  const [previewingForm, setPreviewingForm] = previewingFormHook;
  const [urgentMessage, setUrgentMessage] = useState<string>("");
  const [sendUrgentMessage, setSendUrgentMessage] = useState<boolean>(false);

  return <Dialog open={previewingForm} onOpenChange={(open) => setPreviewingForm(open)}>
    <DialogTrigger asChild>
      <Button className="w-1/2">
        Submeter pedido
      </Button>
    </DialogTrigger>
    <DialogContent className="flex flex-col">
      <DialogHeader>
        <DialogTitle>Prever visualização do pedido</DialogTitle>
        <DialogDescription>
          {
            exchangeUtils.isDirectExchange(Array.from(requests.values()))
              ? "Após submeteres o pedido, irá ser enviado e-mails de confirmação para todos os estudantes de destino que selecionaste."
              : "Após submeteres o pedido, irá ser mostrado na página de visualização de pedidos."
          }
        </DialogDescription>
      </DialogHeader>
      <div>
        {requests.size === 0 ?
          <div className="flex flex-col justify-center items-center">
            <Desert className="w-full" />
            <p>Ainda não escolheste nenhuma turma em nenhuma das disciplinas selecionadas.</p>
          </div>
          : <div>
            {
              Array.from(requests.values()).map((request) => (
                <PreviewRequestCard
                  key={request.courseUnitId}
                  request={request}
                />
              ))
            }
          </div>
        }
      </div>

      {requests.size > 0 &&
        <form className="flex flex-col gap-y-4 items-center mx-auto">
          <div className="flex flex-row gap-x-1">
            <Checkbox 
              checked={sendUrgentMessage}
              onCheckedChange={(checked: boolean) => setSendUrgentMessage(checked)}
            />
            <p>Quero enviar o pedido direto à comissão de inscrição</p>
          </div>
          {sendUrgentMessage &&
            <Textarea 
              value={urgentMessage}
              onChange={(e) => setUrgentMessage(e.target.value)}
              placeholder="Justifica a urgência do teu pedido de troca." 
            />
          }
          <Button
            className="flex flex-row gap-x-2 success-button"
            type="submit"
            onClick={async (e) => {
              e.preventDefault();
              await requestSubmitHandler(urgentMessage);
            }}
          >
            {submittingRequest
              ? <p>A processar pedido...</p>
              : <>
                <p>Submeter pedido</p>
                <CheckBadgeIcon className="h-5 w-5" />
              </>
            }
          </Button>
          {submittingRequest && <BeatLoader size={10} />}
        </form>
      }
    </DialogContent>
  </Dialog >
};

export default PreviewRequestForm;
