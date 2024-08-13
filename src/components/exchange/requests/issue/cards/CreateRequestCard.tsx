import { ArrowRightIcon, MinusIcon } from "@heroicons/react/24/outline"
import { SelectContent } from "@radix-ui/react-select"
import { Dispatch, SetStateAction, useState } from "react"
import { CreateRequestCardMetadata, ExchangeOption } from "../../../../../@types"
import { Button } from "../../../../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../ui/card"
import { Select, SelectItem, SelectTrigger, SelectValue } from "../../../../ui/select"
import { Switch } from "../../../../ui/switch"

type Props = {
  requestMetadata: CreateRequestCardMetadata
  requestsHook: [Map<string, ExchangeOption>, Dispatch<SetStateAction<Map<string, ExchangeOption>>>]
}

export const CreateRequestCard = ({
  requestMetadata,
  requestsHook
}: Props) => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const [hasStudentToExchange, setHasStudentToExchange] = useState<boolean>(false);
  const [requests, setRequests] = requestsHook;

  const excludeClass = () => {
    setExpanded(false);
  }

  const includeClass = () => {
    setExpanded(true);
  }

  const handleHasStudentToExchangeSwitch = (checked: boolean) => {
    setHasStudentToExchange(checked);
  }

  return <Card key={requestMetadata.courseUnitName} className="shadow-md">
    <CardHeader className="flex flex-row justify-between items-center">
      <CardTitle className="text-xl">{requestMetadata.courseUnitName}</CardTitle>
      {
        expanded ?
          <Button variant="destructive" className="px-2 py-1 h-7" onClick={() => excludeClass()}>
            <MinusIcon className="w-5 h-5" />
          </Button>
          : <Button className="bg-gray-200 text-black hover:bg-gray-100" onClick={() => includeClass()}>
            <p>Alterar</p>
          </Button>
      }
    </CardHeader>
    <CardContent className={`flex flex-col gap-y-4 ${expanded ? "" : "hidden"}`}>
      <div className="flex flex-row items-center gap-x-2">
        <p>{requestMetadata.requesterClassName}</p>
        <ArrowRightIcon className="w-5 h-5" />
        <Select>
          <div className="flex flex-col w-full">
            <SelectTrigger>
              <SelectValue placeholder="Escolher turma..." />
            </SelectTrigger>
            <SelectContent>
              {requestMetadata.availableClasses.map((availableClassName: string) => (
                <SelectItem key={availableClassName} value={availableClassName}>
                  {availableClassName}
                </SelectItem>
              ))}
            </SelectContent>
          </div>
        </Select>

      </div>
      <div className="flex flex-col gap-y-4">
        <div className="flex flex-row gap-2">
          <Switch id="person-to-exchange" onCheckedChange={(checked) => handleHasStudentToExchangeSwitch(checked)} />
          <label htmlFor="person-to-exchange">
            Tenho uma pessoa para trocar
          </label>
        </div>
        <div className={`${hasStudentToExchange ? "" : "hidden"}`}>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Escolher estudante..." />
            </SelectTrigger>
            <SelectContent>
            </SelectContent>
          </Select>
        </div>
      </div>
    </CardContent>
  </Card>
}
