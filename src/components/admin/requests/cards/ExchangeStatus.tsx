import { CourseUnitEnrollment, DirectExchangeRequest, UrgentRequest } from "../../../../@types"
import { cn } from "../../../../utils"

type Props = {
    exchange: DirectExchangeRequest | UrgentRequest | CourseUnitEnrollment
}

type ExchangeStatusProperty = {
    message: string,
    color: string
}

const exchangeStatusProperties = (exchange: DirectExchangeRequest | UrgentRequest | CourseUnitEnrollment) => {
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
        <p className={cn(status?.color, "rounded-full px-4 py-1 text-sm")}>
            {status.message}
        </p>
    )
}