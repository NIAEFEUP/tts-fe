// The canonical form of an NMEC ("up" number) used as `User.id`.
//
// Sigarra shows it as `up202207150` but the contract stores the bare digits
// (`202207150`). Normalising in one place keeps the seeder, the dev login and
// the OIDC login pointing at the same user row.
export function normalizeNmec(value: string): string {
  return value.trim().replace(/^up/i, '')
}
