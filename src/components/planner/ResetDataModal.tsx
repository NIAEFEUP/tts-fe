import { AlertDialogHeader, AlertDialogFooter, AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogTitle, AlertDialogDescription, AlertDialogCancel, AlertDialogAction } from '../ui/alert-dialog'

// const dataIsUpdated = async () => {
//   const { info } = await BackendAPI.getInfo()
//   const localInfo = JSON.parse(localStorage.getItem('info'))
//
//   return info.date <= localInfo.date
// }

//TODO(thePeras): Discuss this
const ResetDataModal = () => {
  return (
    <AlertDialog>
      <AlertDialogTrigger />
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Oops!</AlertDialogTitle>
          <AlertDialogDescription>
            Reparámos que a versão de dados que estás a usar está desatualizada. Pretendes atualizar os teus dados?
            <strong>Vais perder todo o teu progresso atual.</strong>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Continuar com os dados atuais</AlertDialogCancel>
          <AlertDialogAction>Atualizar</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export default ResetDataModal
