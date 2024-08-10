import { ArchiveBoxIcon, ArrowDownIcon, ArrowRightIcon, ArrowUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline"
import { ChevronUpIcon } from "@heroicons/react/24/solid"
import { useState } from "react"
import { MarketplaceExchangeOption, Student } from "../../../../../@types"
import { Badge } from "../../../../ui/badge"
import { Button } from "../../../../ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../../ui/card"
import { Checkbox } from "../../../../ui/checkbox"
import { Separator } from "../../../../ui/separator"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../../ui/tooltip"

type Props = {
  exchangeOptions: Array<MarketplaceExchangeOption>
  requesterStudent: Student
}

export const RequestCard = ({
  exchangeOptions,
  requesterStudent
}: Props) => {
  const [open, setOpen] = useState<boolean>(false);


  return <Card key="h">
    <CardHeader className="flex flex-row gap-x-2 items-center p-4">
      <img className="w-10 h-10 rounded-full" src="https://media.discordapp.net/attachments/835966721831075840/1271795585455886470/images.png?ex=66b8a370&is=66b751f0&hm=11a977a507482e37bf299eb0c7c5347cf0a3cfc2e31e5b88d26aa732bfa2b49f&=&format=webp&quality=lossless&width=338&height=232"></img>
      <div className="flex flex-row justify-between items-center w-full">
        <div className="flex flex-col gap-y-1">
          <CardTitle>{requesterStudent.name}</CardTitle>
          <CardDescription>
            {open
              ? <p>{requesterStudent.mecNumber}</p>
              :
              <div className="flex flex-row space-x-1">
                {exchangeOptions.map((option) => (
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
                <Button variant="icon" className="text-black">
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
      {exchangeOptions?.map((option) => (
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
