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

export const AdminSendEmail = ({
  nmec,
  subject = "",
  message = "", 
  onClick: awaitInfo
}: Props) => {
  const { user } = useContext(SessionContext);

  const [greeting, ...rest] = message.split('%0D%0A%0D%0A');
  const bodyRest = rest.join('%0D%0A%0D%0A');

  const infoPhrase = "Relativamente ao pedido realizado, será que nos podias enviar mais informação sobre ";

  const mailHref = `${mailtoStringBuilder(nmec)}?subject=${subject}&cc=inscricoes.turmas.leic@fe.up.pt&body=${greeting}%0D%0A%0D%0A${infoPhrase}%0D%0A%0D%0A${bodyRest}%0D%0A%0D%0ACmpts,%0D%0A${user.name}%0D%0A(pela comissão de inscrição em turmas)`;

  return (
    <a
      target="_blank"
      rel="noopener noreferrer"
      href={mailHref}
    >
      <Button
        variant="secondary"
        onClick={awaitInfo}
      >
        Email
      </Button>
    </a>
  )
}