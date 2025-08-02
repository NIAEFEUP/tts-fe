import { requestCreatedAtDate } from "../../../../utils/date"

export const RequestDate = ({ date }: { date: string }) => {
    return <p className="text-sm">
        {requestCreatedAtDate(date)}
    </p>
}