import { ReactNode, useMemo } from 'react'
import classNames from 'classnames'
import {
  InformationCircleIcon,
  ExclamationIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
} from '@heroicons/react/outline'

export enum AlertType {
  info,
  error,
  warning,
  success,
}

type Props = {
  children: ReactNode | ReactNode[]
  type: AlertType
}

const Alert = ({ children, type }: Props) => {
  const animationClass = useMemo(() => {
    if (type === AlertType.error) {
      return 'animate-wiggle'
    } else return ''
  }, [type])

  return (
    <div
      role="alert"
      className={classNames(
        animationClass,
        'flex items-center justify-between rounded border-2 px-2 py-2',
        type === undefined ? 'border-gray-700/20 bg-gray-50 text-gray-700' : '',
        type === AlertType.info ? 'border-sky-700/20 bg-sky-50 text-sky-700' : '',
        type === AlertType.error ? 'border-rose-700/20 bg-rose-50 text-rose-800' : '',
        type === AlertType.warning ? 'border-amber-900/10 bg-orange-50 text-orange-700' : '',
        type === AlertType.success ? 'border-teal-700/30 bg-teal-50 text-teal-600' : ''
      )}
    >
      <div className="inline-flex items-center justify-center space-x-2">
        <span>
          {type === AlertType.info && <InformationCircleIcon className="h-6 w-6 md:h-5 md:w-5" />}
          {type === AlertType.warning && <ExclamationIcon className="h-6 w-6 md:h-5 md:w-5" />}
          {type === AlertType.error && <ExclamationCircleIcon className="h-6 w-6 md:h-5 md:w-5" />}
          {type === AlertType.success && <CheckCircleIcon className="h-6 w-6 md:h-5 md:w-5" />}
        </span>
        <strong className="text-xs font-medium md:text-sm">{children}</strong>
      </div>
    </div>
  )
}

export default Alert
