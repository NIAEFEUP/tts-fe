// Dev-only credential check against Sigarra's validation endpoint, used by the
// `POST /sigarra_login/` compatibility shim when federated (OIDC) auth is off.
//
// Sigarra login mechanism (unchanged from the legacy backend):
// successful login yields HTTP 200 + SI_SECURITY and SI_SESSION cookies; a
// failed login yields HTTP 200 + an HTML page with only HTTP_SESSION.

import type { DevAuthenticator } from '@/domain/ports/dev-authenticator'

const SIGARRA_VALIDATION_ENDPOINT = 'https://sigarra.up.pt/feup/pt/vld_validacao.validacao'

export function createSigarraDirectAuth(): DevAuthenticator {
  return {
    async verify(username, password) {
      const params = new URLSearchParams()
      params.append('p_user', username)
      params.append('p_pass', password)

      const response = await fetch(SIGARRA_VALIDATION_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
        body: params,
        redirect: 'manual',
      })

      const rawCookies = response.headers.get('set-cookie') || ''
      return rawCookies.includes('SI_SECURITY')
    },
  }
}
