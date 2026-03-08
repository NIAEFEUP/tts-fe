import { Avatar, AvatarFallback, AvatarImage } from '../ui/new/avatar'
import { Button } from '../ui/new/newButton'
import { ArrowRightStartOnRectangleIcon } from '@heroicons/react/24/solid'
import { useContext, useState } from 'react'
import { ClipLoader } from 'react-spinners'
import SessionContext from '../../contexts/SessionContext'
import authService from '../../api/services/authService'
import studentInfoService from '../../api/services/studentInfo'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/new/newPopover'
import ScheduleContext from '../../contexts/ScheduleContext'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog'
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
    <Popover placement='bottom-end'>
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
              <ArrowRightStartOnRectangleIcon className="w-5 h-5" />
              {!loggingOut && <span>Sair</span>}
            </Button>
          )}
        </div>
      </PopoverContent>
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
    </Popover>
  )
}
