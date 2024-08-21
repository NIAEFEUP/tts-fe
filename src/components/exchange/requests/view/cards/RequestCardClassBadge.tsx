import { useState } from "react";
import { ExchangeOption } from "../../../../../@types";
import { Badge } from "../../../../ui/badge";

type Props = {
  option: ExchangeOption
}

const RequestCardClassBadge = ({ option }: Props) => {
  const [showIssuerDestClass, setShowIssuerDestClass] = useState<boolean>(false);

  return <div className="flex flex-row">
    <Badge
      className="bg-gray-100 text-black"
      onMouseOver={() => setShowIssuerDestClass(true)}
      onMouseLeave={() => setShowIssuerDestClass(false)}
    >
      {option.course_unit_acronym}
    </Badge>
    <Badge
      className={`relative right-2 bg-gray-300 text-black ${showIssuerDestClass ? "block" : "hidden"} transition-all delay-1000`}
    >
      {option.class_issuer_goes_to}
    </Badge>
  </div >
}

export default RequestCardClassBadge;
