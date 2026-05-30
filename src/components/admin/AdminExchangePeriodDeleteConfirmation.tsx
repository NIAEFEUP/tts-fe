"use client"
import { Dialog } from "../ui/new/dialog"
import { Button } from "../ui/new/button"

interface DeleteConfirmationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: () => void
}

export const AdminExchangePeriodDeleteConfirmation = ({
  open,
  onOpenChange,
  onConfirm,
}: DeleteConfirmationDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <Dialog.Content>
        <div className="flex flex-col">
          <Dialog.Title>Confirmar Exclusão</Dialog.Title>
          <Dialog.Description className="mt-2">Tem certeza que deseja excluir este período de troca?</Dialog.Description>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="ghost" size="sm" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button variant="destructive" size="sm" onClick={onConfirm}>
            Remover
          </Button>
        </div>
      </Dialog.Content>
    </Dialog>
  )
}
