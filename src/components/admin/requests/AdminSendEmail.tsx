import { mailtoStringBuilder } from "../../../utils/mail"
import { Button } from "../../ui/button"

type Props = {
    nmec: string | Array<string>
}

export const AdminSendEmail = ({
    nmec
}: Props) => {
    return <>
        <a href={`${mailtoStringBuilder(nmec)}?subject=Pedido de Inscrição em Turmas&cc=inscricoes.turmas.leic@fe.up.pt&body=Viva,%0D%0A%0D%0AForam alocadas turmas nas UCs indicadas.%0D%0A%0D%0ACmpts,%0D%0ADaniel Silva%0D%0A(pela comissão de inscrição em turmas)`}>
            <Button
                variant="secondary"
            >
                Email
            </Button>
        </a>
    </>
}