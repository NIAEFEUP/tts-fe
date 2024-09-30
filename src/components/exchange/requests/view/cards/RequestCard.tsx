import { ArchiveBoxIcon, ArrowDownIcon, ArrowRightIcon, ArrowUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline"
import { ChevronUpIcon } from "@heroicons/react/24/solid"
import { Dispatch, SetStateAction, useContext, useState } from "react"
import { ClassInfo, ExchangeOption, MarketplaceRequest } from "../../../../../@types"
import ScheduleContext from "../../../../../contexts/ScheduleContext"
import { Badge } from "../../../../ui/badge"
import { Button } from "../../../../ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../../ui/card"
import { Checkbox } from "../../../../ui/checkbox"
import { Separator } from "../../../../ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../../ui/tooltip"
import { toast } from "../../../../ui/use-toast"
import { CommonCardHeader } from "./CommonCardHeader"
import RequestCardClassBadge from "./RequestCardClassBadge"

type Props = {
  request: MarketplaceRequest
  hiddenRequests: Set<number>
  setHiddenRequests: Dispatch<SetStateAction<Set<number>>>
}

export const RequestCard = ({
  request,
  hiddenRequests,
  setHiddenRequests
}: Props) => {
  const { exchangeSchedule, setExchangeSchedule } = useContext(ScheduleContext);
  const [open, setOpen] = useState<boolean>(false);
  const [hovered, setHovered] = useState<boolean>(false);

  const hide = () => {
    const newHidden = new Set(hiddenRequests);
    newHidden.add(request.id);
    setHiddenRequests(newHidden);
    toast({
      title: "Pedido escondido",
      description: "O pedido foi escondido da lista de pedidos.",
      position: "top-right",
    });
  }

  console.log("current request: ", request);

  console.log("what? ", request?.options);

  return <Card
    onMouseOver={() => { setHovered(true) }}
    onMouseLeave={() => { setHovered(false) }}
    key={request.id}
    className={`${hovered ? "shadow-md" : "shadow-sm"} ${hiddenRequests.has(request.id) ? "hidden" : ""}`}
  >
    <CommonCardHeader
      name={request.issuer_name}
      username={`${request.issuer_nmec}`}
      hovered={hovered}
      request={request}
      openHook={[open, setOpen]}
      hideHandler={hide}
    />
    <CardContent className={`p-0 px-4 ${open ? "" : "hidden"}`}>
      {request.options?.map((option) => (
        <div>
          <Separator className="my-2" />
          <div className="flex flex-row gap-x-4 items-center w-full mb-2">
            <Checkbox id={option.course_info?.acronym} className="flex-grow w-1/12 h-8" />
            <label htmlFor={option.course_info?.acronym} className="w-11/12">
              <div className="flex flex-col">
                <p>{option.course_info?.acronym} - {option.course_info?.name}</p>
                <div className="flex flex-row gap-x-2 items-center font-bold">
                  <p>{option.class_issuer_goes_from}</p>
                  <ArrowRightIcon className="w-5 h-5" />
                  <p>{option.class_issuer_goes_to}</p>
                </div>
              </div>
            </label>
          </div>
        </div>
      ))}
    </CardContent>
    {open ? <Separator className="mb-2" /> : <></>}
    <CardFooter className={open ? "" : "hidden"}>
      <div className="flex flex-row justify-between w-full items-center">
        <div className="flex flex-row items-center gap-x-2">
          <Checkbox id="select-all" />
          <label htmlFor="select-all">
            Selecionar todas
          </label>
        </div>
        <div className="flex flex-row gap-2">
          <Button onClick={() => {
            const newExchangeSchedule = [...exchangeSchedule];
            request?.options.forEach((option: ExchangeOption, idx: number) => {
              newExchangeSchedule.push(
                {
                  courseInfo: option.course_info,
                  classInfo: request.classes[idx]
                });
            });
            setExchangeSchedule(newExchangeSchedule);
          }}>
            Prever
          </Button>
          <Button>
            Propôr troca
          </Button>
        </div>
      </div>
    </CardFooter>
  </Card >
}
