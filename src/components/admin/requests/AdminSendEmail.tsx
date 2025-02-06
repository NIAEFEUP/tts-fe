import { mailtoStringBuilder } from "../../../utils/mail"
import { Button } from "../../ui/button"

type Props = {
    nmec: string | Array<string>
}

/**
 * This component is so that the admin can send an email to the users without a pre defined subject and body.
 */
export const AdminSendEmail = ({
    nmec
}: Props) => {
    return <>
        <a href={`${mailtoStringBuilder(nmec)}?cc=inscricoes.turmas.leic@fe.up.pt&body=Viva,%0D%0A%0D%0A %0D%0A%0D%0ACmpts,%0D%0ADaniel Silva%0D%0A(pela comissão de inscrição em turmas)`}>
            <Button
                variant="secondary"
            >
                Email
            </Button>
        </a>
    </>
}