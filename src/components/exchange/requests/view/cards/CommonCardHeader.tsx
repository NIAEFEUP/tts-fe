import { ArchiveBoxIcon, CheckCircleIcon, CheckIcon, ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline"
import { Hourglass } from "lucide-react"
import { useState } from "react"
import { MarketplaceRequest } from "../../../../../@types"
import { Button } from "../../../../ui/button"
import { CardDescription, CardHeader, CardTitle } from "../../../../ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../../ui/tooltip"
import RequestCardClassBadge from "./RequestCardClassBadge"

type Props = {
  name: string
  username: string
  hovered: boolean
  request: MarketplaceRequest
  openHook: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
  showRequestStatus?: boolean
  hideAbility?: boolean
  hideHandler: () => void
}

export const CommonCardHeader = ({ name, username, hovered, request, openHook, hideAbility = true, showRequestStatus = false, hideHandler }: Props) => {
  const [open, setOpen] = openHook;

  return <CardHeader
    className="flex flex-row gap-x-2 items-center p-4"
  >
    <img className="w-10 h-10 rounded-full shadow-md" src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Tux.svg/1200px-Tux.svg.png"></img>
    <div className="flex flex-row justify-between items-center w-full">
      <div className="flex flex-col w-full">
        <div className="flex flex-row justify-between w-full items-center">
          <CardTitle>{name}</CardTitle>
          {showRequestStatus &&
            <div className="flex items-center space-x-2">
              {!request.accepted ? (
                <div className="flex items-center gap-2 bg-yellow-100 text-yellow-600 rounded-full px-3 py-1">
                  <Hourglass className="h-4 w-4 text-yellow-600" />
                </div>
              )
                : (
                  <div className="flex items-center gap-2 bg-green-400 rounded-full px-2 py-1">
                    <CheckIcon className="h-5 w-5 text-white" />
                  </div>
                )}
            </div>
          }
          <div className="flex flex-row items-center">

            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="icon" className="text-black dark:text-white" onClick={() => {
                    hideHandler();
                  }}>
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
              <Button variant="icon" className="text-black dark:text-white" onClick={() => setOpen(false)}>
                <ChevronUpIcon className="h-5 w-5" />
              </Button>
              : <Button variant="icon" className="text-black dark:text-white" onClick={() => setOpen(true)}>
                <ChevronDownIcon className="h-5 w-5" />
              </Button>
            }
          </div>
        </div>
        <CardDescription>
          {open
            ? <p>{username}</p>
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

}
