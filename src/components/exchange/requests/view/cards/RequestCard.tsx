import { useContext, useState, useEffect } from "react";
import { Button } from "../../../../ui/button";
import { Card, CardContent, CardFooter } from "../../../../ui/card";
import { Checkbox } from "../../../../ui/checkbox";
import { Separator } from "../../../../ui/separator";
import exchangeRequestService from "../../../../../api/services/exchangeRequestService";
import { ListRequestChanges } from "./ListRequestChanges";
import ExchangeRequestCommonContext from "../../../../../contexts/ExchangeRequestCommonContext";
import { CommonCardHeader } from "./CommonCardHeader";
import ConflictsContext from "../../../../../contexts/ConflictsContext";
import { ExchangeOption } from "../../../../../@types";

export const RequestCard = () => {
  const {
    chosenRequest, hiddenRequests, request, open, 
    setOpen, selectedOptions, setSelectedOptions,
    selectAll, setSelectAll, hide, togglePreview
  } = useContext(ExchangeRequestCommonContext);

  const [hovered, setHovered] = useState<boolean>(false);

  const { isConflictSevere } = useContext(ConflictsContext);

  useEffect(() => {
    if (chosenRequest?.id !== request.id) {
      setOpen(false);
    }
  }, [chosenRequest]);

  const handleSelectAll = () => {
    setSelectAll(!selectAll);

    for (const key of selectedOptions.keys()) {
      selectedOptions.set(key, !selectAll);
    }

    const newSelectedOptions = new Map(selectedOptions);
    setSelectedOptions(newSelectedOptions);
    togglePreview(newSelectedOptions);
  };

  const submitExchange = async (e) => {
    e.preventDefault();

    const exchangeRequests = new Map();
    for (const option of request.options) {
      if (selectedOptions.get(option.course_info.acronym)) {
        exchangeRequests.set(
          option.course_info.id,
          {
            courseUnitId: option.course_info.id,
            courseUnitName: option.course_info.name,
            classNameRequesterGoesFrom: (option as ExchangeOption).class_issuer_goes_from.name,
            classNameRequesterGoesTo: (option as ExchangeOption).class_issuer_goes_to.name,
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
        <CommonCardHeader
          name={request.issuer_name}
          username={request.issuer_nmec}
          hovered={hovered}
          request={request}
          openHook={[open, setOpen]}
          showRequestStatus={false}
          hideAbility={false}
          hideHandler={hide}
          classUserGoesToName="class_issuer_goes_from"
        />

        <CardContent className={`p-0 px-4 ${open ? "" : "hidden"}`}>
          {request.options?.map((option) => (
            <ListRequestChanges
              key={"marketplace-request-card" + option.course_info.id}
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
              <Button
                type="submit"
                onClick={!isConflictSevere ? submitExchange : () => { }}
                className={isConflictSevere ? "disabled:bg-red-400" : "success-button hover:bg-white"}
                disabled={isConflictSevere}
              >
                Propôr troca
              </Button>
            </form>
          </div>
        </CardFooter>
      </Card>
    }
  </>;
}
