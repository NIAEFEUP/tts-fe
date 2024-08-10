import { ArrowRightIcon, MinusIcon } from "@heroicons/react/24/outline"
import { useState } from "react"
import { Button } from "../../../../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../ui/card"
import { Select, SelectTrigger, SelectValue } from "../../../../ui/select"
import { Switch } from "../../../../ui/switch"

type Props = {
  courseUnitName: string,
  requesterClassName: string
}

export const CreateRequestCard = ({
  courseUnitName,
  requesterClassName
}: Props) => {
  const [expanded, setExpanded] = useState<boolean>(false);
  const [hasStudentToExchange, setHasStudentToExchange] = useState<boolean>(false);

  const excludeClass = () => {
    setExpanded(false);
  }

  const includeClass = () => {
    setExpanded(true);
  }

  const handleHasStudentToExchangeSwitch = (checked: boolean) => {
    setHasStudentToExchange(checked);
  }

  return <Card>
    <CardHeader className="flex flex-row justify-between items-center">
      <CardTitle className="text-xl">{courseUnitName}</CardTitle>
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
        <p>{requesterClassName}</p>
        <ArrowRightIcon className="w-5 h-5" />
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Escolher turma..." />
          </SelectTrigger>
        </Select>
      </div>
      <div className="flex flex-row gap-2">
        <Switch id="person-to-exchange" onCheckedChange={(checked) => handleHasStudentToExchangeSwitch(checked)} />
        <label htmlFor="person-to-exchange">
          Tenho uma pessoa para trocar
        </label>
      </div>
    </CardContent>
  </Card>
}
