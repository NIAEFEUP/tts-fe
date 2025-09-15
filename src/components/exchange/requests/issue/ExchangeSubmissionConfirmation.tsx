import { CheckBadgeIcon } from "@heroicons/react/24/outline";
import { BeatLoader } from "react-spinners";
import { Desert } from "../../../svgs";
import { Button } from "../../../ui/button";
import PreviewRequestCard from "./cards/PreviewRequestCard";
import { Checkbox } from "../../../ui/checkbox";
import { Textarea } from "../../../ui/textarea";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../../../ui/form";
import exchangeRequestService from "../../../../api/services/exchangeRequestService";
import { CreateRequestData } from "../../../../@types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { z } from "zod";
import { Dispatch, SetStateAction, useContext } from "react";
import ConflictsContext from "../../../../contexts/ConflictsContext";

type Props = {
  requests: Map<number, CreateRequestData>,
  requestSubmitHandler: (message: string) => void,
  submittingRequest: boolean,
  sendUrgentMessage: boolean,
  setSendUrgentMessage: Dispatch<SetStateAction<boolean>>
}

export const ExchangeSubmissionConfirmation = ({
  requests,
  requestSubmitHandler,
  submittingRequest,
  sendUrgentMessage,
  setSendUrgentMessage
}: Props) => {

  const schema = z.object({
    urgentMessage: sendUrgentMessage ? z.string().min(1, {
      message: "Tens de especificar um motivo!"
    }).max(2048) : z.string().optional()
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema)
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    await requestSubmitHandler(data.urgentMessage);
  }

  const { isConflictSevere } = useContext(ConflictsContext);

  return (
    <>
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-y-4 items-center mx-auto">
            {!exchangeRequestService.isDirectExchange(requests.values()) && <div className="flex flex-row gap-x-2 items-center">
              <Checkbox
                checked={sendUrgentMessage}
                onCheckedChange={(checked: boolean) => {
                  setSendUrgentMessage(checked)
                  if (!checked) form.setValue("urgentMessage", "")
                }}
              />
              <p className="text-justify">O meu pedido é urgente por razões médicas ou outras</p>
            </div>
            }
            {sendUrgentMessage &&
              <FormField
                control={form.control}
                name="urgentMessage"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <>
                        <Textarea
                          {...field}
                          placeholder="Justifica a urgência do teu pedido de troca. Irá ser enviado diretamente para a comissão de inscrição de turmas."
                        />
                        <p className="text-sm font-bold">Se quiseres enviar ficheiros como comprovativo, podes enviar para a comissão de inscrição de turmas.</p>
                      </>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />}

            <Button
              className="flex flex-row gap-x-2 success-button"
              type="submit"
              disabled={sendUrgentMessage ? false : isConflictSevere}
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
        </Form>
      }

    </>
  )
}
