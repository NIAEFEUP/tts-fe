'use client'

import React, { useState } from 'react'
import { AnimatePresence } from 'motion/react'
import { useToast } from '../use-toast'
import { NewToast, NewToastClose, NewToastDescription, NewToastTitle } from './newToast'
import { cn } from '../../../lib/utils'

export function NewToaster() {
  const { toasts } = useToast()
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div
      className={cn(
        'fixed top-0 left-1/2 -translate-x-1/2 z-100 flex max-h-screen w-full flex-col p-4 md:max-w-[420px] pointer-events-none h-auto',
      )}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="relative w-full pointer-events-auto group">
        <AnimatePresence mode="popLayout">
          {toasts
            .filter((t) => t.open !== false)
            .map(function ({ id, title, description, action, onOpenChange, position: _position, ...props }, index) {
              return (
                <NewToast
                  key={id}
                  index={index}
                  total={toasts.length}
                  isExpanded={isExpanded}
                  onOpenChange={onOpenChange}
                  {...props}
                >
                  <div className="grid gap-1 pr-8">
                    {title && <NewToastTitle>{title}</NewToastTitle>}
                    {description && <NewToastDescription>{description}</NewToastDescription>}
                  </div>
                  {action}
                  <NewToastClose onClick={() => onOpenChange?.(false)} />
                </NewToast>
              )
            })}
        </AnimatePresence>
      </div>
    </div>
  )
}
