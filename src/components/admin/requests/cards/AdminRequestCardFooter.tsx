import { AdminRequestType } from "../../../../@types"
import exchangeRequestService from "../../../../api/services/exchangeRequestService"
import { mailtoStringBuilder } from "../../../../utils/mail"
import { Button } from "../../../ui/button"
import { CardFooter } from "../../../ui/card"
import { Separator } from "../../../ui/separator"
import { AdminSendEmail } from "../AdminSendEmail"
import { TreatExchangeButton } from "./TreatExchangeButton"

type Props = {
    nmecs: Array<string>,
    rejectMessage: string,
    requestType: AdminRequestType,
    requestId: number,
    showTreatButton?: boolean,
    courseUnitId?: Array<number>
}

const rejectRequest = async (
    nmecs: Array<string>,
    rejectMessage: string,
    requestType: AdminRequestType,
    id: number
) => {
    try {
        await exchangeRequestService.adminRejectExchangeRequest(requestType, id);

        const a = document.createElement('a');
        a.href = `${mailtoStringBuilder(nmecs)}?subject=Pedido de troca rejeitado&body=${rejectMessage}`;
        a.click();
    } catch (e) {
        console.error(e);
    }
}

export const AdminRequestCardFooter = ({
    nmecs,
    rejectMessage,
    requestType,
    requestId,
    showTreatButton = true,
    courseUnitId
}: Props) => {
    return <>
        <Separator className="my-4" />
        <CardFooter className="justify-end gap-4">
            <Button
                variant="destructive"
                onClick={() => {
                    rejectRequest(nmecs, rejectMessage, requestType, requestId);
                }}
            >
                Rejeitar
            </Button>

            {showTreatButton &&
                nmecs.map(nmec => (
                    <TreatExchangeButton
                        key={"treat-exchange-button-" + nmec}
                        nmec={nmec}
                        courseUnitId={courseUnitId[0]}
                    />
                ))
            }

            <AdminSendEmail
                nmec={nmecs}
            />
        </CardFooter>
    </>
}
