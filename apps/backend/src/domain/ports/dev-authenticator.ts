// Port for the dev-only direct credential check (Sigarra username/password).
// Kept behind a port so the interface layer never imports the infrastructure
// adapter, and so tests can stub it.

export type DevAuthenticator = {
  verify(username: string, password: string): Promise<boolean>
}
