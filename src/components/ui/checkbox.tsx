import * as React from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { Check, Minus } from 'lucide-react'

import { cn } from '../../utils'

interface CheckboxProps extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  indeterminate?: boolean
}

const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, indeterminate, checked, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      `focus-visible:ring-slate-950 data-[state=checked]:bg-primary data-[state=checked]:text-white data-[state=indeterminate]:bg-primary data-[state=indeterminate]:text-white dark:data-[state=checked]:bg-slate-50 dark:data-[state=checked]:text-slate-900 dark:data-[state=indeterminate]:bg-slate-50 dark:data-[state=indeterminate]:text-slate-900 dark:ring-offset-slate-950 peer h-5 w-5 shrink-0 rounded-md bg-lightish ring-offset-white transition focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus-visible:ring-slate-300`,
      className
    )}
    checked={indeterminate ? "indeterminate" : checked}
    {...props}
  >
    <CheckboxPrimitive.Indicator className={cn('flex items-center justify-center text-current')}>
      {indeterminate ? <Minus className="h-4 w-4" /> : <Check className="h-4 w-4" />}
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox }
