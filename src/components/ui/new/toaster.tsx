import { X } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from 'react'
import { useTopLayer } from '@/hooks/useTopLayer'
import { composeRefs } from '@/lib/compose-refs'
import { cn } from '@/lib/utils'

const PEEK = 8 // px each background toast peeks below the one in front
const SCALE_STEP = 0.05 // scale reduction per stack level
const GAP = 8 // gap between cards when expanded (px)
const MAX_STACK = 3 // max toasts rendered in collapsed stack

const DEFAULT_TOAST_DURATION_MS = 7000

type ToastVariant = 'default' | 'positive' | 'negative'

type Toast = {
  id: string
  title: string
  description?: string
  duration?: number
  variant?: ToastVariant
}

type ToastStore = {
  toasts: Toast[]
  subscribe: (listener: () => void) => () => void
  add: (config: Omit<Toast, 'id'>) => void
  remove: (id: string) => void
  pauseAll: () => void
  resumeAll: () => void
}

const createToastStore = (): ToastStore => {
  let toasts: Toast[] = []
  const listeners = new Set<() => void>()

  const timers = new Map<
    string,
    {
      startTime: number
      remainingTime: number
      timeoutId: ReturnType<typeof setTimeout> | null
    }
  >()

  const getToastId = () => {
    return Date.now().toString() + Math.random().toString(36).slice(2, 9)
  }

  const notifyListeners = () => {
    listeners.forEach((listener) => {
      listener()
    })
  }

  return {
    get toasts() {
      return toasts
    },
    subscribe: (listener) => {
      listeners.add(listener)
      return () => listeners.delete(listener)
    },
    add(toastData) {
      const id = getToastId()
      const newToast = { ...toastData, id }

      toasts = [...toasts, newToast]
      notifyListeners()

      const duration = toastData.duration ?? DEFAULT_TOAST_DURATION_MS

      const timeout = duration !== Infinity ? setTimeout(() => this.remove(id), duration) : null

      timers.set(id, {
        startTime: Date.now(),
        remainingTime: duration,
        timeoutId: timeout,
      })
    },
    remove(id) {
      toasts = toasts.filter((toast) => toast.id !== id)
      notifyListeners()

      const timer = timers.get(id)
      if (timer?.timeoutId) {
        clearTimeout(timer.timeoutId)
      }
      timers.delete(id)
    },
    pauseAll() {
      timers.forEach((timer) => {
        if (timer.timeoutId) {
          clearTimeout(timer.timeoutId)
          timer.timeoutId = null

          const elapsed = Date.now() - timer.startTime
          timer.remainingTime = Math.max(0, timer.remainingTime - elapsed)
        }
      })
    },
    resumeAll() {
      timers.forEach((timer, id) => {
        if (timer.timeoutId === null) {
          if (timer.remainingTime > 0) {
            timer.startTime = Date.now()

            if (timer.remainingTime !== Infinity) {
              timer.timeoutId = setTimeout(() => this.remove(id), timer.remainingTime)
            }
          } else {
            this.remove(id)
          }
        }
      })
    },
  }
}

// Create a singleton toast store that can be shared across the application.
// The store is attached to the global object to ensure it's shared across different modules and components.
//
// The main reason behind this is Astro's island architecture, where different parts of the UI can be rendered and hydrated independently,
// leading to multiple instances of the toast store. In other frameworks, this is not necessary but also doesn't cause any issues.
const STORE_KEY = '__significa_toast_store__'
const toastStore: ToastStore =
  ((globalThis as Record<string, unknown>)[STORE_KEY] as ToastStore) ??
  (() => {
    const store = createToastStore()
    ;(globalThis as Record<string, unknown>)[STORE_KEY] = store
    return store
  })()

// Hook to use the toast store
const useToastStore = () => {
  return useSyncExternalStore(
    toastStore.subscribe,
    () => toastStore.toasts,
    () => toastStore.toasts,
  )
}

const toast = (toast: Omit<Toast, 'id'>) => {
  toastStore.add(toast)
}

const Toaster = ({ className }: { className?: string }) => {
  const toasts = useToastStore()
  const elementRef = useRef<HTMLDivElement>(null)
  const topLayerRef = useTopLayer<HTMLDivElement>(true)
  const [isExpanded, setIsExpanded] = useState(false)
  const [heights, setHeights] = useState<Record<string, number>>({})

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const onModalOpen = () => {
      element?.togglePopover()
      setTimeout(() => element?.togglePopover(), 0)
    }

    window.addEventListener('ui:modal-open', onModalOpen)
    return () => window.removeEventListener('ui:modal-open', onModalOpen)
  }, [])

  const updateHeight = useCallback((id: string, h: number) => {
    setHeights((prev) => (prev[id] === h ? prev : { ...prev, [id]: h }))
  }, [])

  // Newest toast first — it sits on top of the stack
  const ordered = [...toasts].reverse()

  // Derive container height from measured card heights
  const frontH = heights[ordered[0]?.id] ?? 80
  const visibleCount = Math.min(ordered.length, MAX_STACK)
  const collapsedH = ordered.length === 0 ? 0 : frontH + (visibleCount - 1) * PEEK
  const expandedH = ordered.reduce((acc, t, i) => acc + (heights[t.id] ?? 80) + (i > 0 ? GAP : 0), 0)
  const containerH = ordered.length === 0 ? 0 : isExpanded ? expandedH : collapsedH

  // Y position of each toast
  const getY = (index: number) => {
    if (!isExpanded) return index * PEEK
    let y = 0
    for (let i = 0; i < index; i++) {
      y += (heights[ordered[i]?.id] ?? 80) + GAP
    }
    return y
  }

  return (
    <div
      ref={composeRefs(elementRef, topLayerRef)}
      data-toaster-provider
      className={cn(
        'fixed flex size-full flex-col items-center justify-start bg-transparent px-4 pt-4',
        'pointer-events-none',
        className,
      )}
    >
      <motion.div
        className="relative w-full max-w-sm pointer-events-auto"
        animate={{ height: containerH }}
        transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
        onMouseEnter={() => setIsExpanded(true)}
        onMouseLeave={() => setIsExpanded(false)}
      >
        <AnimatePresence>
          {ordered.map((toast, index) => {
            if (!isExpanded && index >= MAX_STACK) return null
            return (
              <ToasterItem
                key={toast.id}
                toast={toast}
                index={index}
                total={toasts.length}
                y={getY(index)}
                scale={isExpanded ? 1 : Math.max(1 - index * SCALE_STEP, 1 - MAX_STACK * SCALE_STEP)}
                isExpanded={isExpanded}
                onDismiss={() => toastStore.remove(toast.id)}
                onHeightChange={(h) => updateHeight(toast.id, h)}
              />
            )
          })}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

type ToasterItemProps = {
  toast: Toast
  index: number
  total: number
  y: number
  scale: number
  isExpanded: boolean
  onDismiss: () => void
  onHeightChange: (h: number) => void
}

const ToasterItem = ({ toast, index, y, scale, isExpanded, onDismiss, onHeightChange }: ToasterItemProps) => {
  const { title, description, variant = 'default' } = toast
  const reduceMotion = useReducedMotion()
  const cardRef = useRef<HTMLDivElement>(null)

  // Measure card height so the container can size itself correctly
  useEffect(() => {
    const el = cardRef.current
    if (!el) return
    const observer = new ResizeObserver(() => {
      onHeightChange(el.offsetHeight)
    })
    observer.observe(el)
    return () => observer.disconnect()
  }, [onHeightChange])

  // Background cards fade slightly in collapsed mode
  const opacity = isExpanded ? 1 : Math.max(1 - index * 0.15, 0.6)

  return (
    <motion.div
      ref={cardRef}
      className={cn(
        'absolute left-0 right-0 flex flex-col gap-1 rounded-3xl border p-4 shadow-lg',
        variant === 'default' && 'bg-background border-border text-foreground',
        variant === 'positive' && 'bg-background border-border text-foreground',
        variant === 'negative' &&
          'bg-red-50 border-red-200 text-red-900 dark:bg-red-950 dark:border-red-900 dark:text-red-100',
      )}
      style={{ zIndex: MAX_STACK + 1 - index }}
      role="status"
      aria-live="polite"
      initial={reduceMotion ? { opacity: 0 } : { y: -60, opacity: 0, scale: 0.9 }}
      animate={{ y, scale, opacity }}
      exit={reduceMotion ? { opacity: 0 } : { y: -60, opacity: 0, scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 400, damping: 30, mass: 1 }}
    >
      <p className="text-sm font-semibold pr-6">{title}</p>
      {description && <p className="text-sm opacity-90">{description}</p>}
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss notification"
        className={cn(
          'absolute right-2 top-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-xl',
          'bg-transparent opacity-70 transition-opacity hover:opacity-100',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
        )}
      >
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  )
}

export { Toaster, toast }
