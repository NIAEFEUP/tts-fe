import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuSeparator } from "../ui/dropdown-menu"
import { Button } from "../ui/button";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import api from "../../api/backend";
import { useContext, useState } from "react";
import { ClipLoader } from "react-spinners";
import SessionContext from "../../contexts/SessionContext";

export const HeaderProfileDropdown = () => {
  const [loggingOut, setLoggingOut] = useState(false);

  const { user, setSignedIn } = useContext(SessionContext);

  const logout = async () => {
    setLoggingOut(true);

    fetch(`${api.OIDC_LOGOUT_URL}/`, {
      method: "POST", credentials: "include", headers: {
        "X-CSRFToken": api.getCSRFToken()
      }
    }).then(() => {
      setSignedIn(false);
      setLoggingOut(false);
    }).catch((e) => {
      console.error(e);
    });
  }

  return <DropdownMenu>
    <DropdownMenuTrigger className="w-full">
      <Avatar className="border shadow-sm">
        <AvatarImage src={`${api.BACKEND_URL}/student/${user?.username}/photo`} />
        <AvatarFallback>{user ? user.name.charAt(0) : ""}</AvatarFallback>
      </Avatar>
    </DropdownMenuTrigger>
    <DropdownMenuContent className="p-4 m-4">
      <div className="flex flex-col">
        <article className="flex flex-col">
          <p className="text-md font-bold">{user?.name}</p>
          <p className="text-sm">{user?.username}</p>
        </article>
        <DropdownMenuSeparator className="my-2" />
        <Button
          variant="ghost"
          className="w-full flex flex-row justify-between"
          onClick={async () => {
            await logout();
          }}
        >
          <div>
            <ClipLoader
              className="w-full h-2"
              loading={loggingOut}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </div>
          {!loggingOut && <span>Sair</span>}
          <ChevronRightIcon className="w-5 h-5" />
        </Button>
      </div>
    </DropdownMenuContent>
  </DropdownMenu>
}


