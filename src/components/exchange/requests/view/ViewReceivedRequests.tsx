import useReceivedRequests from "../../../../hooks/useReceivedRequests";
import { ReceivedRequestCard } from "./cards/ReceivedRequestCard";

export const ViewReceivedRequests = () => {
  const { data } = useReceivedRequests();

  const requests = data ? [].concat(...data) : [];

  return <>
    {requests.map((request) => (
      <ReceivedRequestCard 
        key={request.id}
        request={request}
      />
    ))}
  </>

}
