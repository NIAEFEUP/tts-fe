import { Dispatch, SetStateAction, useContext } from "react"
import { CourseUnitEnrollment, DirectExchangeRequest, MarketplaceRequest, UrgentRequest } from "../../../../@types"
import { AdminRequestType } from "../../../../utils/exchange"
import exchangeRequestService from "../../../../api/services/exchangeRequestService"
import { mailtoStringBuilder } from "../../../../utils/mail"
import { Button } from "../../../ui/button"
import { CardFooter } from "../../../ui/card"
import { Separator } from "../../../ui/separator"
import { AdminSendEmail } from "../AdminSendEmail"
import { TreatExchangeButton } from "./TreatExchangeButton"
import SessionContext from "../../../../contexts/SessionContext"

type Props = {
  nmecs: Array<string>,
  exchangeMessage: string,
  requestType: AdminRequestType,
  requestId: number,
  showTreatButton?: boolean,
  setExchange?: Dispatch<SetStateAction<DirectExchangeRequest | UrgentRequest | CourseUnitEnrollment | MarketplaceRequest>>
  courseId: Array<number>
}

const rejectRequest = async (
  nmecs: Array<string>,
  exchangeMessage: string,
  requestType: AdminRequestType,
  id: number,
  senderName: string,
) => {
  try {
    await exchangeRequestService.adminRejectExchangeRequest(requestType, id);

    const a = document.createElement('a');
    a.target = "_blank";
    a.rel = "noopener noreferrer";

    if (requestType === AdminRequestType.DIRECT_EXCHANGE) {
      a.href = `${mailtoStringBuilder(nmecs)}?subject=Pedido de Alteração de Turma&cc=inscricoes.turmas.leic@fe.up.pt&body=Viva,%0D%0A%0D%0AA alteração pedida não pode ser efetuada.%0D%0A${exchangeMessage}%0D%0A%0D%0ACumprimentos,%0D%0A${senderName}%0D%0A(pela comissão de inscrição em turmas)`;
    } else if (requestType === AdminRequestType.URGENT_EXCHANGE) {
      a.href = `${mailtoStringBuilder(nmecs)}?subject=Pedido de Alteração Individual de Turma&cc=inscricoes.turmas.leic@fe.up.pt&body=Viva,%0D%0A%0D%0AA alteração pedida não pode ser efetuada.%0D%0A${exchangeMessage}%0D%0A%0D%0ACumprimentos,%0D%0A${senderName}%0D%0A(pela comissão de inscrição em turmas)`;
    } else {
      a.href = `${mailtoStringBuilder(nmecs)}?subject=Pedido de Inscrição em Unidades Curriculares&cc=inscricoes.turmas.leic@fe.up.pt&body=Viva,%0D%0A%0D%0AO pedido de inscriçao em unidades curriculares não pode ser efetuado..%0D%0A${exchangeMessage}%0D%0A%0D%0ACumprimentos,%0D%0A${senderName}%0D%0A(pela comissão de inscrição em turmas)`;
    } 

    a.click();
  } catch (e) {
    console.error(e);
  }
}

const acceptRequest = async (
  nmecs: Array<string>,
  exchangeMessage: string,
  requestType: AdminRequestType,
  id: number,
  senderName: string
) => {
  try {
    await exchangeRequestService.adminAcceptExchangeRequest(requestType, id);

    const a = document.createElement('a');
    a.target = "_blank";
    a.rel = "noopener noreferrer";
    if (requestType === AdminRequestType.DIRECT_EXCHANGE) {
      a.href = `${mailtoStringBuilder(nmecs)}?subject=Pedido de Troca de Turma&cc=inscricoes.turmas.leic@fe.up.pt&body=Viva,%0D%0A%0D%0AA alteração pedida foi efetuada.%0D%0A${exchangeMessage}%0D%0A%0D%0ACumprimentos,%0D%0A${senderName}%0D%0A(pela comissão de inscrição em turmas)`;
    } else if (requestType === AdminRequestType.URGENT_EXCHANGE){
      a.href = `${mailtoStringBuilder(nmecs)}?subject=Pedido de Troca Individual de Turma&cc=inscricoes.turmas.leic@fe.up.pt&body=Viva,%0D%0A%0D%0AA alteração pedida foi efetuada.%0D%0A${exchangeMessage}%0D%0A%0D%0ACumprimentos,%0D%0A${senderName}%0D%0A(pela comissão de inscrição em turmas)`;

    } else {
      a.href = `${mailtoStringBuilder(nmecs)}?subject=Pedido de Inscrição em Unidades Curriculares&cc=inscricoes.turmas.leic@fe.up.pt&body=Viva,%0D%0A%0D%0AA alteração pedida foi efetuada.%0D%0A${exchangeMessage}%0D%0A%0D%0ACumprimentos,%0D%0A${senderName}%0D%0A(pela comissão de inscrição em turmas)`;
    }

    a.click();
  } catch (e) {
    console.error(e);
  }
}

const markRequestAsAwaitingInformation = async (requestType: AdminRequestType, id: number) => {
  try {
    await exchangeRequestService.adminMarkRequestAsAwaitingInformation(requestType, id);
  } catch (e) {
    console.error(e);
  }
}


export const AdminRequestCardFooter = ({
  nmecs,
  exchangeMessage,
  requestType,
  requestId,
  showTreatButton = true,
  setExchange,
  courseId
}: Props) => {
  const awaitInfo = async () => {
    await markRequestAsAwaitingInformation(requestType, requestId);
    setExchange(prev => {
      const newPrev = { ...prev };
      newPrev.admin_state = "awaiting-information";
      return newPrev;
    })
  }

  const { user } = useContext(SessionContext);

  return <>
    <Separator className="my-4" />
    <CardFooter className="justify-end gap-4">
      <Button
        variant="destructive"
        onClick={async () => {
          await rejectRequest(nmecs, exchangeMessage, requestType, requestId, user.name);
          setExchange(prev => {
            const newPrev = { ...prev };
            newPrev.admin_state = "rejected";
            return newPrev;
          })
        }}
      >
        Rejeitar
      </Button>

      <Button
        onClick={async () => {
          await acceptRequest(nmecs, exchangeMessage, requestType, requestId, user.name);
          setExchange(prev => {
            const newPrev = { ...prev };
            newPrev.admin_state = "accepted";
            return newPrev;
          })
        }}
        className="success-button"
      >
        Marcar como aceite
      </Button>

      {showTreatButton &&
        nmecs.map(nmec => (
          <TreatExchangeButton
            key={"treat-exchange-button-" + nmec}
            nmec={nmec}
            courseId={courseId}
          />
        ))
      }

      <AdminSendEmail
        nmec={nmecs}
        subject={
          requestType === AdminRequestType.DIRECT_EXCHANGE || requestType === AdminRequestType.URGENT_EXCHANGE
            ? "Pedido de troca de turma"
            : "Pedido de Inscrição em Unidades Curriculares"
        }
        message={exchangeMessage}
        onClick={awaitInfo}
      />
    </CardFooter>
  </>
}
