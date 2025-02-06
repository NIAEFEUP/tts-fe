"use client";

import { useContext } from "react";
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
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../../../ui/form";
import ConflictsContext from "../../../../contexts/ConflictsContext";

type Props = {
  requests: Map<number, CreateRequestData>
  requestSubmitHandler: (message: string) => void
  previewingFormHook: [boolean, Dispatch<SetStateAction<boolean>>]
  submittingRequest: boolean
}

const PreviewRequestForm = ({ requests, requestSubmitHandler, previewingFormHook, submittingRequest }: Props) => {
  const [previewingForm, setPreviewingForm] = previewingFormHook;
  const [sendUrgentMessage, setSendUrgentMessage] = useState<boolean>(false);

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

  return <Dialog open={previewingForm} onOpenChange={(open) => setPreviewingForm(open)}>
    <DialogTrigger asChild>
      <Button
        className="w-full"
        disabled={isConflictSevere}
      >
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
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-y-4 items-center mx-auto">
            <div className="flex flex-row gap-x-2 items-center">
              <Checkbox
                checked={sendUrgentMessage}
                onCheckedChange={(checked: boolean) => setSendUrgentMessage(checked)}
              />
              <p className="text-justify">O meu pedido é urgente por razões médicas ou outras</p>
            </div>
            {sendUrgentMessage &&
              <FormField
                control={form.control}
                name="urgentMessage"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Justifica a urgência do teu pedido de troca."
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />}

            <Button
              className="flex flex-row gap-x-2 success-button"
              type="submit"
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
    </DialogContent>
  </Dialog >
};

export default PreviewRequestForm;
