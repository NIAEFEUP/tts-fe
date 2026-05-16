'use client'

import React, { useEffect } from 'react'
import { VariantProps } from 'cva'
import { X } from 'lucide-react'
import { motion, HTMLMotionProps } from 'motion/react'

import { Button } from './button'
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

// Use HTMLMotionProps to avoid the motion/drag event mismatch
export interface ToastProps
  extends Omit<HTMLMotionProps<'div'>, 'children' | 'style'>, VariantProps<typeof toastVariants> {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  index?: number
  total?: number
  isExpanded?: boolean
  children?: React.ReactNode
  style?: React.CSSProperties
  duration?: number
}

const NewToast = React.forwardRef<HTMLDivElement, ToastProps>(
  (
    {
      className,
      variant,
      open = true,
      index = 0,
      total = 1,
      isExpanded = false,
      onOpenChange,
      children,
      style,
      duration = 5000,
      ...props
    },
    ref,
  ) => {
    useEffect(() => {
      if (open && onOpenChange) {
        const timer = setTimeout(() => {
          onOpenChange(false)
        }, duration)
        return () => clearTimeout(timer)
      }
    }, [open, onOpenChange, duration])

    // Simplified Sonner-inspired stacking logic
    const offset = isExpanded ? index * 80 : index * 10
    const scale = isExpanded ? 1 : 1 - index * 0.05
    const zIndex = 100 - index

    return (
      <motion.div
        ref={ref}
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
        style={{
          ...style,
          pointerEvents: 'auto',
        }}
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
    <Button
      ref={ref}
      variant="ghost"
      size="xs"
      square
      className={cn('absolute right-2 top-2 rounded-xl', className)}
      {...props}
    >
      <X className="h-4 w-4" />
    </Button>
  ),
)
NewToastClose.displayName = 'NewToastClose'

export { NewToast, NewToastTitle, NewToastDescription, NewToastClose }
