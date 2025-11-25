import { useNavigate } from "react-router-dom"; 
import { Separator } from "../ui/separator";
import { useContext, useState } from "react";
import SessionContext from "../../contexts/SessionContext";
import ScheduleContext from "../../contexts/ScheduleContext";
import authService from "../../api/services/authService";
import { CornerDownLeftIcon } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../ui/button";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton } from "../ui/sidebar";
import { ArrowRightStartOnRectangleIcon, RectangleGroupIcon, PaperAirplaneIcon, AdjustmentsHorizontalIcon, UsersIcon } from "@heroicons/react/24/outline";

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
            <SidebarContent className="flex-1 m-4 overflow-auto">
                <SidebarMenu>
                    <SidebarMenuButton asChild>
                        <Link to="/admin" className="flex items-center gap-2">
                            <PaperAirplaneIcon className="w-6 h-6" />
                            <span>Pedidos</span>
                        </Link>
                    </SidebarMenuButton>
                    <SidebarMenuButton asChild>
                        <Link to="/admin/vacancies" className="flex items-center gap-2">
                            <UsersIcon className="w-6 h-6" />
                            <span>Vagas</span>
                        </Link>
                    </SidebarMenuButton>

                    <SidebarMenuButton asChild>
                        <Link to="/admin/settings" className="flex items-center gap-2">
                            <AdjustmentsHorizontalIcon className="w-6 h-6" />
                            <span>Definições</span>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter className="mt-auto flex flex-col gap-2">
                <SidebarMenuButton asChild>
                    <a href="/planner" className="flex items-center gap-2">
                        <CornerDownLeftIcon className="w-6 h-6" />
                        <span>Planner</span>
                    </a>
                </SidebarMenuButton>
                <SidebarMenuButton asChild>
                    <Button
                        variant="secondary"
                        className="w-full flex flex-row justify-center gap-2 bg-primary text-white hover:bg-primary/90"
                        onClick={logout}
                        disabled={loggingOut}
                    >
                        <ArrowRightStartOnRectangleIcon className="w-5 h-5 text-white" />
                        {!loggingOut && <span className="text-white">Sair</span>}
                    </Button>
                </SidebarMenuButton>
            </SidebarFooter>
        </Sidebar>
    );
};
