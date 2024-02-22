import { CheckCircleIcon, InformationCircleIcon } from "@heroicons/react/24/outline";
import { Button } from "../ui/button";
import { DirectExchangeSelection } from "./DirectExchangeSelection";

export function DirectExchange() {
    return (
        <div className="flex justify-center flex-col space-y-4 mt-4">
            <Button variant="info" className="w-full"><InformationCircleIcon className="h-5 w-5 mr-2"></InformationCircleIcon>Como funcionam as trocas diretas?</Button>
            <Button variant="submit" className="w-full"><CheckCircleIcon className="h-5 w-5 mr-2"></CheckCircleIcon>Submeter Troca</Button>
            <DirectExchangeSelection UC="Computação Gráfica" Class="3LEIC01"></DirectExchangeSelection>
        </div>
    );
}