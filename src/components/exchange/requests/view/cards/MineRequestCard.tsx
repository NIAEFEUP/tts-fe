import { useContext, useState } from "react";
import { MarketplaceRequest } from "../../../../../@types";
import ExchangeRequestCommonContext from "../../../../../contexts/ExchangeRequestCommonContext";
import SessionContext from "../../../../../contexts/SessionContext";
import { Card, CardContent, CardFooter } from "../../../../ui/card"
import { CommonCardHeader } from "./CommonCardHeader";
import { ListRequestChanges } from "./ListRequestChanges";
import { Button } from "../../../../ui/button";
import useCancelMarketplaceExchange from "../../../../../hooks/exchange/useCancelMarketplaceExchange";
import { MoonLoader } from "react-spinners";
import { StudentRequestCardStatus } from "../../../../../utils/requests";

type Props = {
    request: MarketplaceRequest
}

export const MineRequestCard = ({ request }: Props) => {
    const {
        open, setOpen, selectedOptions, setSelectedOptions, setSelectAll, togglePreview,
        setRequestStatus
    } = useContext(ExchangeRequestCommonContext);
    const [hovered, setHovered] = useState<boolean>(false);

    const { trigger: cancelMarketplaceExchange, isMutating: cancelingMarketplaceExchange } = useCancelMarketplaceExchange(request.id);

    const { user } = useContext(SessionContext);

    return <Card
        onMouseOver={() => { setHovered(true) }}
        onMouseLeave={() => { setHovered(false) }}
    >
        <CommonCardHeader
            name={user.name}
            username={user.username}
            request={request}
            hovered={hovered}
            openHook={[open, setOpen]}
            classUserGoesToName={request.type === "marketplaceexchange" ? "class_issuer_goes_to" : "class_participant_goes_to"}
            showRequestStatus={true}
            hideAbility={false}
            hideHandler={() => { }}
        />
        <CardContent>
            {open && (
                <>
                    {request.options.map((option) => (
                        <ListRequestChanges
                            key={request.id}
                            option={option}
                            selectedOptionsHook={[selectedOptions, setSelectedOptions]}
                            setSelectAll={setSelectAll}
                            togglePreview={togglePreview}
                            showChooseCheckbox={false}
                            type={request.type}
                            userWillExchangeTo={option.other_student ? `${option.other_student}`: null}
                        />
                    ))}
                </>
            )}
        </CardContent>
        <CardFooter className={open ? "" : "hidden"}>
            {(!request.canceled && request.accepted) && <Button
                variant="destructive"
                onClick={async () => {
                    await cancelMarketplaceExchange();
                    setRequestStatus(StudentRequestCardStatus.CANCELED)
                }}
            >
                {cancelingMarketplaceExchange
                    ? <MoonLoader size={20} />
                    : "Cancelar"
                }
            </Button>
            }
        </CardFooter>
    </Card>
}
