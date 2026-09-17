import * as React from 'react'
import { cn } from '@/lib/utils'

const Card = ({ className, children, ...props }: React.ComponentPropsWithRef<'div'>) => {
  return (
    <div
      className={cn(
        'w-full rounded-3xl border border-border bg-background p-4 shadow-lg',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}

const CardContent = ({ className, children, ...props }: React.ComponentPropsWithRef<'div'>) => {
  return (
    <div className={cn('', className)} {...props}>
      {children}
    </div>
  )
}

const CardTitle = ({ children, className, ...props }: React.ComponentPropsWithRef<'h3'>) => {
  return (
    <h3 className={cn('pb-2 font-semibold', className)} {...props}>
      {children}
    </h3>
  )
}

const CardDescription = ({ children, className, ...props }: React.ComponentPropsWithRef<'p'>) => {
  return (
    <p className={cn('pb-2', className)} {...props}>
      {children}
    </p>
  )
}

const CardActions = ({ className, children, ...props }: React.ComponentPropsWithRef<'div'>) => (
  <div className={cn('flex flex-col gap-2 pt-4 sm:flex-row sm:justify-start', className)} {...props}>
    {children}
  </div>
)

const CompoundCard = Object.assign(Card, {
  Content: CardContent,
  Title: CardTitle,
  Description: CardDescription,
  Actions: CardActions,
})

export { CompoundCard as Card }
