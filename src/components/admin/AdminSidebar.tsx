import { useNavigate, useLocation } from 'react-router-dom'
import { Separator } from '../ui/separator'
import { useContext, useState } from 'react'
import SessionContext from '../../contexts/SessionContext'
import ScheduleContext from '../../contexts/ScheduleContext'
import authService from '../../api/services/authService'
import { CornerDownLeftIcon, LogOut, PieChartIcon, Group, SendHorizontal, SlidersHorizontal } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../ui/new/button'
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu } from '../ui/sidebar'
import { cn } from '../../lib/utils'
import { Dialog } from '../ui/new/dialog'

export const AdminSidebar = () => {
  const [loggingOut, setLoggingOut] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const { user, forceScheduleRevalidation } = useContext(SessionContext)
  const { setExchangeSchedule } = useContext(ScheduleContext)

  const logout = async () => {
    setLoggingOut(true)
    setExchangeSchedule([])
    await authService.logout(user.token, forceScheduleRevalidation, setLoggingOut)
    navigate('/')
  }

  const menuItems = [
    { to: '/admin', label: 'Pedidos', icon: SendHorizontal },
    { to: '/admin/settings', label: 'Definições', icon: SlidersHorizontal },
    { to: '/admin/statistics', label: 'Estatísticas', icon: PieChartIcon },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <Sidebar className="bg-white h-screen flex flex-col">
      <SidebarHeader className="flex flex-row gap-2 p-4">
        <Group />
        <h1 className="font-bold">Admin</h1>
      </SidebarHeader>
      <Separator />
      <SidebarContent className="flex-1 m-4 overflow-auto">
        <SidebarMenu>
          {menuItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.to)
            return (
              <Button
                key={item.to}
                variant="ghost"
                asChild
                className={cn('w-full justify-start text-sm', active && 'bg-foreground/10')}
              >
                <Link to={item.to} className="flex items-center gap-2">
                  <Icon size={16} />
                  <span>{item.label}</span>
                </Link>
              </Button>
            )
          })}
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
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <Dialog.Content className="w-full max-w-88 p-5">
          <Dialog.Title>Sair</Dialog.Title>
          <Dialog.Description>Tem a certeza que deseja sair?</Dialog.Description>
          <Dialog.Actions className="mt-2 flex justify-center gap-4">
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
          </Dialog.Actions>
        </Dialog.Content>
      </Dialog>
    </Sidebar>
  )
}
