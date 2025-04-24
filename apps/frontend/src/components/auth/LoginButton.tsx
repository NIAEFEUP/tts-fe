import { ArrowLeftEndOnRectangleIcon } from "@heroicons/react/24/outline"
import api from "../../api/backend"
import { Button } from "../ui/button"

const FEDERATED_AUTH = Number(import.meta.env.VITE_FEDERATED_AUTH)

type Props = {
  expanded: boolean
}

const FederatedAuthButton = ({ expanded = false }: Props) => {
  return <Button
    variant={`${expanded ? "default" : "ghost"}`}
  >
    <a href={api.OIDC_LOGIN_URL} className="flex flex-row gap-1" >
      <ArrowLeftEndOnRectangleIcon className="w-5 h-5" />
      {expanded && "Entrar"}
    </a>
  </Button >
}

const SigarraAuthButton = ({ expanded = false }: Props) => {
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()

        await fetch(`${api.BACKEND_URL}/sigarra_login/`, {
          method: "POST", credentials: "include", headers: {
            "X-CSRFToken": api.getCSRFToken(),
          },
        })

        window.location.reload()
      }}
    >
      <Button
        variant={`${expanded ? "default" : "ghost"}`}
      >
        <a className="flex flex-row gap-1" >
          <ArrowLeftEndOnRectangleIcon className="w-5 h-5" />
          {expanded && "Entrar"}
        </a>
      </Button >
    </form>
  )
}

export const LoginButton = ({ expanded = false }: Props) => {
  return (
    <>
      {FEDERATED_AUTH === 1
        ? <FederatedAuthButton expanded={expanded} />
        : <SigarraAuthButton expanded={expanded} />
      }
    </>
  )
}