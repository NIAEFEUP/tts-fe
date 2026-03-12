'use client'

import { useEffect, useRef } from 'react'
import { VariantProps } from 'cva'

import { composeRefs } from '../../../lib/compose-refs'
import { cva } from '../../../lib/utils'

const checkboxStyle = cva({
  base: [
    'appearance-none relative size-5 shrink-0 outline-none rounded-sm border border-border bg-background shadow-xs enabled:cursor-pointer enabled:not-checked:hover:border-mix-border/8 flex items-center justify-center focus-visible:ring-4 ring-ring transition',
    // checked checkmark
    "before:absolute checked:before:content-['✓'] before:text-white checked:before:text-xs checked:before:font-bold",
    // indeterminate dash
    'indeterminate:before:w-1.5 indeterminate:before:h-0.5 indeterminate:before:bg-white',
    // disabled
    'disabled:cursor-not-allowed disabled:border-foreground/5 disabled:bg-foreground/10 disabled:checked:before:text-foreground/50 disabled:indeterminate:before:bg-foreground/50',
  ],
  variants: {
    variant: {
      accent: [
        'checked:enabled:border-accent checked:enabled:bg-accent checked:enabled:hover:border-mix-accent/8 checked:enabled:hover:mix-with-accent-foreground',
        'indeterminate:enabled:border-accent indeterminate:enabled:bg-accent indeterminate:enabled:hover:border-mix-accent/8 indeterminate:enabled:hover:mix-with-accent-foreground',
        'before:text-accent-foreground',
        'indeterminate:before:bg-accent-foreground',
      ],
      primary: [
        'checked:enabled:border-primary checked:enabled:bg-primary checked:enabled:hover:border-primary/90',
        'indeterminate:enabled:border-primary indeterminate:enabled:bg-primary indeterminate:enabled:hover:border-primary/90',
        'before:text-white',
        'indeterminate:before:bg-white',
      ],
    },
  },
  defaultVariants: {
    variant: 'accent',
  },
})

interface CheckboxProps extends Omit<React.ComponentPropsWithRef<'input'>, 'type'>, VariantProps<typeof checkboxStyle> {
  indeterminate?: boolean
}

const Checkbox = ({ ref, indeterminate, variant, className, ...props }: CheckboxProps) => {
  const internalRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (internalRef.current) {
      internalRef.current.indeterminate = !!indeterminate
    }
  }, [indeterminate])

  return (
    <input
      type="checkbox"
      ref={composeRefs(ref, internalRef)}
      className={checkboxStyle({ variant, className })}
      {...props}
    />
  )
}

export { Checkbox }
