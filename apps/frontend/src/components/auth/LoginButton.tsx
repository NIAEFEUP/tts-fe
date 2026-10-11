import { ArrowLeftEndOnRectangleIcon } from '@heroicons/react/24/outline'
import api from '../../api/backend'
import { Button } from '../ui/new/button'
import { ENV } from 'varlock/env'

type Props = {
  expanded: boolean
}

const FederatedAuthButton = ({ expanded = false }: Props) => {
  return (
    <Button variant={`${expanded ? 'primary' : 'ghost'}`}>
      <a href={api.OIDC_LOGIN_URL} className="flex flex-row gap-1">
        <ArrowLeftEndOnRectangleIcon className="w-5 h-5" />
        {expanded && 'Entrar'}
      </a>
    </Button>
  )
}

const SigarraAuthButton = ({ expanded = false }: Props) => {
  return (
    <form
      onSubmit={async (e) => {
        e.preventDefault()

        const res = await fetch(api.DEV_LOGIN_URL, {
          method: 'POST',
          credentials: 'include',
        })

        if (res.ok) {
          window.location.reload()
        } else {
          const body = await res.json().catch(() => null)
          console.error(`Dev login failed (${res.status}):`, body?.code ?? res.statusText)
        }
      }}
    >
      <Button variant={`${expanded ? 'primary' : 'ghost'}`} type="submit">
        <ArrowLeftEndOnRectangleIcon className="w-5 h-5" />
        {expanded && 'Entrar'}
      </Button>
    </form>
  )
}

export const LoginButton = ({ expanded = false }: Props) => {
  return (
    <>
      {ENV.VITE_APP_FEDERATED_AUTH ? (
        <FederatedAuthButton expanded={expanded} />
      ) : (
        <SigarraAuthButton expanded={expanded} />
      )}
    </>
  )
}
