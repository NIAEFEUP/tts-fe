import { Modal } from "./modal"
import { cn } from "../../../lib/utils"

type DialogProps = React.ComponentProps<typeof Modal>

const Dialog = ({ ...props }: DialogProps) => {
  return <Modal {...props} />
}

interface DialogContentProps extends React.ComponentProps<typeof Modal.Content> {
  align?: "center" | "top"
}

const DialogContent = ({ className, children, align = "center", ...props }: DialogContentProps) => {
  return (
    <Modal.Content
      className={cn(
        "bg-background border-border m-auto w-full max-w-md rounded-3xl border p-4 shadow-lg",
        "max-h-[calc(100svh-2rem)] overflow-y-auto",
        "transition-all duration-300 motion-reduce:transition-none",
        "not-data-[status=open]:translate-y-2 not-data-[status=open]:scale-95 not-data-[status=open]:opacity-0 not-data-[status=open]:duration-150",
        align === "top" && "mt-4",
        className,
      )}
      {...props}
    >
      {children}
    </Modal.Content>
  )
}

const DialogTrigger = Modal.Trigger

const DialogClose = Modal.Close

const DialogTitle = ({ children, className, ...props }: React.ComponentProps<typeof Modal.Title>) => {
  return (
    <Modal.Title className={cn("pb-2 font-semibold", className)} {...props}>
      {children}
    </Modal.Title>
  )
}

const DialogDescription = ({ children, className, ...props }: React.ComponentProps<typeof Modal.Description>) => {
  return (
    <Modal.Description className={cn("pb-2", className)} {...props}>
      {children}
    </Modal.Description>
  )
}

const DialogActions = ({ className, children, ...props }: React.ComponentPropsWithRef<"div">) => (
  <div className={cn("flex flex-col gap-2 pt-4 sm:flex-row sm:justify-start", className)} {...props}>
    {children}
  </div>
)

const CompoundDialog = Object.assign(Dialog, {
  Content: DialogContent,
  Title: DialogTitle,
  Description: DialogDescription,
  Actions: DialogActions,
  Trigger: DialogTrigger,
  Close: DialogClose,
})

export { CompoundDialog as Dialog }
export { DialogContent, DialogTitle, DialogDescription, DialogActions, DialogTrigger, DialogClose }
