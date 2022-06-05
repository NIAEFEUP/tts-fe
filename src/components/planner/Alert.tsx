import { ReactNode } from 'react'
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
  return (
    <div
      role="alert"
      className={classNames(
        'flex items-center justify-between rounded border-2 px-2 py-2',
        type === undefined ? 'border-gray-700/20 bg-gray-50 text-gray-700' : '',
        type === AlertType.info ? 'border-sky-700/20 bg-sky-50 text-sky-700' : '',
        type === AlertType.error ? 'animate-wiggle border-rose-700/20 bg-rose-50 text-rose-700' : '',
        type === AlertType.warning ? 'animate-wiggle border-amber-900/10 bg-orange-50 text-orange-700' : '',
        type === AlertType.success ? 'border-teal-700/30 bg-teal-50 text-teal-600' : ''
      )}
    >
      <div className="inline-flex items-center justify-center space-x-2">
        {type === AlertType.info ? <InformationCircleIcon className="h-6 w-6 md:h-5 md:w-5" /> : null}
        {type === AlertType.warning ? <ExclamationIcon className="h-6 w-6 md:h-5 md:w-5" /> : null}
        {type === AlertType.error ? <ExclamationCircleIcon className="h-6 w-6 md:h-5 md:w-5" /> : null}
        {type === AlertType.success ? <CheckCircleIcon className="h-6 w-6 md:h-5 md:w-5" /> : null}
        <strong className="text-xs font-medium md:text-sm">{children}</strong>
      </div>
    </div>
  )
}

export default Alert
