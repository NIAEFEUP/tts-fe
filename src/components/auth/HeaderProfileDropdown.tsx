import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { DropdownMenuSeparator } from "../ui/dropdown-menu"
import { Button } from "../ui/button";
import { ArrowRightStartOnRectangleIcon } from "@heroicons/react/24/solid";
import { useContext, useState } from "react";
import { ClipLoader } from "react-spinners";
import SessionContext from "../../contexts/SessionContext";
import authService from "../../api/services/authService";
import studentInfoService from "../../api/services/studentInfo";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../ui/hover-card";
import ScheduleContext from "../../contexts/ScheduleContext";

export const HeaderProfileDropdown = () => {
  const [loggingOut, setLoggingOut] = useState(false);

  const { user, forceScheduleRevalidation } = useContext(SessionContext);
  const { setExchangeSchedule } = useContext(ScheduleContext);

  const logout = async () => {
    setLoggingOut(true);
    setExchangeSchedule([]);
    await authService.logout(user.token, forceScheduleRevalidation, setLoggingOut);
  }

  return <HoverCard>
    <HoverCardTrigger className="w-fit">
      <Avatar className="border shadow-sm">
        <AvatarImage src={studentInfoService.getStudentPictureUrl(user?.username)} />
        <AvatarFallback>{user?.name?.charAt(0) ?? ""}</AvatarFallback>
      </Avatar>
    </HoverCardTrigger>
    <HoverCardContent className="w-44 p-4 mx-4">
      <div className="flex flex-col">
        <article className="flex flex-col">
          <p className="text-md font-bold">{user?.name}</p>
          <p className="text-sm">{user?.username}</p>
        </article>
        <DropdownMenuSeparator className="my-2" />
        {loggingOut ?
          <ClipLoader
            className="w-2 h-2 mx-auto"
            loading={true}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
          :
          <Button
            variant="secondary"
            className="w-full flex flex-row justify-center gap-2"
            onClick={logout}
          >
            <ArrowRightStartOnRectangleIcon className="w-5 h-5" />
            {!loggingOut && <span>Sair</span>}
          </Button>
        }

      </div>
    </HoverCardContent>
  </HoverCard>
}


