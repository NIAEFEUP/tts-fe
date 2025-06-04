import { DirectExchangeRequest } from "../../../../../@types"
import { DirectExchangePendingMotive } from "../../../../../utils/exchange"

type Props = {
    request: DirectExchangeRequest
}

export const RequestCardPendingMotive = ({
    request
}: Props) => {
    if (request.accepted) {
        return <></>
    }

    if(request.canceled) {
        return <p>O pedido foi cancelado.</p>
    }

    return (
        <>
            {
                request.pending_motive === DirectExchangePendingMotive.USER_DID_NOT_ACCEPT
                    ? <p>Ainda não aceitaste.</p>
                    : <p>As outras pessoas ainda não aceitaram</p>
            }
        </>
    )
}