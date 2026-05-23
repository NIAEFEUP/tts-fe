import { useNavigate } from "react-router-dom"
import { Separator } from "../ui/separator"
import { useContext, useState } from "react"
import SessionContext from "../../contexts/SessionContext"
import ScheduleContext from "../../contexts/ScheduleContext"
import authService from "../../api/services/authService"
import { CornerDownLeftIcon, LogOut, PieChartIcon, Group, SendHorizontal, SlidersHorizontal } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "../ui/new/button"
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton } from "../ui/sidebar"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog"

export const AdminSidebar = () => {
  const [loggingOut, setLoggingOut] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const navigate = useNavigate()

  const { user, forceScheduleRevalidation } = useContext(SessionContext)
  const { setExchangeSchedule } = useContext(ScheduleContext)

  const logout = async () => {
    setLoggingOut(true)
    setExchangeSchedule([])
    await authService.logout(user.token, forceScheduleRevalidation, setLoggingOut)
    navigate("/")
  }

  return (
    <Sidebar className="bg-white h-screen flex flex-col">
      <SidebarHeader className="flex flex-row gap-2 p-4">
        <Group />
        <h1 className="font-bold">Admin</h1>
      </SidebarHeader>
      <Separator />
      <SidebarContent className="flex-1 m-4 overflow-auto">
        <SidebarMenu>
          <SidebarMenuButton asChild>
            <Link to="/admin" className="flex items-center gap-2">
              <SendHorizontal />
              <span>Pedidos</span>
            </Link>
          </SidebarMenuButton>
          <SidebarMenuButton asChild>
            <Link to="/admin/settings" className="flex items-center gap-2">
              <SlidersHorizontal />
              <span>Definições</span>
            </Link>
          </SidebarMenuButton>
          <SidebarMenuButton asChild>
            <Link to="/admin/statistics" className="flex items-center gap-2">
              <PieChartIcon />
              <span>Estatísticas</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="mt-auto flex flex-col gap-2">
        <Button variant="ghost" asChild>
          <a href="/planner">
            <CornerDownLeftIcon size={16} />
            <span>Planner</span>
          </a>
        </Button>

        <Button variant="destructive" onClick={() => setConfirmOpen(true)} disabled={loggingOut}>
          <LogOut size={16} />
          {!loggingOut && <span>Sair</span>}
        </Button>
      </SidebarFooter>
      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent className="w-full max-w-88 p-5">
          <AlertDialogHeader>
            <AlertDialogTitle>Sair</AlertDialogTitle>
            <AlertDialogDescription>Tem a certeza que deseja sair?</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="mt-2 flex justify-center! gap-4">
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={() => {
                setConfirmOpen(false)
                logout()
              }}
            >
              Confirmar
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Sidebar>
  )
}
