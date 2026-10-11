import { JSX } from 'react'
import { ENV } from 'varlock/env'

type Props = {
  children: JSX.Element
}

const DevMode = ({ children }: Props) => {
  return !ENV.VITE_APP_PROD ? <>{children}</> : null
}

export default DevMode
