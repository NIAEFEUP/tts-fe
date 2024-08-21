import { ArrowLeftIcon, ArrowRightIcon, MinusIcon } from "@heroicons/react/24/outline"
import { Dispatch, SetStateAction, useState } from "react"
import { CreateRequestCardMetadata, CreateRequestData } from "../../../../../@types"
import { Button } from "../../../../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../../ui/dropdown-menu"
import { Switch } from "../../../../ui/switch"

type Props = {
  requestMetadata: CreateRequestCardMetadata
  requestsHook: [Map<string, CreateRequestData>, Dispatch<SetStateAction<Map<string, CreateRequestData>>>]
}

export const CreateRequestCard = ({
  requestMetadata,
  requestsHook
}: Props) => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const [hasStudentToExchange, setHasStudentToExchange] = useState<boolean>(false);
  const [requests, setRequests] = requestsHook;
  const [selectedDestinationClass, setSelectedDestinationClass] = useState<string | null>(null);
  const [selectedDestinationStudent, setSelectedDestinationStudent] = useState<string | null>(null);

  const excludeClass = () => {
    setExpanded(false);
    if (requests.get(requestMetadata.courseUnitName)) {
      const newRequests = new Map(requests);
      newRequests.delete(requestMetadata.courseUnitName)
      setRequests(newRequests);
    }

    restoreDefaults();
  }

  const restoreDefaults = () => {
    setSelectedDestinationStudent(null);
    setSelectedDestinationClass(null);
    setHasStudentToExchange(false);
  }

  const includeClass = () => {
    setExpanded(true);
  }

  const handleHasStudentToExchangeSwitch = (checked: boolean) => {
    setHasStudentToExchange(checked);
  }

  const addRequest = () => {
    const currentRequest: CreateRequestData = {
      classNameRequesterGoesFrom: requestMetadata.requesterClassName,
      classNameRequesterGoesTo: selectedDestinationClass
    }

    if (selectedDestinationStudent) currentRequest.other_student = Number(selectedDestinationStudent);

    const newRequests = new Map(requests);
    newRequests.set(requestMetadata.courseUnitName, currentRequest);
    setRequests(newRequests);
  }

  return <Card key={requestMetadata.courseUnitName} className="shadow-md">
    <CardHeader className="flex flex-row justify-between items-center">
      <CardTitle className="text-xl">{requestMetadata.courseUnitName}</CardTitle>
      {
        expanded ?
          <div className="flex flex-row items-center gap-x-2">
            <Button variant="destructive" className="p-4 h-7" onClick={() => excludeClass()}>
              -
            </Button>
            <Button className="p-4 h-7" onClick={() => addRequest()}>
              +
            </Button>
          </div>
          : <Button className="bg-gray-200 text-black hover:bg-gray-100" onClick={() => includeClass()}>
            <p>Alterar</p>
          </Button>
      }
    </CardHeader>
    <CardContent className={`flex flex-col gap-y-4 ${expanded ? "" : "hidden"}`}>
      <div className="flex flex-row items-center gap-x-2">
        <p>{requestMetadata.requesterClassName}</p>
        <ArrowRightIcon className="w-5 h-5" />
        <div className="p-2 rounded-md w-full">
          <DropdownMenu>
            <DropdownMenuTrigger className="w-full">
              <Button variant="outline" className="w-full">
                {selectedDestinationClass ?? "Escolher turma..."}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full">
              {requestMetadata.availableClasses.filter((className) => className !== requestMetadata.requesterClassName)
                .map((className: string) => (
                  <DropdownMenuItem className="w-full" onSelect={() => { setSelectedDestinationClass(className) }}>
                    <p className="w-full">{className}</p>
                  </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="flex flex-col gap-y-4">
        <div className="flex flex-row gap-2">
          <Switch id="person-to-exchange" onCheckedChange={(checked) => handleHasStudentToExchangeSwitch(checked)} />
          <label htmlFor="person-to-exchange">
            Tenho uma pessoa para trocar
          </label>
        </div>
        <div className={`${hasStudentToExchange ? "" : "hidden"}`}>
          <DropdownMenu>
            <DropdownMenuTrigger className="w-full">
              <Button variant="outline" className="w-full">
                {selectedDestinationStudent ?? "Escolher estudante..."}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full">
              {requestMetadata.availableClasses.map((className: string) => (
                <DropdownMenuItem className="w-full" onSelect={() => { setSelectedDestinationClass(className) }}>
                  <p className="w-full">{className}</p>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </CardContent>
  </Card>
}
