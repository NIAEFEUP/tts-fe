import { useState } from "react";
import { ExchangeOption } from "../../../../../@types";
import { Badge } from "../../../../ui/badge";

type Props = {
  option: ExchangeOption
  requestCardHovered: boolean
}

const RequestCardClassBadge = ({ option, requestCardHovered }: Props) => {
  return <div className="flex flex-row">
    <Badge
      className="bg-gray-100 text-black"
    >
      {option.course_info?.acronym}
    </Badge>
    <Badge
      className={`relative right-2 bg-gray-300 text-black ${requestCardHovered ? "block" : "hidden"} transition-all delay-1000`}
    >
      {option.class_issuer_goes_to.name}
    </Badge>
  </div >
}

export default RequestCardClassBadge;
