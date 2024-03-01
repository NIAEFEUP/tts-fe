import { CheckCircleIcon, InformationCircleIcon } from "@heroicons/react/24/outline";
import { Button } from "../ui/button";
import { DirectExchangeSelection } from "./DirectExchangeSelection";

const UCs = [
    { name: "Computação Gráfica", ucClass: "3LEIC01" },
    { name: "Sistemas Paralelos e Distribuídos", ucClass: "3LEIC01" },
    { name: "Compiladores", ucClass: "3LEIC04" },
    { name: "Inteligência Artificial", ucClass: "3LEIC01" },
]

export function DirectExchange() {
    return (
        <div className="flex justify-center flex-col space-y-4 mt-4">
            <Button variant="info" className="w-full"><InformationCircleIcon className="h-5 w-5 mr-2"></InformationCircleIcon>Como funcionam as trocas diretas?</Button>
            <Button variant="submit" className="w-full"><CheckCircleIcon className="h-5 w-5 mr-2"></CheckCircleIcon>Submeter Troca</Button>
            {
                UCs.map((uc) => (
                    <DirectExchangeSelection UC={uc.name} ucClass={uc.ucClass} key={uc.name} />
                ))
            }
        </div>
    );
}
