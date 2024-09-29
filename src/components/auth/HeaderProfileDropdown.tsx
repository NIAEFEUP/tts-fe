import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator } from "../ui/dropdown-menu"
import useSession from "../../hooks/useSession";
import { Button } from "../ui/button";
import { ChevronRightIcon } from "@heroicons/react/24/solid";
import api from "../../api/backend";

export const HeaderProfileDropdown = () => {
  const { user } = useSession();

  return <DropdownMenu>
    <DropdownMenuTrigger className="w-full">
      <Avatar className="border shadow-sm">
        <AvatarImage src="" />
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
            await fetch(`${api.OIDC_LOGOUT_URL}/`, {
              method: "POST", credentials: "include", headers: {
                "X-CSRFToken": api.getCSRFToken()
              }
            });
          }}
        >
          Sair
          <ChevronRightIcon className="w-5 h-5" />
        </Button>
      </div>
    </DropdownMenuContent>
  </DropdownMenu>
}


