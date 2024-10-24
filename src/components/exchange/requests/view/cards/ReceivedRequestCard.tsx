import { useState } from "react";
import { DirectExchangeRequest, MarketplaceRequest } from "../../../../../@types"
import { useSession } from "../../../../../hooks";
import { Card, CardContent, CardDescription, CardFooter } from "../../../../ui/card";
import { CommonCardHeader } from "./CommonCardHeader";
import { ListRequestChanges } from "./ListRequestChanges";

type Props = {
  request: DirectExchangeRequest
}

export const ReceivedRequestCard = ({
  request
}: Props) => {
  const [hovered, setHovered] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const { user } = useSession();

  return <Card
    onMouseOver={() => { setHovered(true) }}
    onMouseLeave={() => { setHovered(false) }}
  >
    <CommonCardHeader
      name={request.issuer_name}
      username={request.issuer_nmec}
      request={request}
      hovered={hovered}
      openHook={[open, setOpen]}
      showRequestStatus={true}
      hideAbility={false}
      hideHandler={() => { }}
    />
    <CardContent>
      {/*
        Show the changes that will be made for the auth user only.
        The other changes that do not change the class of the student
        should not be shown
      */}
      {open && (
        <>
          {request.participants.filter((participant) => participant.participant_nmec === user.username).map((request) => (
            <p>Hello</p>
          ))}
        </>
      )}
    </CardContent>
    <CardFooter className={open ? "" : "hidden"}>

    </CardFooter>
  </Card>


}
