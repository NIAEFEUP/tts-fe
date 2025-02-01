import { useContext, useEffect, useState } from "react";
import { DirectExchangeRequest } from "../../../../../@types"
import ExchangeRequestCommonContext from "../../../../../contexts/ExchangeRequestCommonContext";
import SessionContext from "../../../../../contexts/SessionContext";
import { DirectExchangePendingMotive } from "../../../../../utils/exchange";
import { Button } from "../../../../ui/button";
import { Card, CardContent, CardFooter } from "../../../../ui/card";
import { CommonCardHeader } from "./CommonCardHeader";
import { ListRequestChanges } from "./ListRequestChanges";
import useAcceptDirectExchange from "../../../../../hooks/exchange/useAcceptDirectExchange";
import { MoonLoader } from "react-spinners";
import { exchangeErrorToText } from "../../../../../utils/error";
import { useToast } from "../../../../ui/use-toast";

type Props = {
    request: DirectExchangeRequest
}

export const ReceivedRequestCard = ({
    request
}: Props) => {
    const { open, setOpen, selectedOptions, setSelectedOptions, setSelectAll, togglePreview } = useContext(ExchangeRequestCommonContext);
    const [hovered, setHovered] = useState<boolean>(false);

    const { user } = useContext(SessionContext);

    const { toast } = useToast();

    const { trigger: acceptDirectExchange, isMutating: isAcceptingDirectExchange } = useAcceptDirectExchange(request.id);

    useEffect(() => {
        if (request.type === "directexchange") request.options = request.options.filter((option) => option.participant_nmec === user?.username);
    }, [request]);

    return <>
        {request.type === "directexchange" &&
            <Card
                className="exchange-request-card"
                onMouseOver={() => { setHovered(true) }}
                onMouseLeave={() => { setHovered(false) }}
            >
                <CommonCardHeader
                    name={request.issuer_name}
                    username={request.issuer_nmec}
                    request={request}
                    hovered={hovered}
                    openHook={[open, setOpen]}
                    showRequestStatus={true}
                    hideAbility={false}
                    hideHandler={() => { }}
                    classUserGoesToName="class_participant_goes_to"
                />
                <CardContent>
                    {open && (
                        <>
                            {request.options.map((option) => (
                                <ListRequestChanges
                                    key={option.course_info.id}
                                    option={option}
                                    selectedOptionsHook={[selectedOptions, setSelectedOptions]}
                                    setSelectAll={setSelectAll}
                                    togglePreview={togglePreview}
                                    type={"directexchange"}
                                    showChooseCheckbox={false}
                                />
                            ))}
                        </>
                    )}
                </CardContent>
                <CardFooter className={open ? "" : "hidden"}>
                    <div className="flex flex-row justify-between w-full items-center">
                        <form className="flex flex-row gap-2">
                            {!request.accepted && request.pending_motive === DirectExchangePendingMotive.USER_DID_NOT_ACCEPT &&
                                <Button
                                    type="submit"
                                    className="success-button hover:bg-white"
                                    onClick={async (e) => {
                                        e.preventDefault();

                                        const res = await acceptDirectExchange();
                                        const json = await res.json();

                                        if (res.ok) {
                                            toast({
                                                title: "Troca aceita com sucesso!",
                                                description: "A troca foi aceita com sucesso.",
                                                variant: "default",
                                            });
                                        }
                                        else {
                                            toast({
                                                title: "Erro ao aceitar troca.",
                                                description: exchangeErrorToText[json["error"]],
                                                variant: "destructive",
                                            });
                                        }
                                    }}  
                                >
                                    {isAcceptingDirectExchange 
                                        ? <MoonLoader size={20} />
                                        : <span>Aceitar</span>
                                    }
                                </Button>
                            }
                        </form>
                    </div>

                </CardFooter>
            </Card>}
    </>


}
