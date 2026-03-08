import { Avatar, AvatarFallback, AvatarImage } from '../ui/new/avatar'
import { Button } from '../ui/new/newButton'
import { LogOut } from 'lucide-react'
import { useContext, useState } from 'react'
import { ClipLoader } from 'react-spinners'
import SessionContext from '../../contexts/SessionContext'
import authService from '../../api/services/authService'
import studentInfoService from '../../api/services/studentInfo'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/new/newPopover'
import ScheduleContext from '../../contexts/ScheduleContext'
import { Dialog, DialogActions, DialogClose, DialogContent, DialogDescription, DialogTitle } from '../ui/new/dialog'
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
      <PopoverTrigger asChild>
        <div className="cursor-pointer w-fit">
          <Avatar className="border shadow-xs">
            <AvatarImage src={studentInfoService.getStudentPictureUrl(user?.username)} />
            <AvatarFallback>{user?.name?.charAt(0) ?? ''}</AvatarFallback>
          </Avatar>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-44 p-4">
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
              {!loggingOut && <span>Sair</span>}
            </Button>
          )}
        </div>
      </PopoverContent>
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="max-w-88 p-5">
          <DialogTitle>Sair</DialogTitle>
          <DialogDescription>Tem a certeza que deseja sair?</DialogDescription>
          <DialogActions className="justify-center">
            <DialogClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={() => {
                setConfirmOpen(false)
                logout()
              }}
            >
              Confirmar
            </Button>
          </DialogActions>
        </DialogContent>
      </Dialog>
    </Popover>
  )
}
