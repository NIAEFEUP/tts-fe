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

  return <>
    {requests.map((request) => (
      <ReceivedRequestCard
        request={request}
      />
    ))}
  </>

}
