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
import { ListRequestChanges } from "./ListRequestChanges";
import ExchangeRequestCommonContext from "../../../../../contexts/ExchangeRequestCommonContext";

export const RequestCard = ({ }) => {
  const { exchangeSchedule, setExchangeSchedule } = useContext(ScheduleContext);
  const {
    chosenRequest, hiddenRequests, request, open, setOpen, selectedOptions, setSelectedOptions,
    selectAll, setSelectAll, hide, togglePreview
  } = useContext(ExchangeRequestCommonContext);
  const [hovered, setHovered] = useState<boolean>(false);

  useEffect(() => {
    if (chosenRequest?.id !== request.id) {
      setOpen(false);
    }
  }, [chosenRequest]);

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

  return <>
    {request.type === "marketplaceexchange" &&
      <Card
        onMouseOver={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        key={request.id}
        className={`shadow-md exchange-request-card ${hiddenRequests.has(request.id) ? "hidden" : ""}`}
      >
        <CardHeader className="flex flex-row gap-x-2 items-center p-4">
          <img
            className="w-10 h-10 rounded-full shadow-md"
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
                        classUserGoesToName={option.class_issuer_goes_from.name}
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
            <ListRequestChanges
              option={option}
              selectedOptionsHook={[selectedOptions, setSelectedOptions]}
              setSelectAll={setSelectAll}
              togglePreview={togglePreview}
              type={"marketplaceexchange"}
            />
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
    }
  </>;
}
