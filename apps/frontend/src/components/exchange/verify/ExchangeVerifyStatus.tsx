import { Ban, Check } from "lucide-react"
import { Button } from "../../ui/button"
import { useNavigate } from "react-router-dom"
import exchangeRequestService from "../../../api/services/exchangeRequestService";
import { toast } from "../../../../src/components/ui/use-toast";


type Props = {
    verified: boolean,
    expired: boolean,
    exchange_id: number
}

/**
 * This component shows to the user if the exchange whether or not the request they intended to
 * verify was indeed so.
 */
export const ExchangeVerifyStatus = ({
    verified, 
    expired,
    exchange_id
}: Props) => {
    const navigate = useNavigate();

    return (<div className="my-auto flex flex-col items-center gap-y-2">
        {verified
            ? <>
                <Check size={100} />
                <div className="flex flex-col gap-y-4 items-center">
                    <p className="w-1/3 text-center">
                        Verificaste com sucesso que aceitas a troca!
                    </p>
                    <Button
                        onClick={() => navigate("/exchange")}
                    >
                        Voltar para os pedidos
                    </Button>
                </div>
            </>
            : <>
                <Ban size={100} />
                <div className="flex flex-col items-center gap-y-2">
                    <p className="w-1/3 text-center">
                        { expired 
                            ? "O token desta troca expirou, revalida a tua troca." 
                            : "O token pode estar incorreto ou as trocas associadas a este pedido\
                            foram invalidadas entretanto por outros pedidos feitos por ti ou pelas\
                            outras pessoas envolvidas no pedido!"
                        }
                    </p>
                    { expired &&
                        <Button
                            onClick={
                                () => {
                                    exchangeRequestService.revalidateExchangeRequest(exchange_id)
                                    toast({
                                        title: 'Troca revalidada',
                                        description: 'Verifica o teu email para verificares a troca.',
                                        duration: 2000,
                                    })
                                }    
                            }
                            
                        >
                            Revalidar a troca
                        </Button>
                    }
                </div>
            </>
        }
    </div>)
}