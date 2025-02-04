import { useContext, useState, useEffect } from "react";
import { Button } from "../../../../ui/button";
import { Card, CardContent, CardFooter } from "../../../../ui/card";
import { Checkbox } from "../../../../ui/checkbox";
import { Separator } from "../../../../ui/separator";
import { ListRequestChanges, OptionOrder } from "./ListRequestChanges";
import ExchangeRequestCommonContext from "../../../../../contexts/ExchangeRequestCommonContext";
import { CommonCardHeader } from "./CommonCardHeader";
import ConflictsContext from "../../../../../contexts/ConflictsContext";
import { useToast } from "../../../../ui/use-toast";
import { exchangeErrorToText } from "../../../../../utils/error";
import useMarketplaceAcceptExchange from "../../../../../hooks/useMarketplaceAcceptExchange";
import { MoonLoader } from "react-spinners";

export const RequestCard = () => {
  const {
    chosenRequest, hiddenRequests, request, open, 
    setOpen, selectedOptions, setSelectedOptions,
    selectAll, setSelectAll, hide, togglePreview
  } = useContext(ExchangeRequestCommonContext);

  const [hovered, setHovered] = useState<boolean>(false);

  const { isConflictSevere } = useContext(ConflictsContext);
  const { toast } = useToast();

  const { trigger: requestExchangeProposal, isMutating: isProcessingExchangeProposal} = useMarketplaceAcceptExchange(request, selectedOptions);

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

    try {
      const response = await requestExchangeProposal();
      if (response && response.ok) {
        toast({
          title: "Troca proposta com sucesso!",
          variant: "default",
          description: 'A proposta de troca foi realizada com sucesso. Podes confirmar a troca no email institucional ou na aba "recebidos" da página dos pedidos.'
        });
      }
      else {
        toast({
          title: "Erro ao propor troca.",
          description: exchangeErrorToText[(await response.json())["error"]],
          variant: "destructive",
        });
      }
    }
    catch (error) {
      toast({
        title: "Erro ao propor a troca.",
        description: `Houve um erro desconhecido: ${error.message}`,
        variant: "destructive",
      });
    }
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
              optionOrder={OptionOrder.FROM_TO}
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
                { isProcessingExchangeProposal
                  ? <MoonLoader size={20} />
                  : <p>Propôr troca</p>
                }
              </Button>
            </form>
          </div>
        </CardFooter>
      </Card>
    }
  </>;
}
