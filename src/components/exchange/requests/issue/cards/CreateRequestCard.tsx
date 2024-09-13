import { ArrowLeftIcon, ArrowRightIcon, MinusIcon } from "@heroicons/react/24/outline"
import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react"
import { ClassDescriptor, CourseInfo, CreateRequestCardMetadata, CreateRequestData, Student } from "../../../../../@types"
import { ScrollArea } from '../../../../ui/scroll-area'
import ScheduleContext from "../../../../../contexts/ScheduleContext"
import useRequestCardCourseMetadata from "../../../../../hooks/useRequestCardCourseMetadata"
import { Button } from "../../../../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../../ui/dropdown-menu"
import { Switch } from "../../../../ui/switch"

type Props = {
  courseInfo: CourseInfo
  requestsHook: [Map<number, CreateRequestData>, Dispatch<SetStateAction<Map<number, CreateRequestData>>>]
}

export const CreateRequestCard = ({
  courseInfo,
  requestsHook
}: Props) => {
  const { data: requestMetadata } = useRequestCardCourseMetadata(courseInfo);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [hasStudentToExchange, setHasStudentToExchange] = useState<boolean>(false);
  const [requests, setRequests] = requestsHook;
  const [issuerOriginClass, setIssuerOriginClass] = useState<string | null>(null);
  const [selectedDestinationClass, setSelectedDestinationClass] = useState<string | null>(null);
  const [selectedDestinationStudent, setSelectedDestinationStudent] = useState<Student | null>(null);
  const { exchangeSchedule } = useContext(ScheduleContext);

  useEffect(() => {
    if (exchangeSchedule) {
      setIssuerOriginClass(
        exchangeSchedule.find((scheduleItem: ClassDescriptor) => scheduleItem.courseInfo.id === courseInfo.id).classInfo.name
      );
    }
  }, [exchangeSchedule]);

  const excludeClass = () => {
    setExpanded(false);
    if (requests.get(courseInfo.id)) {
      const newRequests = new Map(requests);
      newRequests.delete(courseInfo.id)
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
      classNameRequesterGoesFrom: issuerOriginClass,
      classNameRequesterGoesTo: selectedDestinationClass
    }

    if (selectedDestinationStudent) currentRequest.other_student = selectedDestinationStudent.mecNumber;

    const newRequests = new Map(requests);
    newRequests.set(courseInfo.id, currentRequest);
    setRequests(newRequests);

    console.log("current new requests: ", newRequests);
  }

  return <Card key={courseInfo.name} className="shadow-md">
    <CardHeader className="flex flex-row justify-between items-center gap-4">
      <CardTitle className="text-md">{courseInfo.name}</CardTitle>
      {
        expanded ?
          <div className="flex flex-row items-center gap-x-2">
            <Button variant="destructive" className="p-4 h-7" onClick={() => excludeClass()}>
              -
            </Button>
            <Button className="p-4 h-7" onClick={() => { addRequest() }}>
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
        <p>{issuerOriginClass}</p>
        <ArrowRightIcon className="w-5 h-5" />
        <div className="p-2 rounded-md w-full">
          <DropdownMenu>
            <DropdownMenuTrigger className="w-full">
              <Button variant="outline" className="w-full">
                {selectedDestinationClass ?? "Escolher turma..."}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full">
              <ScrollArea className="max-h-72 rounded overflow-y-auto">
                {requestMetadata?.classes.filter((currentClass) => currentClass.name !== issuerOriginClass)
                  .map((currentClass) => (
                    <DropdownMenuItem className="w-full" onSelect={() => { setSelectedDestinationClass(currentClass.name) }}>
                      <p className="w-full">{currentClass.name}</p>
                    </DropdownMenuItem>
                  ))}
              </ScrollArea>
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
                {selectedDestinationStudent ? selectedDestinationStudent.name : "Escolher estudante..."}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-full max-h-fit overflow-scroll">
              <ScrollArea className="max-h-72 overflow-y-auto rounded">
                {requestMetadata?.students.map((student) => (
                  <DropdownMenuItem className="w-full" onSelect={() => {
                    setSelectedDestinationStudent({ name: student.nome, mecNumber: Number(student.codigo) })
                  }}>
                    <p className="w-full">{student.nome}</p>
                  </DropdownMenuItem>
                ))}
              </ScrollArea>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </CardContent>
  </Card >
}
