import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '../../../utils'

/**
 * //TODO - complete this with colors for each class type
 * This is intended to be use below the schedule to toggle the class type
 */
const classVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-white transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-950 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 dark:ring-offset-slate-950 dark:focus-visible:ring-slate-300',
  {
    variants: {
      classType: {
        t: '',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3',
        lg: 'h-11 rounded-md px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: {
      classType: 't',
      size: 'default',
    },
  }
)

const ClassToggle = () => {
  return (
    <div>
      <h1>ClassToggle</h1>
    </div>
  )
}

export { ClassToggle, classVariants }
