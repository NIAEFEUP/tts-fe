import { ArchiveBoxIcon, ChevronDoubleDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline";
import { ChevronDownIcon } from "lucide-react";
import { useState } from "react";
import { MarketplaceRequest } from "../../../../../@types";
import { useSession } from "../../../../../hooks";
import { Button } from "../../../../ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "../../../../ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../../ui/tooltip";
import { CommonCardHeader } from "./CommonCardHeader";

type Props = {
  request: MarketplaceRequest
}

export const MineRequestCard = ({ request }: Props) => {
  const [hovered, setHovered] = useState<boolean>(false);
  const [open, setOpen] = useState<boolean>(false);

  const { user } = useSession();

  return <Card
    onMouseOver={() => { setHovered(true) }}
    onMouseLeave={() => { setHovered(false) }}
  >
    <CommonCardHeader
      name={user.name}
      username={user.username}
      request={request}
      hovered={hovered}
      openHook={[open, setOpen]}
      classUserGoesToName={request.type === "marketplaceexchange" ? "class_issuer_goes_to" : "class_participant_goes_to"}
      showRequestStatus={true}
      hideAbility={false}
      hideHandler={() => { }}
    />
  </Card>
}
