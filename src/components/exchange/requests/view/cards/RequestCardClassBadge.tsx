import { ExchangeOption } from '../../../../../@types'
import { Badge } from '../../../../ui/new/badge'

type Props = {
  option: ExchangeOption
  requestCardHovered: boolean
  classUserGoesToName: string
}

const RequestCardClassBadge = ({ option, requestCardHovered, classUserGoesToName }: Props) => {
  return (
    <div className="flex flex-row">
      <Badge className="ml-2">{option.course_info?.acronym}</Badge>
      <Badge>{classUserGoesToName}</Badge>
    </div>
  )
}

export default RequestCardClassBadge
