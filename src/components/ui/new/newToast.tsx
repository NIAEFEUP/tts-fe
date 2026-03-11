'use client'

import React, { useEffect } from 'react'
import { VariantProps } from 'cva'
import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

import { Button } from './newButton'
import { cn, cva } from '../../../lib/utils'

const toastVariants = cva({
  base: cn(
    'pointer-events-auto absolute top-0 left-0 right-0 flex w-full flex-col gap-1 overflow-hidden rounded-3xl border p-4 shadow-lg',
    'bg-background border-border',
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
  index?: number
  total?: number
  isExpanded?: boolean
}

const NewToast = React.forwardRef<HTMLDivElement, ToastProps>(
  (
    { className, variant, open = true, index = 0, total = 1, isExpanded = false, onOpenChange, children, ...props },
    ref,
  ) => {
    useEffect(() => {
      if (open && onOpenChange) {
        const timer = setTimeout(() => {
          onOpenChange(false)
        }, 5000)
        return () => clearTimeout(timer)
      }
    }, [open, onOpenChange])

    // Sonner stacking logic
    // When expanded, we show them one after another with more space
    // When collapsed, we stack them with 12px offset and scale down
    const offset = isExpanded ? index * 80 : index * 12
    const scale = isExpanded ? 1 : 1 - index * 0.05
    const zIndex = 100 - index

    return (
      <motion.div
        layout
        initial={{ y: -100, opacity: 0 }}
        animate={{
          y: offset,
          scale: scale,
          opacity: 1,
          zIndex: zIndex,
        }}
        exit={{ y: -100, opacity: 0 }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 30,
          mass: 1,
        }}
        className={cn(toastVariants({ variant }), className)}
        {...props}
      >
        {children}
      </motion.div>
    )
  },
)
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
