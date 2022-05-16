import React from 'react'
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
  children: JSX.Element | JSX.Element[] | string | string[]
  type: AlertType
}

const Alert = ({ children, type }: Props) => {
  return (
    <div
      role="alert"
      className={classNames(
        'flex items-center justify-between rounded border-2 px-4 py-2.5',
        type === undefined ? 'border-gray-900/10 bg-gray-50 text-gray-700' : '',
        type === AlertType.info ? 'border-sky-900/10 bg-sky-50 text-sky-700' : '',
        type === AlertType.error ? 'border-rose-900/10 bg-rose-50 text-rose-700' : '',
        type === AlertType.warning ? 'border-amber-900/10 bg-amber-50 text-amber-700' : '',
        type === AlertType.success ? 'border-teal-900/10 bg-teal-50 text-teal-600' : ''
      )}
    >
      <div className="inline-flex space-x-2">
        {type === AlertType.info ? <InformationCircleIcon className="h-6 w-6" /> : null}
        {type === AlertType.warning ? <ExclamationIcon className="h-6 w-6" /> : null}
        {type === AlertType.error ? <ExclamationCircleIcon className="h-6 w-6" /> : null}
        {type === AlertType.success ? <CheckCircleIcon className="h-6 w-6" /> : null}
        <strong className="text-sm font-medium">{children}</strong>
      </div>

      {/* Close */}
      <button className="opacity-90" type="button">
        <span className="sr-only">Close</span>
        <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  )
}

export default Alert
