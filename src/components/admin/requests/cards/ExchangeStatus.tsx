import { CourseUnitEnrollment, DirectExchangeRequest, MarketplaceRequest, UrgentRequest } from "../../../../@types"
import { cn } from "../../../../utils"

type Props = {
    exchange: DirectExchangeRequest | UrgentRequest | CourseUnitEnrollment | MarketplaceRequest
}

type ExchangeStatusProperty = {
    message: string,
    color: string
}

const exchangeStatusProperties = (exchange: DirectExchangeRequest | UrgentRequest | CourseUnitEnrollment | MarketplaceRequest) => {
    switch (exchange.admin_state) {
        case "accepted": case "treated":
            return {
                "message": "Aceite",
                "color": "bg-green-200 text-green-800",
            };
        case "rejected":
            return {
                "message": "Rejeitado",
                "color": "bg-red-200 text-red-800",
            }
        case "untreated":
            return {
                "message": "Não tratado",
                "color": "bg-yellow-200 text-yellow-800",
            }
        case "awaiting-information":
            return {
                "message": "A aguardar informação",
                "color": "bg-blue-500 text-white",
            }
    }
}

export const ExchangeStatus = ({
    exchange
}: Props) => {
    const status: ExchangeStatusProperty = exchangeStatusProperties(exchange);

    return (
        <p className={cn(status?.color, "rounded-full px-4 py-1 text-sm")}>
            {status?.message}
        </p>
    )
}