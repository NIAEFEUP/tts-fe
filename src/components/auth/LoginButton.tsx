import { ArrowLeftEndOnRectangleIcon } from "@heroicons/react/24/outline"
import api from "../../api/backend"
import { Button } from "../ui/button"

type Props = {
  expanded: boolean
}

export const LoginButton = ({ expanded = false }: Props) => {
  return <Button variant={`${expanded ? "default" : "ghost"}`}>
    < a href={`${api.OIDC_LOGIN_URL}`
    } className="flex flex-row gap-1" >
      {expanded && "Entrar"}
      <ArrowLeftEndOnRectangleIcon className="w-5 h-5" />
    </a >
  </Button >

}
