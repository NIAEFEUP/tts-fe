import { Avatar } from '../ui/new/avatar'
import { Button } from '../ui/new/button'
import { LogOut } from 'lucide-react'
import { useContext, useState } from 'react'
import { ClipLoader } from 'react-spinners'
import SessionContext from '../../contexts/SessionContext'
import authService from '../../api/services/authService'
import studentInfoService from '../../api/services/studentInfo'
import { Popover } from '../ui/new/popover'
import ScheduleContext from '../../contexts/ScheduleContext'
import { Dialog } from '../ui/new/dialog'
import { Divider } from '../ui/new/divider'

export const HeaderProfileDropdown = () => {
  const [loggingOut, setLoggingOut] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const { user, forceScheduleRevalidation } = useContext(SessionContext)
  const { setExchangeSchedule } = useContext(ScheduleContext)

  const logout = async () => {
    setLoggingOut(true)
    setExchangeSchedule([])
    await authService.logout(user.token, forceScheduleRevalidation, setLoggingOut)
  }

  return (
    <Popover placement="bottom-end">
      <Popover.Trigger asChild>
        <div className="cursor-pointer w-fit">
          <Avatar className="border shadow-xs">
            <Avatar.Image src={studentInfoService.getStudentPictureUrl(user?.username)} />
            <Avatar.Fallback>{user?.name?.charAt(0) ?? ''}</Avatar.Fallback>
          </Avatar>
        </div>
      </Popover.Trigger>
      <Popover.Content className="w-44 p-4">
        <div className="flex flex-col">
          <article className="flex flex-col">
            <p className="text-md font-bold">{user?.name}</p>
            <p className="text-sm">{user?.username}</p>
          </article>
          <Divider className="my-2" />
          {loggingOut ? (
            <ClipLoader className="w-2 h-2 mx-auto" loading={true} aria-label="Loading Spinner" data-testid="loader" />
          ) : (
            <Button variant="destructive" className="w-full" onClick={() => setConfirmOpen(true)}>
              <LogOut size="16" />
              <span>Sair</span>
            </Button>
          )}
        </div>
      </Popover.Content>
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <Dialog.Content className="max-w-88 p-5">
          <Dialog.Title>Sair</Dialog.Title>
          <Dialog.Description>Tem a certeza que deseja sair?</Dialog.Description>
          <Dialog.Actions className="justify-center">
            <Dialog.Close asChild>
              <Button variant="outline">Cancelar</Button>
            </Dialog.Close>
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
    </Popover>
  )
}
