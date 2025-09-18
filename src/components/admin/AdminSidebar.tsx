import { Link } from "react-router-dom";import { useNavigate } from "react-router-dom"; 
import { Separator } from "../ui/separator";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton } from "../ui/sidebar";
import { ArrowLeftEndOnRectangleIcon, RectangleGroupIcon, PaperAirplaneIcon, AdjustmentsHorizontalIcon, UsersIcon } from "@heroicons/react/24/outline";
import { useContext, useState } from "react";
import SessionContext from "../../contexts/SessionContext";
import ScheduleContext from "../../contexts/ScheduleContext";
import authService from "../../api/services/authService";
import {CornerDownLeftIcon } from "lucide-react";

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
        <Sidebar className="bg-white h-screen flex flex-col">
            <SidebarHeader className="flex flex-row gap-2 p-4">
                <RectangleGroupIcon className="w-6 h-6" />
                <h1 className="font-bold">Admin</h1>
            </SidebarHeader>
            <Separator />
               {/* Faz o conteúdo expandir para ocupar o espaço restante */}
            <SidebarContent className="flex-1 m-4 overflow-auto">
                <SidebarMenu>
                    <SidebarMenuButton asChild>
                        <Link to="/admin">
                            <PaperAirplaneIcon className="w-6 h-6" />
                            <span>Pedidos</span>
                        </Link>
                    </SidebarMenuButton>
                    <SidebarMenuButton asChild>
                        <Link to="/admin/vacancies">
                            <UsersIcon className="w-6 h-6" />
                            <span>Vagas</span>
                        </Link>
                    </SidebarMenuButton>
                    <SidebarMenuButton asChild>
                        <Link to="/admin/settings">
                            <AdjustmentsHorizontalIcon className="w-6 h-6" />
                            <span>Definições</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter className="mt-auto">
                <SidebarMenuButton asChild>
                    <a href="/planner">
                        <CornerDownLeftIcon className="w-6 h-6" />
                        <span>Planner</span>
                    </a>
                </SidebarMenuButton>
                <SidebarMenuButton asChild>
                    <button
                        type="button"
                        className="w-full flex flex-row gap-2 items-center"
                        onClick={logout}
                        disabled={loggingOut}
                >
                        <ArrowLeftEndOnRectangleIcon className="w-6 h-6" />
                        {loggingOut ? <span>A sair...</span> : <span>Terminar Sessão</span>}
                    </button>
                </SidebarMenuButton>
            </SidebarFooter>
        </Sidebar>
    );
};
