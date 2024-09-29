import { ArchiveBoxIcon, ArrowDownIcon, ArrowRightIcon, ArrowUpIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { ChevronUpIcon } from "@heroicons/react/24/solid";
import { Dispatch, SetStateAction, useContext, useState, useEffect } from "react";
import { ClassInfo, ExchangeOption, MarketplaceRequest } from "../../../../../@types";
import ScheduleContext from "../../../../../contexts/ScheduleContext";
import { Badge } from "../../../../ui/badge";
import { Button } from "../../../../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../../../ui/card";
import { Checkbox } from "../../../../ui/checkbox";
import { Separator } from "../../../../ui/separator";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../../ui/tooltip";
import RequestCardClassBadge from "./RequestCardClassBadge";
import useSchedule from "../../../../../hooks/useSchedule";
import { previewMap } from "../../../../../contexts/PreviewContext";

type Props = {
  request: MarketplaceRequest;
  hiddenRequests: Set<number>;
  setHiddenRequests: Dispatch<SetStateAction<Set<number>>>;
  chosenRequest: MarketplaceRequest | null; // Only one request can be chosen
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
  const [selectedOptions, setSelectedOptions] = useState<Record<string, boolean>>({});
  const originalSchedule = useSchedule();

  // Hide the request
  const hide = () => {
    const newHidden = new Set(hiddenRequests);
    newHidden.add(request.id);
    setHiddenRequests(newHidden);
  };

  // Handle option change (checkbox click)
  const handleOptionChange = (acronym: string) => {
    console.log("Option change", acronym);

    // If this is not the chosen request, make it the chosen one
    if (chosenRequest?.id !== request.id) {
      setChosenRequest(request); // Set the current request as chosen
    }

    setSelectedOptions(prevState => {
      const updatedOptions = {
        ...prevState,
        [acronym]: !prevState[acronym],
      };

      togglePreview(updatedOptions);
      return updatedOptions;
    });
  };

  // Toggle the preview in the schedule based on selected options
  const togglePreview = (updatedOptions: Record<string, boolean>) => {
    // Filter selected options based on updatedOptions
    const selectedOptions = request.options.filter(option => updatedOptions[option.course_info.acronym] === true);
  
    // If there are selected options, proceed to generate a new exchange schedule
    if (selectedOptions.length > 0) {
      console.log("Previewing exchange schedule with updated options:", updatedOptions);
      
      // Create a new exchange schedule by filtering out original schedule items that match selected options
      const newExchangeSchedule = originalSchedule.schedule.filter(item =>
        !request.options.some(option =>
          updatedOptions[option.course_info.acronym] && item.courseInfo.id === option.course_info.id
        )
      );
      
      console.log("Selected options:", selectedOptions);
      console.log("Request classes:", request.classes);
  
      // Iterate over selected options and find matching classes to add to the new exchange schedule
      selectedOptions.forEach(option => {
        const matchingClass = option.class_issuer_goes_from; // Ensure class_issuer_goes_from is being used correctly
        
        if (matchingClass) {
          console.log("Matching class:", matchingClass);
          
          // Add each slot from the matching class to the new exchange schedule
          matchingClass.slots.forEach(slot => {
            newExchangeSchedule.push({
              courseInfo: option.course_info,
              classInfo: { ...matchingClass, slots: [slot] }, // Add only the current slot
            });
          });
        } else {
          console.warn("No matching class found for option:", option.course_info.acronym);
        }
      });
  
      // Update the exchange schedule state with the new one
      setExchangeSchedule(newExchangeSchedule);
    } else {
      // If no options are selected, revert to the original schedule
      setExchangeSchedule(originalSchedule.schedule);
    }
  };
  

  // Automatically uncheck and remove preview if this is not the chosen request
  useEffect(() => {
    console.log("Chosen request", chosenRequest);
    if (chosenRequest?.id !== request.id) {
      console.log("inside")
      setSelectedOptions({}); // Uncheck all checkboxes
    }
  }, [chosenRequest]);

  return (
    <Card
      onMouseOver={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      key={request.id}
      className={`shadow-md ${hiddenRequests.has(request.id) ? "hidden" : ""}`}
    >
      <CardHeader className="flex flex-row gap-x-2 items-center p-4">
        <img className="w-10 h-10 rounded-full shadow-md" src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/35/Tux.svg/1200px-Tux.svg.png" />
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
              {open ? <p>{request.issuer_nmec}</p> : (
                <div className="flex flex-row gap-x-1 gap-y-2 flex-wrap">
                  {request.options?.map(option => (
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
        {request.options?.map(option => (
          <div key={option.course_info.acronym}>
            <Separator className="my-2" />
            <div className="flex flex-row gap-x-4 items-center w-full mb-2">
              <Checkbox
                id={option.course_info.acronym}
                className="flex-grow w-1/12 h-8"
                checked={selectedOptions[option.course_info.acronym] || false}
                onCheckedChange={() => handleOptionChange(option.course_info.acronym)}
              />
              <label htmlFor={option.course_info.acronym} className="w-11/12">
                <div className="flex flex-col">
                  <p>{option.course_info.acronym} - {option.course_info.name}</p>
                  <div className="flex flex-row gap-x-2 items-center font-bold">
                    <p>{option.class_issuer_goes_from.name}</p>
                    <ArrowRightIcon className="w-5 h-5" />
                    <p>{option.class_issuer_goes_to.name}</p>
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
            <Checkbox id="select-all" />
            <label htmlFor="select-all">Selecionar todas</label>
          </div>
          <div className="flex flex-row gap-2">
            <Button>Propôr troca</Button>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
