import { useContext, useState } from "react";
import { MarketplaceRequest } from "../../../../../@types";
import ExchangeRequestCommonContext from "../../../../../contexts/ExchangeRequestCommonContext";
import SessionContext from "../../../../../contexts/SessionContext";
import { Card, CardContent, CardFooter } from "../../../../ui/card"
import { CommonCardHeader } from "./CommonCardHeader";
import { ListRequestChanges } from "./ListRequestChanges";

type Props = {
    request: MarketplaceRequest
}

export const MineRequestCard = ({ request }: Props) => {
    const { open, setOpen, selectedOptions, setSelectedOptions, setSelectAll, togglePreview } = useContext(ExchangeRequestCommonContext);
    const [hovered, setHovered] = useState<boolean>(false);

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
                        />
                    ))}
                </>
            )}
        </CardContent>
        <CardFooter className={open ? "" : "hidden"}>
            {/* <div className="flex flex-row justify-between w-full items-center"> */}
            {/*     <form className="flex flex-row gap-2"> */}
            {/*         {!request.accepted && request.pending_motive === DirectExchangePendingMotive.USER_DID_NOT_ACCEPT && */}
            {/*             <Button */}
            {/*                 type="submit" */}
            {/*                 className="success-button hover:bg-white" */}
            {/*             > */}
            {/*                 Aceitar */}
            {/*             </Button> */}
            {/*         } */}
            {/*     </form> */}
            {/* </div> */}

        </CardFooter>

    </Card>
}
