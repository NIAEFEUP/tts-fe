import { InformationCircleIcon } from "@heroicons/react/24/outline"
import { Button } from "../../ui/button"

export const DirectExchangeInfoButton = () => {
    return (
        <Button variant="info" className="w-full">
            <InformationCircleIcon className="h-5 w-5 mr-2"></InformationCircleIcon>
            Como funcionam as trocas diretas?
        </Button>
    )
}
