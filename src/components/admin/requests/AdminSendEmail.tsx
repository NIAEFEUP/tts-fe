import { mailtoStringBuilder } from "../../../utils/mail"
import { Button } from "../../ui/button"

type Props = {
    nmec: string | Array<string>
}

export const AdminSendEmail = ({
    nmec
}: Props) => {
    return <>
        <a href={`${mailtoStringBuilder(nmec)}?subject=Pedido de Inscrição em Turmas&cc=inscricoes.turmas.leic@fe.up.pt&body=Viva, Foram alocadas turmas nas UCs indicadas. Cmpts, Daniel Silva (pela comissão de inscrição em turmas)`}>
            <Button
                variant="secondary"
            >
                Email
            </Button>
        </a>
    </>
}