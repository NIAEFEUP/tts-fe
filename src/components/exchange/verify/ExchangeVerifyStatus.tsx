import { Ban, Check } from "lucide-react"

type Props = {
    verified: boolean
}

/**
 * This component shows to the user if the exchange whether or not the request they intended to
 * verify was indeed so.
 */
export const ExchangeVerifyStatus = ({
    verified
}: Props) => {
    return (<div className="flex flex-col items-center gap-y-2">
        {verified
            ? <>
                <Check size={100} />
                <p className="w-1/3 text-center">
                    Verificaste com sucesso que aceitas a troca!
                </p>
            </>
            : <>
                <Ban size={100} />
                <p className="w-1/3 text-center">
                    O token pode estar incorreto ou as trocas associadas a este pedido foram invalidadas entretanto por outros
                    pedidos feitos por ti ou pelas outras pessoas envolvidas no pedido!
                </p>
            </>
        }
    </div>)
}