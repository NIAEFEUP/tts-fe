'use client'

import React, { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence } from 'motion/react'
import { useToast } from '../use-toast'
import { NewToast, NewToastClose, NewToastDescription, NewToastTitle } from './toast'
import { cn } from '../../../lib/utils'

export function NewToaster() {
  const { toasts } = useToast()
  const [isExpanded, setIsExpanded] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  // Filter ONLY active toasts
  const activeToasts = toasts.filter((t) => t.open !== false)

  return createPortal(
    <div
      className={cn(
        'fixed top-0 left-1/2 -translate-x-1/2 z-[9999] flex w-full flex-col items-center pointer-events-none p-4 md:max-w-[420px]',
      )}
    >
      <div
        className="relative w-full h-auto pointer-events-auto min-h-[1px]"
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <AnimatePresence initial={false}>
          {activeToasts.map((toast, index) => (
            <NewToast
              key={toast.id}
              index={index}
              total={activeToasts.length}
              isExpanded={isExpanded}
              onOpenChange={toast.onOpenChange}
              {...toast}
            >
              <div className="grid gap-1 pr-8 text-left">
                {toast.title && <NewToastTitle>{toast.title}</NewToastTitle>}
                {toast.description && <NewToastDescription>{toast.description}</NewToastDescription>}
              </div>
              {toast.action}
              <NewToastClose onClick={() => toast.onOpenChange?.(false)} />
            </NewToast>
          ))}
        </AnimatePresence>
      </div>
    </div>,
    document.body,
  )
}
