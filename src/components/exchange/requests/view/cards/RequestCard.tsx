import { ArchiveBoxIcon, ArrowRightIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { ChevronUpIcon } from "@heroicons/react/24/solid";
import { Dispatch, SetStateAction, useContext, useState, useEffect } from "react";
import { ClassDescriptor, MarketplaceRequest } from "../../../../../@types";
import ScheduleContext from "../../../../../contexts/ScheduleContext";
import { Button } from "../../../../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../../ui/card";
import { Checkbox } from "../../../../ui/checkbox";
import { Separator } from "../../../../ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../../ui/tooltip";
import RequestCardClassBadge from "./RequestCardClassBadge";
import useSchedule from "../../../../../hooks/useSchedule";
import { toast } from "../../../../ui/use-toast";
import exchangeRequestService from "../../../../../api/services/exchangeRequestService";

type Props = {
  request: MarketplaceRequest;
  hiddenRequests: Set<number>;
  setHiddenRequests: Dispatch<SetStateAction<Set<number>>>;
  chosenRequest: MarketplaceRequest | null;
  setChosenRequest: Dispatch<SetStateAction<MarketplaceRequest | null>>;
};

export const RequestCard = ({
  request,
  hiddenRequests,
  setHiddenRequests,
  chosenRequest,
  setChosenRequest,
}: Props) => {
  const { exchangeSchedule, setExchangeSchedule } = useContext(ScheduleContext);
  const [open, setOpen] = useState<boolean>(false);
  const [hovered, setHovered] = useState<boolean>(false);
  const [selectedOptions, setSelectedOptions] = useState<Map<string, boolean>>(new Map());
  const [selectAll, setSelectAll] = useState<boolean>(true);
  const originalSchedule = useSchedule();

  console.log("currently selected options are: ", selectedOptions);

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

  // When the request changes it updates the options it is selected 
  // and the default is for all options to be set to true
  useEffect(() => {
    const ucs = new Set(request.options.map((option) => option.course_info.acronym));

    const newSelectedOptions = new Map();
    ucs.forEach((acronym) => {
      newSelectedOptions.set(acronym, true);
    });

    setSelectedOptions(newSelectedOptions);
  }, [request]);

  useEffect(() => {
    if (open) {
      setChosenRequest(request);
      togglePreview(selectedOptions);
    } else {
      setExchangeSchedule(originalSchedule.schedule);
    }
  }, [open]);

  console.log("current open: ", open);

  useEffect(() => {
    if (chosenRequest?.id !== request.id) {
      setOpen(false);
    }
  }, [chosenRequest]);

  const handleOptionChange = (acronym: string) => {
    selectedOptions.set(acronym, !selectedOptions.get(acronym));
    setSelectedOptions(new Map(selectedOptions));

    const allSelected = Array.from(selectedOptions.values()).every((value) => value);
    setSelectAll(allSelected);

    togglePreview(selectedOptions);
  };

  const handleSelectAll = () => {
    const allSelected = !selectAll;
    setSelectAll(allSelected);

    for (const key of selectedOptions.keys()) {
      selectedOptions.set(key, allSelected);
    }

    const newSelectedOptions = new Map(selectedOptions);
    setSelectedOptions(newSelectedOptions);
    togglePreview(newSelectedOptions);
  };

  const togglePreview = (updatedOptions: Map<string, boolean>) => {
    console.log("current updated options: ", updatedOptions);
    const anySelected = Array.from(updatedOptions.values()).some((value) => value);

    // Schedule with courses that are not selected
    const newExchangeSchedule = originalSchedule?.schedule?.filter(
      (classDescriptor: ClassDescriptor) => {
        return !updatedOptions.get(classDescriptor.courseInfo.acronym);
      }
    );

    if (anySelected) {
      request.options.forEach((option) => {
        if (updatedOptions.get(option.course_info.acronym) === true) {
          const matchingClass = option.class_issuer_goes_from;
          matchingClass.slots.forEach((slot) => {
            newExchangeSchedule.push({
              courseInfo: option.course_info,
              classInfo: { id: matchingClass.id, name: matchingClass.name, slots: [slot] },
            });
          });
        }
      });

      setExchangeSchedule(newExchangeSchedule);
    } else {
      setExchangeSchedule(originalSchedule.schedule);
    }
  };

  const submitExchange = async (e) => {
    e.preventDefault();

    const exchangeRequests = new Map();
    for (const option of request.options) {
      console.log("current option is: ", option);
      if (selectedOptions.get(option.course_info.acronym)) {
        exchangeRequests.set(
          option.course_info.id,
          {
            courseUnitId: option.course_info.id,
            courseUnitName: option.course_info.name,
            classNameRequesterGoesFrom: option.class_issuer_goes_from.name,
            classNameRequesterGoesTo: option.class_issuer_goes_to.name,
            other_student: {
              name: request.issuer_name,
              mecNumber: request.issuer_nmec
            }
          }
        );
      }
    }

    await exchangeRequestService.submitExchangeRequest(exchangeRequests);
  };

  return (
    <Card
      onMouseOver={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      key={request.id}
      className={`shadow-md ${hiddenRequests.has(request.id) ? "hidden" : ""}`}
    >
      <CardHeader className="flex flex-row gap-x-2 items-center p-4">
        <img
          className="w-10 h-10 rounded-full shadow-md border dark:border-white"
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Tux.svg/1200px-Tux.svg.png"
        />
        <div className="flex flex-row justify-between items-center w-full">
          <div className="flex flex-col w-full">
            <div className="flex flex-row justify-between w-full items-center">
              <CardTitle>{request.issuer_name}</CardTitle>
              <div className="flex flex-row items-center">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button variant="icon" className="text-black" onClick={hide}>
                        <ArchiveBoxIcon className="h-5 w-5" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Esconder</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                {open ? (
                  <Button variant="icon" className="text-black" onClick={() => setOpen(false)}>
                    <ChevronUpIcon className="h-5 w-5" />
                  </Button>
                ) : (
                  <Button variant="icon" className="text-black" onClick={() => setOpen(true)}>
                    <ChevronDownIcon className="h-5 w-5" />
                  </Button>
                )}
              </div>
            </div>
            <CardDescription>
              {open ? (
                <p>{request.issuer_nmec}</p>
              ) : (
                <div className="flex flex-row gap-x-1 gap-y-2 flex-wrap">
                  {request.options?.map((option) => (
                    <RequestCardClassBadge
                      key={option.course_info.acronym}
                      option={option}
                      requestCardHovered={hovered}
                    />
                  ))}
                </div>
              )}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className={`p-0 px-4 ${open ? "" : "hidden"}`}>
        {request.options?.map((option) => (
          <div key={option.course_info.acronym}>
            <Separator className="my-2" />
            <div className="flex flex-row gap-x-4 items-center w-full mb-2">
              <Checkbox
                id={option.course_info.acronym}
                className="flex-grow w-1/12 h-8"
                checked={selectedOptions.get(option.course_info.acronym) || false}
                onCheckedChange={() => handleOptionChange(option.course_info.acronym)}
              />
              <label htmlFor={option.course_info.acronym} className="w-11/12">
                <div className="flex flex-col">
                  <p>
                    {option.course_info.acronym} - {option.course_info.name}
                  </p>
                  <div className="flex flex-row gap-x-2 items-center font-bold">
                    <p>{option.class_issuer_goes_to.name}</p>
                    <ArrowRightIcon className="w-5 h-5" />
                    <p>{option.class_issuer_goes_from.name}</p>
                  </div>
                </div>
              </label>
            </div>
          </div>
        ))}
      </CardContent>
      {open && <Separator className="mb-2" />}
      <CardFooter className={open ? "" : "hidden"}>
        <div className="flex flex-row justify-between w-full items-center">
          <div className="flex flex-row items-center gap-x-2">
            <Checkbox
              id="select-all"
              checked={selectAll}
              onCheckedChange={handleSelectAll}
            />
            <label htmlFor="select-all">Selecionar todas</label>
          </div>
          <form className="flex flex-row gap-2">
            <Button type="submit" onClick={submitExchange}>Propôr troca</Button>
          </form>
        </div>
      </CardFooter>
    </Card>
  );
}
