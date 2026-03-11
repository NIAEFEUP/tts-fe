'use client'

import { useToast } from '../use-toast'
import { NewToast, NewToastClose, NewToastDescription, NewToastTitle } from './newToast'
import { cn } from '../../../lib/utils'

export function NewToaster() {
  const { toasts } = useToast()

  return (
    <div
      className={cn(
        'fixed bottom-0 right-0 z-100 flex max-h-screen w-full flex-col-reverse p-4 md:max-w-[420px] gap-3 pointer-events-none',
      )}
    >
      {toasts.map(function ({ id, title, description, action, open, onOpenChange, ...props }) {
        return (
          <NewToast key={id} open={open} onOpenChange={onOpenChange} {...props}>
            <div className="grid gap-1 pr-4 p-2">
              {title && <NewToastTitle>{title}</NewToastTitle>}
              {description && <NewToastDescription>{description}</NewToastDescription>}
            </div>
            {action}
            <NewToastClose onClick={() => onOpenChange?.(false)} />
          </NewToast>
        )
      })}
    </div>
  )
}
