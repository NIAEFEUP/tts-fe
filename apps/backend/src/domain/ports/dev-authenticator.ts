// Port for the dev-only direct credential check (Sigarra username/password).
// Kept behind a port so the interface layer never imports the infrastructure
// adapter, and so tests can stub it.

export type DevIdentity = {
  /** The student's real name from Sigarra, or `null` if it couldn't be read. */
  name: string | null
}

export type DevAuthenticator = {
  /** Returns the identity on success, or `null` for invalid credentials. */
  authenticate(username: string, password: string): Promise<DevIdentity | null>
}
