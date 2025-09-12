import { useContext } from "react"
import SessionContext from "../../../contexts/SessionContext"
import { mailtoStringBuilder } from "../../../utils/mail"
import { Button } from "../../ui/button"

type Props = {
    nmec: string | Array<string>
    subject?: string
    message?: string
    onClick: () => Promise<void>
}

/**
 * This component is so that the admin can send an email to the users without a pre defined subject and body.
 */
export const AdminSendEmail = ({
  nmec,
  subject = "",
  message = "",
  onClick: awaitInfo
}: Props) => {
  const { user } = useContext(SessionContext);

  return <>
    <a
      target="_blank"
      rel="noopener noreferrer"
      href={`${mailtoStringBuilder(nmec)}?subject=${subject}&cc=inscricoes.turmas.leic@fe.up.pt&body=Viva,%0D%0A%0D%0A ${message} %0D%0A%0D%0ACumprimentos,%0D%0A${user.name}%0D%0A(pela comissão de inscrição em turmas)`}
    >
      <Button
        variant="secondary"
        onClick={awaitInfo}
      >
        Email
      </Button>
    </a>
  </>
}
