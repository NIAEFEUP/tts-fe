import { Children, cloneElement, isValidElement, forwardRef } from 'react'
import { useMergeRefs } from '@floating-ui/react'

import { cn } from '../../../lib/utils'

const isValidSlottableElement = (
  value: unknown,
): value is React.ReactElement<{
  children?: React.ReactNode
  className?: string
  style?: React.CSSProperties
  ref?: React.Ref<any>
}> => {
  return isValidElement(value) && !!value.props && typeof value.props === 'object' && 'key' in value
}

type AnyProps = Record<string, any>

function mergeProps(slotProps: AnyProps, childProps: AnyProps) {
  const result: AnyProps = { ...slotProps }

  for (const key in childProps) {
    const slotPropValue = slotProps[key]
    const childPropValue = childProps[key]

    const isHandler = typeof slotPropValue === 'function' && typeof childPropValue === 'function'
    if (isHandler) {
      result[key] = (...args: any[]) => {
        childPropValue?.(...args)
        slotPropValue?.(...args)
      }
    } else if (childPropValue !== undefined) {
      result[key] = childProps[key]
    }
  }

  return result
}

export const Slot = forwardRef<HTMLElement, React.ComponentPropsWithRef<React.ElementType>>(
  ({ children, ...props }, forwardedRef) => {
    const element = Children.only(children)

    if (isValidSlottableElement(element)) {
      const childRef = (element as any).ref
      const mergedRef = useMergeRefs([childRef, forwardedRef])

      return cloneElement(element, {
        ...mergeProps(props, element.props),
        ref: mergedRef,
      })
    }

    throw new Error('Slot needs a valid react element child')
  },
)

Slot.displayName = 'Slot'

type SlottableProps = {
  asChild: boolean
  child: React.ReactNode
  children: (child: React.ReactNode) => React.ReactElement
}

/**
 * Slottable is required when you want to use a Slot but render more than one child inside (e.g.: a button with the children + a spinner icon)
 *
 * see https://github.com/radix-ui/primitives/issues/1825
 */
export const Slottable = ({ asChild, child, children, ...props }: SlottableProps) => {
  return (
    <>
      {asChild
        ? isValidSlottableElement(child)
          ? cloneElement(child, props, children(child.props.children))
          : null
        : children(child)}
    </>
  )
}
