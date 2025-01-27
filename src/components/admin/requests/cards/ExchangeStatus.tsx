import { DirectExchangeRequest, UrgentRequest } from "../../../../@types"
import { cn } from "../../../../utils"

type Props = {
    exchange: DirectExchangeRequest | UrgentRequest
}

type ExchangeStatusProperty = {
    message: string,
    color: string
}

const exchangeStatusProperties = (exchange: DirectExchangeRequest | UrgentRequest) => {
    if (exchange.accepted) {
        return {
            "message": "Aceite",
            "color": "bg-green-200 text-green-800",
        };
    } else {
        return {
            "message": "Pendente",
            "color": "bg-yellow-200 text-yellow-800",
        }
    }
}

export const ExchangeStatus = ({
    exchange
}: Props) => {
    const status: ExchangeStatusProperty = exchangeStatusProperties(exchange);

    return (
        <p className={cn(status.color, "rounded-full px-4 py-1 text-sm")}>
            {status.message}
        </p>
    )
}