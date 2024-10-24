import { useState } from "react";
import { MarketplaceRequest } from "../../../../@types"
import { useSession } from "../../../../hooks";
import useReceivedRequests from "../../../../hooks/useReceivedRequests";
import { Card } from "../../../ui/card";
import { CommonCardHeader } from "./cards/CommonCardHeader";
import { ReceivedRequestCard } from "./cards/ReceivedRequestCard";

export const ViewReceivedRequests = () => {
  const { data } = useReceivedRequests();

  const requests = data ? [].concat(...data) : [];

  const [hovered, setHovered] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const { user } = useSession();

  return <>
    {requests.map((request) => (
      <ReceivedRequestCard
        request={request}
      />
    ))}
  </>

}
