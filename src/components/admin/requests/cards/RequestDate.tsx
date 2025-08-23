import { requestCreatedAtDate } from "../../../../utils/date"
import { requestLastUpdatedDate } from "../../../../utils/date"

export const RequestDate = ({ date }: { date: string }) => {
    return <p className="text-sm">
        {requestCreatedAtDate(date)}
    </p>
}
export const RequestLastUpdatedDate = ({ date }: { date?: string }) => {

    return (
        <p className="text-sm">
            {requestLastUpdatedDate(date)}
        </p>
    );
};