import { CheckIcon, Hourglass, X } from 'lucide-react'
import { StudentRequestCardStatus } from '../../../../../utils/requests'
import { Badge } from '../../../../ui/new/badge'

type Props = {
  status: StudentRequestCardStatus
}

const AcceptedRequestCardStatus = () => {
  return (
    <Badge variant="success" size="sm">
      <Badge.Icon>
        <CheckIcon className="h-4 w-4" />
      </Badge.Icon>
    </Badge>
  )
}

const PendingRequestCardStatus = () => {
  return (
    <Badge variant="warning" size="sm">
      <Badge.Icon>
        <Hourglass className="h-4 w-4" />
      </Badge.Icon>
    </Badge>
  )
}

const CancelledRequestCardStatus = () => {
  return (
    <Badge variant="error" size="sm">
      <Badge.Icon>
        <X className="h-4 w-4" />
      </Badge.Icon>
    </Badge>
  )
}

export const RequestCardStatus = ({ status }: Props) => {
  if (status === StudentRequestCardStatus.ACCEPTED) {
    return <AcceptedRequestCardStatus />
  }

  if (status === StudentRequestCardStatus.PENDING) {
    return <PendingRequestCardStatus />
  }

  return <CancelledRequestCardStatus />
}
