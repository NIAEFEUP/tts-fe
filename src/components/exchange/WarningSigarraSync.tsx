
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../../components/ui/alert-dialog"
type Props = {
  noChanges: boolean
}


export const WarningSigarraSync = ({ noChanges }: Props) => {
  const [open, setOpen] = useState<boolean>(true);
  function dontShowAgain() {
    setOpen(false);
    localStorage.setItem('hideWarningSigarraSync', 'true');
  }
  const hideWarningSigarraSync = localStorage.getItem('hideWarningSigarraSync');
  return (
    <>
      {noChanges || hideWarningSigarraSync ?
        ""
        :
        <AlertDialog open={open} onOpenChange={setOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Aviso</AlertDialogTitle>
              <AlertDialogDescription>
                O seu horário tem trocas que ainda não foram submetidas no sigarra
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogAction onClick={dontShowAgain} className="bg-white hover:bg-white dark:bg-slate-950 dark:hover:bg-slate-950 text-navy dark:text-slate-100">Don't show this again</AlertDialogAction>
              <AlertDialogAction>Continue</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      }
    </>
  )
}
