import { useNavigate } from "react-router-dom"; 
import { Separator } from "../ui/separator"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton } from "../ui/sidebar"
import { ArrowLeftEndOnRectangleIcon, RectangleGroupIcon, PaperAirplaneIcon } from "@heroicons/react/24/outline"
import { useContext, useState } from "react";
import SessionContext from "../../contexts/SessionContext";
import ScheduleContext from "../../contexts/ScheduleContext";
import authService from "../../api/services/authService";

export const AdminSidebar = () => {
  const [loggingOut, setLoggingOut] = useState(false);
  const navigate = useNavigate(); 

  const { user, setSignedIn } = useContext(SessionContext);
  const { setExchangeSchedule } = useContext(ScheduleContext);

  const logout = async () => {
    setLoggingOut(true);
    setExchangeSchedule([]);
    await authService.logout(user.token, setSignedIn, setLoggingOut);
    navigate("/");
  };

    return (
        <Sidebar className="bg-white">
            <SidebarHeader className="flex flex-row gap-2 p-4">
                <RectangleGroupIcon className="w-6 h-6" />
                <h1 className="font-bold">Admin</h1>
            </SidebarHeader>
            <Separator />
            <SidebarContent className="m-4">
                <SidebarMenu>
                    <SidebarMenuButton asChild>
                        <a href="/admin">
                            <PaperAirplaneIcon className="w-6 h-6" />
                            <span>Pedidos</span>
                        </a>
                    </SidebarMenuButton>
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenuButton asChild>
                    <button
                        type="button"
                        className="w-full flex flex-row justify-center gap-2 items-center"
                        onClick={logout}
                        disabled={loggingOut}
                >
                        <ArrowLeftEndOnRectangleIcon className="w-6 h-6" />
                        {loggingOut ? <span>A sair...</span> : <span>Terminar Sessão</span>}
                    </button>
                </SidebarMenuButton>
            </SidebarFooter>
        </Sidebar>
    )
}
