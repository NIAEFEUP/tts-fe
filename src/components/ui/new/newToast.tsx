'use client'

import React from 'react'
import { VariantProps } from 'cva'
import { X } from 'lucide-react'

import { Button } from './newButton'
import { useElementTransition } from '../../../hooks/useElementTransition'
import { cn, cva } from '../../../lib/utils'

const toastVariants = cva({
  base: cn(
    'pointer-events-auto relative flex w-full flex-col gap-1 overflow-hidden rounded-3xl border p-4 shadow-lg transition-all duration-300',
    'bg-background border-border',
    'not-data-[status=open]:translate-y-2 not-data-[status=open]:scale-95 not-data-[status=open]:opacity-0 not-data-[status=open]:duration-150',
  ),
  variants: {
    variant: {
      default: 'bg-background text-foreground',
      destructive: 'bg-red-50 border-red-200 text-red-900 dark:bg-red-950 dark:border-red-900 dark:text-red-100',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
})

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof toastVariants> {
  open?: boolean
  onOpenChange?: (open: boolean) => void
}

const NewToast = React.forwardRef<HTMLDivElement, ToastProps>(({ className, variant, open = true, ...props }, ref) => {
  const { ref: transitionRef, isMounted, status } = useElementTransition<HTMLDivElement>(open)

  if (!isMounted) return null

  return (
    <div
      ref={transitionRef}
      data-status={status}
      role="status"
      aria-live="polite"
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  )
})
NewToast.displayName = 'NewToast'

const NewToastTitle = React.forwardRef<HTMLHeadingElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => <h3 ref={ref} className={cn('text-sm font-semibold', className)} {...props} />,
)
NewToastTitle.displayName = 'NewToastTitle'

const NewToastDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => <p ref={ref} className={cn('text-sm opacity-90', className)} {...props} />,
)
NewToastDescription.displayName = 'NewToastDescription'

const NewToastClose = React.forwardRef<HTMLButtonElement, React.ComponentProps<typeof Button>>(
  ({ className, ...props }, ref) => (
    <Button ref={ref} variant="ghost" size="xs" square className={cn('absolute right-3 top-3', className)} {...props}>
      <X className="h-4 w-4" />
    </Button>
  ),
)
NewToastClose.displayName = 'NewToastClose'

export { NewToast, NewToastTitle, NewToastDescription, NewToastClose }
