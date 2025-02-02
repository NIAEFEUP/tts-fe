import { CheckIcon, Hourglass, MessageCircleX, X } from "lucide-react"
import { StudentRequestCardStatus } from "../../../../../utils/requests"

type Props = {
    status: StudentRequestCardStatus
}

const AcceptedRequestCardStatus = () => {
    return (
        <div className="flex items-center gap-2 bg-green-400 rounded-full px-2 py-1">
            <CheckIcon className="h-5 w-5 text-white" />
        </div>
    );
}

const PendingRequestCardStatus = () => {
    return (
        <div className="flex items-center gap-2 bg-yellow-100 text-yellow-600 rounded-full px-3 py-1">
            <Hourglass className="h-4 w-4 text-yellow-600" />
        </div>
    );
}

const CancelledRequestCardStatus = () => {
    return (
        <div className="flex items-center gap-2 bg-red-400 rounded-full px-3 py-1">
            <X className="h-4 w-4 text-white" />
        </div>
    );
}

export const RequestCardStatus = ({
    status
}: Props) => {
    if (status === StudentRequestCardStatus.ACCEPTED) {
        return <AcceptedRequestCardStatus />
    }

    if (status === StudentRequestCardStatus.PENDING) {
        return <PendingRequestCardStatus />
    }

    return <CancelledRequestCardStatus />
}