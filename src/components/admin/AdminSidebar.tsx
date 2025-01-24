
import { Separator } from "../ui/separator"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton } from "../ui/sidebar"
import { ArrowLeftEndOnRectangleIcon, RectangleGroupIcon, PaperAirplaneIcon, AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline"

export const AdminSidebar = () => {
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
                    <SidebarMenuButton asChild>
                        <a href="/admin/settings">
                            <AdjustmentsHorizontalIcon className="w-6 h-6" />
                            <span>Definições</span>
                        </a>
                    </SidebarMenuButton>
                </SidebarMenu>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenuButton asChild>
                    <a href="/admin">
                        <ArrowLeftEndOnRectangleIcon className="w-6 h-6" />
                        <span>Terminar Sessão</span>
                    </a>
                </SidebarMenuButton>
            </SidebarFooter>
        </Sidebar>
    )
}
