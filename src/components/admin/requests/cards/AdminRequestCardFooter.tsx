import { Dispatch, SetStateAction } from "react"
import { AdminRequestType, CourseUnitEnrollment, DirectExchangeRequest, UrgentRequest } from "../../../../@types"
import exchangeRequestService from "../../../../api/services/exchangeRequestService"
import { mailtoStringBuilder } from "../../../../utils/mail"
import { Button } from "../../../ui/button"
import { CardFooter } from "../../../ui/card"
import { Separator } from "../../../ui/separator"
import { AdminSendEmail } from "../AdminSendEmail"
import { TreatExchangeButton } from "./TreatExchangeButton"

type Props = {
    nmecs: Array<string>,
    exchangeMessage: string,
    requestType: AdminRequestType,
    requestId: number,
    showTreatButton?: boolean,
    courseUnitId?: Array<number>
    setExchange?: Dispatch<SetStateAction<DirectExchangeRequest | UrgentRequest | CourseUnitEnrollment>>
    courseId: number
}

const rejectRequest = async (
    nmecs: Array<string>,
    exchangeMessage: string,
    requestType: AdminRequestType,
    id: number
) => {
    try {
        await exchangeRequestService.adminRejectExchangeRequest(requestType, id);

        const a = document.createElement('a');
        a.href = `${mailtoStringBuilder(nmecs)}?subject=Pedido de Alteração de Turma&cc=inscricoes.turmas.leic@fe.up.pt&body=Viva, A alteração pedida não pode ser efetuada. ${exchangeMessage} Cmpts, Daniel Silva (pela comissão de inscrição em turmas)`;
        a.click();
    } catch (e) {
        console.error(e);
    }
}

const acceptRequest = async (
    nmecs: Array<string>,
    exchangeMessage: string,
    requestType: AdminRequestType,
    id: number
) => {
    try {
        await exchangeRequestService.adminAcceptExchangeRequest(requestType, id);

        const a = document.createElement('a');
        a.href = `${mailtoStringBuilder(nmecs)}?subject=Pedido de Troca de Turma&cc=inscricoes.turmas.leic@fe.up.pt&body=Viva, A alteração pedida foi efetuada. ${exchangeMessage} Cmpts, Daniel Silva (pela comissão de inscrição em turmas)`;
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
    courseUnitId,
    setExchange,
    courseId
}: Props) => {

    return <>
        <Separator className="my-4" />
        <CardFooter className="justify-end gap-4">
            <Button
                variant="destructive"
                onClick={async () => {
                    await rejectRequest(nmecs, exchangeMessage, requestType, requestId);
                    setExchange(prev => {
                        const newPrev = {...prev };
                        newPrev.admin_state = "rejected";
                        return newPrev;
                    })
                }}
            >
                Rejeitar
            </Button>

            <Button 
                onClick={async () => {
                    await acceptRequest(nmecs, exchangeMessage, requestType, requestId);
                    setExchange(prev => {
                        const newPrev = {...prev };
                        newPrev.admin_state = "accepted";
                        return newPrev;
                    })
                }}  
                className="success-button"
            >
                Marcar como aceite
            </Button>

            <Button
                className="bg-blue-400"
                onClick={async () => {
                    await markRequestAsAwaitingInformation(requestType, requestId);
                    setExchange(prev => {
                        const newPrev = {...prev };
                        newPrev.admin_state = "awaiting-information";
                        return newPrev;
                    })
                }}
            >
                Aguardar informação
            </Button>

            {showTreatButton &&
                nmecs.map(nmec => (
                    <TreatExchangeButton
                        key={"treat-exchange-button-" + nmec}
                        nmec={nmec}
                        courseUnitId={courseUnitId[0]}
                        courseId={courseId}
                    />
                ))
            }

            <AdminSendEmail
                nmec={nmecs}
            />
        </CardFooter>
    </>
}
