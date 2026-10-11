import { randomBytes } from 'node:crypto'

/** URL-safe random token with `bytes` bytes of entropy (default 32). */
export function randomToken(bytes = 32): string {
  return randomBytes(bytes).toString('base64url')
}
