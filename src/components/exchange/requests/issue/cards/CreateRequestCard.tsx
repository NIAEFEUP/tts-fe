import { ArrowRightIcon, TrashIcon } from "@heroicons/react/24/outline"
import { Dispatch, SetStateAction, useContext, useEffect, useState } from "react"
import { ClassDescriptor, CourseInfo, SlotInfo, ClassInfo, CreateRequestData, Student } from "../../../../../@types"
import { ScrollArea } from '../../../../ui/scroll-area'
import ScheduleContext from "../../../../../contexts/ScheduleContext"
import useRequestCardCourseMetadata from "../../../../../hooks/useRequestCardCourseMetadata"
import { Button } from "../../../../ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../../../../ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../../ui/dropdown-menu"
import { Popover, PopoverContent, PopoverTrigger } from "../../../../ui/popover"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "../../../../ui/command"

type Props = {
  courseInfo: CourseInfo
  hasStudentToExchange: boolean
  setSelectedCourseUnits: Dispatch<SetStateAction<CourseInfo[]>>
  requestsHook: [Map<number, CreateRequestData>, Dispatch<SetStateAction<Map<number, CreateRequestData>>>]
}

export const CreateRequestCard = ({
  courseInfo,
  hasStudentToExchange,
  setSelectedCourseUnits,
  requestsHook
}: Props) => {
  const { data: requestMetadata } = useRequestCardCourseMetadata(courseInfo);
  const [requests, setRequests] = requestsHook;
  const [issuerOriginClass, setIssuerOriginClass] = useState<ClassInfo | null>(null);
  const [issuerOriginClassName, setIssuerOriginClassName] = useState<string | null>(null);
  const [selectedDestinationClass, setSelectedDestinationClass] = useState<ClassInfo | null>(null);
  const [selectedDestinationStudent, setSelectedDestinationStudent] = useState<Student | null>(null);
  const [studentDropdownOpen, setStudentDropdownOpen] = useState<boolean>(false);
  const { exchangeSchedule, originalExchangeSchedule, setExchangeSchedule } = useContext(ScheduleContext);
  const [beforePreviewClass, setBeforePreviewClass] = useState<Array<ClassDescriptor> | null>(null);

  useEffect(() => {
    if (!selectedDestinationStudent) return;

    if (selectedDestinationStudent?.classInfo) {
      togglePreview(selectedDestinationStudent.classInfo, selectedDestinationStudent.classInfo.slots)
      setSelectedDestinationClass(selectedDestinationStudent.classInfo)
      addRequest(selectedDestinationStudent.classInfo.name)
    } else {
      if(!beforePreviewClass) return;

      const newExchangeSchedule = exchangeSchedule.filter((scheduleItem) => beforePreviewClass.filter((item) => item.courseInfo.id === scheduleItem.courseInfo.id).length === 0);
      setExchangeSchedule(newExchangeSchedule.concat(beforePreviewClass));

      setSelectedDestinationClass(null);
      setBeforePreviewClass(null);
    }
  }, [selectedDestinationStudent])

  useEffect(() => {
    if (!originalExchangeSchedule || !courseInfo) return;
    const originClassName = findIssuerOriginClassName();

    setIssuerOriginClassName(originClassName);
    setIssuerOriginClass(findClassInfoByName(originClassName));

    const request = requests.get(courseInfo.id);
    if (request) {
      const destinationClass = findClassInfoByName(request.classNameRequesterGoesTo);
      setSelectedDestinationClass(destinationClass);
    }
  }, [originalExchangeSchedule, courseInfo, requestMetadata]);

  const findIssuerOriginClassName = (): string | null => {
    const scheduleItem = originalExchangeSchedule
      .filter((item) => item.classInfo?.slots?.[0]?.lesson_type !== "T")
      .find((item: ClassDescriptor) => item.courseInfo.id === courseInfo.id);

    return scheduleItem?.classInfo.name || null;
  };

  const findClassInfoByName = (className: string | null): ClassInfo | null => {
    return requestMetadata?.classes?.find((classInfo: ClassInfo) => classInfo.name === className) || null;
  };

  const excludeClass = () => {
    if (requests.get(courseInfo.id)) {
      const newRequests = new Map(requests);
      newRequests.delete(courseInfo.id)
      setRequests(newRequests);
    }

    const newExchangeSchedule = exchangeSchedule.filter((scheduleItem) => beforePreviewClass.filter((item) => item.courseInfo.id === scheduleItem.courseInfo.id).length === 0);
    setExchangeSchedule(newExchangeSchedule.concat(beforePreviewClass));

    setSelectedCourseUnits((prev) => prev.filter((currentCourseInfo) => currentCourseInfo.id !== courseInfo.id));
  }

  const addRequest = (destinationClassName: string) => {
    const currentRequest: CreateRequestData = {
      courseUnitId: courseInfo.id,
      courseUnitName: courseInfo.name,
      classNameRequesterGoesFrom: issuerOriginClassName,
      classNameRequesterGoesTo: destinationClassName,
      other_student: selectedDestinationStudent
    }

    requests.set(courseInfo.id, currentRequest);
    setRequests(new Map(requests));
  }

  const togglePreview = (destinationClass: ClassInfo, slots: SlotInfo[]) => {
    setBeforePreviewClass(exchangeSchedule.filter((scheduleItem) => scheduleItem.courseInfo.id === courseInfo.id));
    const newExchangeSchedule = exchangeSchedule.filter((scheduleItem) => scheduleItem.courseInfo.id !== courseInfo.id);

    for (const slot of slots) {
      newExchangeSchedule.push({
        courseInfo: courseInfo,
        classInfo: {
          id: destinationClass.id,
          name: destinationClass.name,
          slots: [slot],
          filteredTeachers: []
        }
      })
    }

    setExchangeSchedule(newExchangeSchedule);
  }

  return <Card key={courseInfo.name} className="shadow-md">
    <CardHeader className="flex flex-row justify-between items-center gap-4">
      <CardTitle className="text-md">{courseInfo.name}</CardTitle>
      <div className="flex flex-row items-center gap-x-2">
        <Button variant="destructive" className="p-4 h-7" onClick={() => excludeClass()}>
          <TrashIcon className="w-5 h-5" />
        </Button>
      </div>
    </CardHeader>
    <CardContent className="flex flex-col gap-y-4">
      {(!hasStudentToExchange || (selectedDestinationStudent && hasStudentToExchange)) &&
        <div className="flex flex-row items-center gap-x-2">
          <p>{issuerOriginClassName}</p>
          <ArrowRightIcon className="w-5 h-5" />
          <div className="p-2 rounded-md w-full">
            {(hasStudentToExchange && selectedDestinationStudent && selectedDestinationStudent.classInfo)
              ? <p>{selectedDestinationStudent.classInfo.name}</p>
              :
              <DropdownMenu>
                <DropdownMenuTrigger className="w-full">
                  <Button variant="outline" className="w-full">
                    {selectedDestinationClass?.name ?? "Escolher turma..."}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-full">
                  <ScrollArea className="max-h-72 rounded overflow-y-auto">
                    {requestMetadata?.classes?.filter((currentClass) => currentClass.name !== issuerOriginClassName)
                      .map((currentClass) => (
                        <DropdownMenuItem
                          key={"dropdown-class-" + currentClass.name}
                          className="w-full"
                          onMouseEnter={() => togglePreview(currentClass, currentClass.slots)}
                          onMouseLeave={() => {
                            const persistentClass = selectedDestinationClass || issuerOriginClass;
                            togglePreview(persistentClass, persistentClass?.slots);
                          }}
                          onSelect={() => {
                            setSelectedDestinationClass(currentClass);
                            togglePreview(currentClass, currentClass.slots);
                            addRequest(currentClass.name);
                          }
                          }>
                          <p className="w-full">{currentClass.name}</p>
                        </DropdownMenuItem>
                      ))}
                  </ScrollArea>
                </DropdownMenuContent>
              </DropdownMenu>
            }
          </div>
        </div>
      }

      <div className="flex flex-col gap-y-4">
        <div className={`${hasStudentToExchange ? "" : "hidden"}`}>
          <Popover open={studentDropdownOpen} onOpenChange={setStudentDropdownOpen}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={studentDropdownOpen}
                className="w-full justify-between"
              >
                {selectedDestinationStudent
                  ? <p>{selectedDestinationStudent.name}</p>
                  : <p>Escolher estudante</p>
                }
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full w-[var(--radix-popper-anchor-width)]">
              <Command>
                <CommandInput
                  placeholder="Pesquisar por estudante"
                  className="w-full"
                />

                <ScrollArea className="max-h-72 overflow-y-auto rounded">
                  <CommandList>
                    <CommandEmpty>Sem pessoas encontradas</CommandEmpty>
                  </CommandList>
                  <CommandGroup>
                    {requestMetadata?.students?.map((student) => (
                      <CommandItem
                        key={"dropdown-student-" + student.name}
                        className="w-full"
                        onSelect={() => {
                          if (requests.get(courseInfo.id)) {
                            requests.get(courseInfo.id).other_student = {
                              name: student.name,
                              mecNumber: Number(student.mecNumber),
                              classInfo: student.classInfo
                            }
                            if (student.classInfo) requests.get(courseInfo.id).classNameRequesterGoesTo = student.classInfo.name;
                            setRequests(new Map(requests));
                          }

                          setSelectedDestinationStudent(student);
                          setStudentDropdownOpen(false);
                        }}>
                        <p className="w-full">{student.name}</p>
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </ScrollArea>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </CardContent>
  </Card >
}
