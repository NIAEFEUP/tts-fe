import { JSX } from 'react'
import { ENV } from 'varlock/env'

type Props = {
  children: JSX.Element
}

const StagingMode = ({ children }: Props) => {
  return !ENV.VITE_APP_PROD || ENV.VITE_APP_STAGING ? <>{children}</> : null
}

export default StagingMode
