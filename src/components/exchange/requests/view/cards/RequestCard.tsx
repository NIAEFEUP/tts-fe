import { ArchiveBoxIcon, ArrowDownIcon, ArrowRightIcon, ArrowUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline"
import { ChevronUpIcon } from "@heroicons/react/24/solid"
import { Dispatch, SetStateAction, useContext, useState } from "react"
import { MarketplaceRequest } from "../../../../../@types"
import ScheduleContext from "../../../../../contexts/ScheduleContext"
import { Badge } from "../../../../ui/badge"
import { Button } from "../../../../ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../../ui/card"
import { Checkbox } from "../../../../ui/checkbox"
import { Separator } from "../../../../ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../../ui/tooltip"
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
  const { setExchangeSchedule } = useContext(ScheduleContext);
  const [open, setOpen] = useState<boolean>(false);
  const [hovered, setHovered] = useState<boolean>(false);

  const hide = () => {
    const newHidden = new Set(hiddenRequests);
    newHidden.add(request.id);
    setHiddenRequests(newHidden);
  }

  return <Card
    onMouseOver={() => { setHovered(true) }}
    onMouseLeave={() => { setHovered(false) }}
    key={request.id}
    className={`shadow-md ${hiddenRequests.has(request.id) ? "hidden" : ""}`}
  >
    <CardHeader className="flex flex-row gap-x-2 items-center p-4">
      <img className="w-10 h-10 rounded-full shadow-md" src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Tux.svg/1200px-Tux.svg.png"></img>
      <div className="flex flex-row justify-between items-center w-full">
        <div className="flex flex-col w-full">
          <div className="flex flex-row justify-between w-full items-center">
            <CardTitle>{request.issuer_name}</CardTitle>
            <div className="flex flex-row items-center">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="icon" className="text-black" onClick={() => hide()}>
                      <ArchiveBoxIcon className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Esconder</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              {open
                ?
                <Button variant="icon" className="text-black" onClick={() => setOpen(false)}>
                  <ChevronUpIcon className="h-5 w-5" />
                </Button>
                : <Button variant="icon" className="text-black" onClick={() => setOpen(true)}>
                  <ChevronDownIcon className="h-5 w-5" />
                </Button>
              }
            </div>
          </div>
          <CardDescription>
            {open
              ? <p>{request.issuer_nmec}</p>
              :
              <div className="flex flex-row gap-x-1 gap-y-2 flex-wrap">
                {request.options?.map((option) => (
                  <RequestCardClassBadge
                    option={option}
                    requestCardHovered={hovered}
                  />
                ))}
              </div>

            }
          </CardDescription>
        </div>
      </div>
    </CardHeader>
    <CardContent className={`p-0 px-4 ${open ? "" : "hidden"}`}>
      {request.options?.map((option) => (
        <div>
          <Separator className="my-2" />
          <div className="flex flex-row gap-x-4 items-center w-full mb-2">
            <Checkbox id={option.course_unit_acronym} className="flex-grow w-1/12 h-8" />
            <label htmlFor={option.course_unit_acronym} className="w-11/12">
              <div className="flex flex-col">
                <p>{option.course_unit_acronym} - {option.course_unit_name}</p>
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
            setExchangeSchedule((prev) => {
              const newExchangeSchedule = [...prev];
              request?.options.forEach((option) => {
                // newExchangeSchedule.push()
              });
              return [];
            })
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
