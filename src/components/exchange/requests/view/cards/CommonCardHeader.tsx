import { ArchiveBoxIcon, ChevronDownIcon, ChevronUpIcon } from "@heroicons/react/24/outline"
import { DirectExchangeRequest, MarketplaceRequest } from "../../../../../@types"
import { Button } from "../../../../ui/button"
import { CardDescription, CardHeader, CardTitle } from "../../../../ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../../../ui/tooltip"
import RequestCardClassBadge from "./RequestCardClassBadge"
import { useContext, useEffect } from "react"
import { StudentRequestCardStatus } from "../../../../../utils/requests"
import { RequestCardStatus } from "./RequestCardStatus"
import ExchangeRequestCommonContext from "../../../../../contexts/ExchangeRequestCommonContext"
import { RequestCardPendingMotive } from "./RequestCardPendingMotive"
import studentInfoService from "../../../../../api/services/studentInfo"

type Props = {
    name: string
    username: string
    hovered: boolean
    request: MarketplaceRequest | DirectExchangeRequest
    openHook: [boolean, React.Dispatch<React.SetStateAction<boolean>>]
    showRequestStatus?: boolean
    hideAbility?: boolean
    hideHandler: () => void
    classUserGoesToName: string,
    showPendingMotive?: boolean
}

export const CommonCardHeader = ({
    name, username, hovered, request, openHook, hideAbility = true, showRequestStatus = false, hideHandler,
    classUserGoesToName, showPendingMotive = false
}: Props) => {
    const [open, setOpen] = openHook;
    const { requestStatus, setRequestStatus } = useContext(ExchangeRequestCommonContext);

    useEffect(() => {
        if (!showRequestStatus) return;

        if (request.canceled) {
            setRequestStatus(StudentRequestCardStatus.CANCELED);
            return;
        }

        setRequestStatus(request.accepted
            ? StudentRequestCardStatus.ACCEPTED
            : StudentRequestCardStatus.PENDING
        );

        if(request.type === "directexchange") {
            (request as DirectExchangeRequest).options = (request as DirectExchangeRequest).options.filter((option) => option.participant_nmec === username);
        }
    }, [request]);


    return <CardHeader
        className="flex flex-row gap-x-2 items-center p-4"
    >
        <img className="w-10 h-10 rounded-full shadow-md" src={studentInfoService.getStudentPictureUrl(username)}></img>
        <div className="flex flex-row justify-between items-center w-full">
            <div className="flex flex-col w-full">
                <div className="flex flex-row justify-between w-full items-center">
                    <CardTitle>{name}</CardTitle>
                    {showRequestStatus &&
                        <div className="flex items-center space-x-2">
                            {showRequestStatus && (
                                <RequestCardStatus
                                    status={requestStatus}
                                />
                            )}
                        </div>
                    }
                    <div className="flex flex-row items-center">
                        {hideAbility &&
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <Button variant="icon" className="text-black dark:text-white" onClick={() => {
                                            hideHandler();
                                        }}>
                                            <ArchiveBoxIcon className="h-5 w-5" />
                                        </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p>Esconder</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        }

                        {open
                            ?
                            <Button variant="icon" className="text-black dark:text-white" onClick={() => setOpen(false)}>
                                <ChevronUpIcon className="h-5 w-5" />
                            </Button>
                            : <Button variant="icon" className="text-black dark:text-white" onClick={() => {
                                setOpen(true);
                            }}>
                                <ChevronDownIcon className="h-5 w-5" />
                            </Button>
                        }
                    </div>
                </div>
                <CardDescription className="flex flex-col gap-y-2">
                    <div>
                        {open
                            ? <p>{username}</p>
                            :
                            <div className="flex flex-row gap-x-1 gap-y-2 flex-wrap">
                                {request.options?.map((option) => {
                                    return (<RequestCardClassBadge
                                        key={option.course_info.acronym}
                                        option={option}
                                        requestCardHovered={hovered}
                                        classUserGoesToName={option[classUserGoesToName].name}
                                    />)
                                })}
                            </div>
                        }
                    </div>
                    <div>
                        {showPendingMotive && <RequestCardPendingMotive
                            request={request as DirectExchangeRequest}
                        />}
                    </div>
                </CardDescription>
            </div>
        </div>
    </CardHeader>

}
