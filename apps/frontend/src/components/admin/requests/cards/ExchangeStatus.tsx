import { CourseUnitEnrollment, DirectExchangeRequest, MarketplaceRequest, UrgentRequest } from '../../../../@types'
import { Badge } from '../../../ui/new/badge'

type Props = {
  exchange: DirectExchangeRequest | UrgentRequest | CourseUnitEnrollment | MarketplaceRequest
}

type ExchangeStatusProperty = {
  message: string
  variant: 'success' | 'error' | 'warning' | 'info' | 'neutral'
}

const exchangeStatusProperties = (
  exchange: DirectExchangeRequest | UrgentRequest | CourseUnitEnrollment | MarketplaceRequest,
): ExchangeStatusProperty => {
  switch (exchange.admin_state) {
    case 'accepted':
    case 'treated':
      return {
        message: 'Aceite',
        variant: 'success',
      }
    case 'rejected':
      return {
        message: 'Rejeitado',
        variant: 'error',
      }
    case 'untreated':
      return {
        message: 'Não tratado',
        variant: 'warning',
      }
    case 'awaiting-information':
      return {
        message: 'A aguardar informação',
        variant: 'info',
      }
  }
}

export const ExchangeStatus = ({ exchange }: Props) => {
  const status: ExchangeStatusProperty = exchangeStatusProperties(exchange)

  return (
    <Badge variant={status?.variant} size="md">
      {status?.message}
    </Badge>
  )
}
