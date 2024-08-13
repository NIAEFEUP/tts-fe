import { ArchiveBoxIcon, ArrowDownIcon, ArrowRightIcon, ArrowUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline"
import { ChevronUpIcon } from "@heroicons/react/24/solid"
import { Dispatch, SetStateAction, useState } from "react"
import { MarketplaceRequest } from "../../../../../@types"
import { Badge } from "../../../../ui/badge"
import { Button } from "../../../../ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../../ui/card"
import { Checkbox } from "../../../../ui/checkbox"
import { Separator } from "../../../../ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../../ui/tooltip"

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
  const [open, setOpen] = useState<boolean>(false);

  const hide = () => {
    const newHidden = new Set(hiddenRequests);
    newHidden.add(request.id);
    setHiddenRequests(newHidden);
  }

  return <Card key={request.id} className={`shadow-md ${hiddenRequests.has(request.id) ? "hidden" : ""}`}>
    <CardHeader className="flex flex-row gap-x-2 items-center p-4">
      <img className="w-10 h-10 rounded-full shadow-md" src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Tux.svg/1200px-Tux.svg.png"></img>
      <div className="flex flex-row justify-between items-center w-full">
        <div className="flex flex-col gap-y-1">
          <CardTitle>{request.student.name}</CardTitle>
          <CardDescription>
            {open
              ? <p>{request.student.mecNumber}</p>
              :
              <div className="flex flex-row space-x-1">
                {request.options.map((option) => (
                  <Badge>{option.acronym}</Badge>
                ))}
              </div>

            }
          </CardDescription>
        </div>
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
    </CardHeader>
    <CardContent className={`p-0 px-4 ${open ? "" : "hidden"}`}>
      {request.options?.map((option) => (
        <div>
          <Separator className="my-2" />
          <div className="flex flex-row gap-x-4 items-center w-full mb-2">
            <Checkbox id={option.acronym} className="flex-grow w-1/12 h-8" />
            <label htmlFor={option.acronym} className="w-11/12">
              <div className="flex flex-col">
                <p>{option.acronym} - {option.name}</p>
                <div className="flex flex-row gap-x-2 items-center font-bold">
                  <p>{option.classNameRequesterGoesFrom}</p>
                  <ArrowRightIcon className="w-5 h-5" />
                  <p>{option.classNameRequesterGoesTo}</p>
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
        <Button>
          Propôr troca
        </Button>
      </div>
    </CardFooter>
  </Card >
}
