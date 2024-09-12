import { ArrowLeftEndOnRectangleIcon } from "@heroicons/react/24/outline"
import api from "../../api/backend"
import { Button } from "../ui/button"

export const LoginButton = () => {
  return <Button>
    <a href={`${api.OIDC_LOGIN_URL}`} className="flex flex-row gap-1">
      <p>Entrar</p>
      <ArrowLeftEndOnRectangleIcon className="w-5 h-5" />
    </a>
  </Button>

}
