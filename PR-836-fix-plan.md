# PR #836 Review Fix Plan (NIAEFEUP/tts-fe)

Branch: `pedrolunet/sandbox-auth` (on top of current head `c0459ca`).
Goal: address limwa's review (31 inline comments) + CodeRabbit's 3, as **one focused commit per fix**, in an order where every commit compiles and passes tests on its own.

---

## Ground rules for any agent executing this

1. Work in `apps/backend` / `apps/frontend` of this repo. **Do not rebase** unless told.
2. Before running `bun test` in `apps/backend` on a fresh checkout, run `bun run contract:emit` in `apps/backend` — `src/infrastructure/database/contract.json` + `contract.d.ts` are **gitignored artifacts**; tests fail with `Cannot find module './contract.json'` without them. If artifacts are already present, don't regenerate unless schema changed.
3. Every step ends with, in `apps/backend`:
   ```bash
   bun run contract:emit 2>/dev/null || true
   bun test && bun x tsc -b && bun x oxlint
   ```
   (frontend steps: `bun x oxlint` in `apps/frontend`).
4. One step = one commit. Follow existing message style: `type(scope): summary` (lowercase, imperative). Do not push unless told.
5. Steps within a workstream are ordered because they touch the same files — **execute strictly in order**. Workstream B (frontend) is independent of A and can run in parallel.
6. Verified facts are cited per step (they were reproduced by testing on this exact head, `"elysia": "^1.4.30"`).

---

## Execution order

```
Workstream A (backend, sequential):
  A1 delete compat routes            (limwa [0], blocker 1)
  A2 shared AuthUser mapper          (limwa [8])
  A3 atomic User.upsert              (limwa [9], CodeRabbit CR2)
  A4 reuse randomToken               (limwa [10])
  A5 createApp deps injection        (limwa [12])
  A6 drop getSetCookie fallback      (limwa [14])
  A7 SESSION_TTL_DAYS validation     (limwa [13])
  A8 dev-login gate opt-in           (limwa [4], blocker 6)
  A9 remove dead nonce               (limwa [2])
  A10 Elysia cookie config           (limwa [7])
  A11 callback linearize + HttpError (limwa [3], blocker 4)
  A12 mount dev-login conditionally  (limwa [5], blocker 4)
  A13 shared session body helper     (limwa [15])
  A14 auth middleware scoping        (limwa [6], blocker 5)
  A15 resolveReturnTo to core + tests (limwa [16] + suggestion [28])
  A16 loadAuthConfig fixtures + config tests (limwa [17])
  A17 nest OIDC config               (limwa [11])

Workstream B (frontend, sequential, independent):
  B1 useSession fixes                (limwa [19])
  B2 role badge map                  (limwa [20]) — depends on B1
  B3 FEDERATED_AUTH default          (limwa [23])

Workstream S (second pass, after all of A):
  S1 one sign-in path / unified session flow (limwa [1], blocker 2)

Workstream D (review housekeeping, no code):
  D1 replies on the PR + PR description update + follow-up issues
```

Why this order:
- **A1 first**: deleting the compat shim removes the second copy of dev-login, the second middleware mount and 2 more body shapes, so later route commits have a smaller surface.
- **A2–A6** are small, isolated backend fixes that unblock clean mechanics.
- **A8 before A16**: config tests/fixture rewrite assumes the new opt-in gate.
- **A10 before A11**: the callback rewrite builds on the cookie config change.
- **A16 before A17**: fixtures switch to `loadAuthConfig`, so the config shape change in A17 doesn't touch 15-field literals anymore.
- **S1 last**: biggest refactor; it re-writes files A3/A9 touched.

---

## Workstream A — Backend

### A1 · Delete legacy compat routes
- **Refs**: limwa [0] (verified: frontend has zero references to `/auth/info/`, `/sigarra_login/`, `/oidc-auth/*`).
- **Do**:
  - Delete `apps/backend/src/interface/routes/auth/auth-compat.routes.ts`
  - Delete `apps/backend/src/interface/routes/auth/auth-compat.routes.test.ts`
  - Delete `apps/backend/src/application/use-cases/auth/get-current-user.ts`
  - `apps/backend/src/main.ts`: remove `authCompatRoutes` import + `.use(authCompatRoutes(...))`
  - `apps/backend/docs/endpoints.md`: remove rows L97–100 and L559–561 + 575 (compat rows); adjust text that says "Replaces legacy `GET /auth/info/`".
- **Gotcha**: legacy Django backend still serves the old paths — deleting here removes only the unused shim.
- **Commit**: `refactor(backend): delete legacy auth compat routes`

### A2 · Share one AuthUser mapper, drop the role cast
- **Refs**: limwa [8] (verified: generated contract types `role` as `'USER' | 'ADMIN' | 'SUPERUSER'`; assignment to `UserRole` compiles with **no cast**).
- **Do**:
  - Create `src/infrastructure/database/repositories/auth-user.mapper.ts`: `toAuthUser(row: { id: string; name: string; email: string | null; role: 'USER' | 'ADMIN' | 'SUPERUSER' })` — return `{ id, name, email, role }` **without cast**.
  - Delete the duplicated `UserRow` + local `toAuthUser` from both `user.repository.ts` and `session.repository.ts`; import the shared mapper.
- **Gotcha**: keep `role: string` out of the codebase — that widening was the bug manufacturing the cast.
- **Commit**: `refactor(backend): type user rows from the prisma contract`

### A3 · Atomic user upsert
- **Refs**: limwa [9], CodeRabbit CR2 (race: two concurrent first logins → 2nd create hits PK violation → 500 for a valid login).
- **Do**: replace `upsertFromClaims` body in `user.repository.ts` with a single statement:
  ```ts
  const row = await db.orm.public.User.upsert({
    create: { id: claims.nmec, name: claims.name, email: claims.email },
    update: { name: claims.name, email: claims.email },
  })
  return toAuthUser(row)
  ```
  (Verified to typecheck against the generated contract.)
- **Gotcha**: `dev-login.ts` L36–43 still does its own `findById` + conditional write — leave that alone here; **S1** unifies it.
- **Commit**: `fix(backend): make user upsert atomic`

### A4 · Reuse `randomToken`
- **Refs**: limwa [10].
- **Do**: `session.repository.ts` — replace `randomBytes(32).toString('base64url')` with `randomToken()` from `@/core/utils/crypto`; drop the `randomBytes` import. (Keep `createHash` import for `hashToken`.)
- **Commit**: `refactor(backend): reuse randomToken for session tokens`

### A5 · Inject repositories into `createApp`
- **Refs**: limwa [12] (verified: importing `main.ts` without gitignored `contract.json` fails → clean-checkout `bun test` currently cannot run).
- **Do**:
  - `main.ts`: remove module-level `import { db }` + repo construction. New shape:
    ```ts
    type AppDeps = { users: UserRepository; sessions: SessionRepository; provider: IdentityProvider; sigarraDirect: DevAuthenticator; config?: AuthConfig }
    export function createApp(deps?: AppDeps)
    ```
    with a `defaultDeps()` function doing `const db = postgres<...>`-equivalent current wiring (build repos + provider from `loadAuthConfig()`). Callers (the `isMain` entry block) keep using defaults.
  - `main.test.ts`: pass stub repos (in-memory, like `auth.routes.test.ts`'s fakes) and a `loadAuthConfig({})` config so the test never touches contract artifacts.
- **Gotcha**: keep the module-level singleton out of `main.ts`; nothing else may import `db` from `prisma.ts` in the interface layer (clean-architecture lint rule).
- **Commit**: `refactor(backend): inject repositories into createApp`

### A6 · Call `response.headers.getSetCookie()` directly
- **Refs**: limwa [14] (verified: fallback path never runs on Node ≥18.14/Bun, and if it did, `toCookieHeader` keeps only the first cookie segment → `SI_SECURITY` detection would break on multi-cookie responses).
- **Do**: in `sigarra-direct-auth.ts` — delete `readSetCookies`, replace call site with `response.headers.getSetCookie()`.
- **Commit**: `refactor(backend): drop dead getSetCookie fallback`

### A7 · Fail loudly on bad `SESSION_TTL_DAYS`
- **Refs**: limwa [13] (verified: `SESSION_TTL_DAYS=abc` → `sessionTtlSeconds: NaN`, silently, at boot).
- **Do**:
  - `core/config/auth.ts`: add a `readInt(env, key, fallback)` that parses and `throw`s a clear `Error` (message: `` `${key} must be an integer` ``) when `Number.isNaN`.
  - Use it for `SESSION_TTL_DAYS` only (others are strings).
  - `apps/backend/.env.schema`: add `@type=number`… follow existing conventions for a number type with a minimum; varlock then rejects bad values too.
- **Commit**: `fix(backend): validate SESSION_TTL_DAYS at boot`

### A8 · Make dev-login opt-in (security)
- **Refs**: limwa [4] (verified: `{}` → enabled, `NODE_ENV=staging` → enabled; start script is `varlock run -- tsx`, nothing sets `NODE_ENV`).
- **Do**:
  - `core/config/auth.ts`: `devLoginEnabled: env.DEV_LOGIN_ENABLED === 'true' && env.NODE_ENV !== 'production'` (opt-in `=== 'true'`, keep the production veto as defense in depth, update comment).
  - `.env.schema`: `DEV_LOGIN_ENABLED=false` default + comment (local `.env` opts in); keep `SIGARRA_USERNAME/PASSWORD` as-is.
  - Update `docs/endpoints.md`'s dev-login mentions to reflect the new gate semantics.
- **Gotcha**: after this, local dev needs `DEV_LOGIN_ENABLED=true` in `.env` — say so in the docs text.
- **Commit**: `fix(backend): make dev login opt-in`

### A9 · Remove the dead nonce
- **Refs**: limwa [2] + Pedro-own reply [24] (verified: nonce is generated, sent, cookied, **never verified**; claims come from userinfo, no ID-token handling).
- **Do**:
  - `domain/ports/identity-provider.ts`: remove `nonce` from `AuthorizationParams`.
  - `sigarra-oidc.provider.ts`: remove `url.searchParams.set('nonce', …)`.
  - `application/use-cases/auth/begin-login.ts`: drop `nonce` from `BeginLoginResult` and generation (`randomToken(16)` for state only); update the doc comment.
  - `auth.utils.ts`: delete `NONCE_COOKIE`.
  - `auth.routes.ts`: remove the nonce cookie set (L72–73) and from `clearTransient()` (L90).
  - Tests: `auth.routes.test.ts` provider fixture builds the URL from `{ state, nonce }` → drop nonce.
- **Note for reviewer reply**: nonce validated properly = ID-token validation (JWKS) — recorded as follow-up, not this PR.
- **Commit**: `refactor(backend): remove unused oidc nonce`

### A10 · Use Elysia's cookie config instead of `applyCookiePreferences`
- **Refs**: limwa [7] (agent verified identical Set-Cookie header; matches Elysia 1.4.30 docs).
- **Do**:
  - `auth.routes.ts`: `new Elysia({ prefix, cookie: { httpOnly: true, sameSite: 'lax', path: '/', secure: config.secureCookies } })`. On the two `session` writes keep only the per-call `maxAge` (`cookie.session.maxAge = config.sessionTtlSeconds`).
  - Add `t.Cookie` schemas so reads are typed (removes every `as string | undefined` cast):
    - `/callback`: `t.Cookie({ session: t.Optional(t.String()), oidc_state: t.Optional(t.String()), oidc_return_to: t.Optional(t.String()) })`
    - `/dev-login`, `/logout`: `t.Cookie({ session: t.Optional(t.String()) })`
  - `auth.utils.ts`: delete `MutableCookie` + `applyCookiePreferences`; keep the name constants.
- **Gotcha**: `auth.routes.test.ts` has cookie-assertion helpers (`cookieValue`, `getSetCookie`) — run the suite; transient cookies in `/login` keep their short `maxAge = TRANSIENT_COOKIE_TTL_SECONDS`.
- **Commit**: `refactor(backend): use elysia cookie config for auth cookies`

### A11 · Linearize the callback, use the error pipeline
- **Refs**: limwa [3] (verified: repo has `HttpError`/`httpError` + global `errorHandler` that logs 5xx and never leaks the message; `clearTransient()` runs 3×).
- **Do** in `auth.routes.ts` `/callback`:
  - Read `state`/`return_to` into locals, `remove()` all transient cookies **once up front**, then run a linear flow (no try/catch needed after):
  - Replace hand-built bodies with thrown errors (codes preserved on the wire):
    - not configured → `new HttpError('oidc-not-configured', …, 503)`
    - `query.error` → `new HttpError('oidc-auth-error', …, 401)`
    - missing code → `new HttpError('oidc-missing-code', …, 400)`
    - state mismatch → `new HttpError('oidc-state-mismatch', …, 400)` (keep `InvalidOidcStateError` from the use case and translate in a tiny `catch`, or throw it directly and add an `instanceof` branch in `error-handler.ts` — errors.ts header comment prescribes the latter; prefer mapping it to `httpError.badRequest('Invalid OIDC state')` in the route to stay minimal)
    - exchange failure → `new HttpError('oidc-callback-failed', …, 502)`; the global handler already logs 5xx and hides the message → delete the route's `console.error`.
- **Gotcha**: after A10, cookie reads are typed; assert the test suite — error bodies must stay `{ error, code }` identical so frontend copy keeps working.
- **Commit**: `refactor(backend): linearize oidc callback with HttpError`

### A12 · Mount dev-login conditionally
- **Refs**: limwa [5].
- **Do**:
  - Extract `/dev-login` into `devLoginRoutes(deps)` plugin (own `Elysia({ prefix: '/api/v1/auth' })`… actually keep it prefixless and register path `/api/v1/auth/dev-login`, or nest — pick whichever keeps `/me`, `/logout` untouched).
  - In the main auth plugin: `.use(config.devLoginEnabled ? devLoginRoutes(deps) : new Elysia())`.
  - Delete the in-handler `if (!config.devLoginEnabled)` guard + bespoke 404 body (global handler answers 404 `not-found`).
  - Fold the `not-configured` / `invalid-credentials` branches from `DevLoginResult.reason` into `HttpError`s (503 / 401) inside the route, per A11 style.
- **Gotcha**: adjust tests: with the disabled plugin mounted, the dev-login 404 test now expects the **global** 404 body (`Route not found`, code `not-found`).
- **Commit**: `refactor(backend): mount dev login conditionally`

### A13 · Share the user response body
- **Refs**: limwa [15] (compat routes gone by now, so only 2 sites remain).
- **Do**: `auth.routes.ts` — extract `toSessionBody(user)` used by `/me`, `/dev-login`; keep exact wire shape (`signed, id, name, email, isAdmin, role`). Optional: declare `response` schemas per route (cf. `apiError` in `error-handler.ts`).
- **Commit**: `refactor(backend): share session user response shape`

### A14 · Scope the auth middleware, fix import direction, use `sessionToken` in logout
- **Refs**: limwa [6] — **verified facts**:
  1. `derive({ as: 'global' })` runs the session lookup for every route mounted *after* the plugin (≤1 DB hit per request for routes registered later, e.g. `/`, once cookies exist). Reproduced: 0 calls on a route before the plugin, 1 call on a route after.
  2. Fixed plugin `name: 'auth/session'` + injected resolver → a second `.use()` with a different resolver is silently dropped by Elysia's name dedupe. Reproduced: resolver A ran, resolver B never.
- **Do**:
  - `auth.middleware.ts`: drop `name`; change to scoped derive (i.e., no `{ as: 'global' }` — default scope).
  - Only one plugin is mounted today (compat gone since A1) — ensure no second mount remains.
  - Move `SESSION_COOKIE` / `STATE_COOKIE` / `RETURN_TO_COOKIE` / `TRANSIENT_COOKIE_TTL_SECONDS` to a new `src/core/auth/cookies.ts` (middleware must not depend on `routes/`); update imports in `auth.utils.ts` (or fold `auth.utils.ts` away entirely).
  - `/logout` uses `sessionToken` from the derive instead of re-reading `cookie.session.value` (still `cookie.session.remove()` to clear). After A10 it's typed, so no cast.
- **Refinement note**: even scoped, the derive runs for `/login` `/callback` `/dev-login` too (same instance) — they ignore `user`. Acceptable for now; a per-route-group mount or macro is the later refinement if the extra no-op bothers us.
- **Commit**: `refactor(backend): scope auth middleware and move cookie constants`

### A15 · Move `resolveReturnTo` to core + direct tests (+ suggestion)
- **Refs**: limwa [16] + suggestion [28] (verified: helper lives in `begin-login.ts`, imported by `complete-login.ts`; zero direct tests; route tests only cover the same-origin default).
- **Do**:
  - New `src/core/auth/return-to.ts` with the function; delete from `begin-login.ts`/`complete-login.ts` imports → import from core.
  - Take limwa's simplification: body becomes
    ```ts
    const target = new URL(returnTo ?? '/', frontendUrl)
    return target.origin === new URL(frontendUrl).origin ? target.toString() : fallback
    ```
    (absolute-foreign URLs and `//evil.com` are caught by the origin check; bare relative strings like `exchange` now resolve to same origin — intended).
  - New `src/core/auth/return-to.test.ts` cases: foreign origin, `//evil.com`, `/relative`, bare relative, `javascript:`, malformed URL, `http://localhost:3100@evil.com`.
  - Comment in `complete-login.ts`: the application here is authoritative (`oidc_return_to` cookie is client-controlled); `beginLogin` keeps sanitizing too (harmless), note why.
- **Commit**: `refactor(backend): move resolveReturnTo to core with tests`

### A16 · Real config as test fixture + `loadAuthConfig` tests
- **Refs**: limwa [17] (verified: 15-field literals duplicated in `auth.routes.test.ts` + would-be duplicated again; no direct coverage of `loadAuthConfig`).
- **Do**:
  - Refactor both test builds to construct deps + `loadAuthConfig({ DEV_LOGIN_ENABLED: 'true', FRONTEND_URL: '…', … })` (explicit env keys; A8's gate makes `DEV_LOGIN_ENABLED` required for dev-login tests).
  - New `src/core/config/auth.test.ts`: gate on/off (`unset`, `staging`, `production`, explicit), `SESSION_TTL_DAYS` non-number throws (A7), default fallbacks.
- **Gotcha**: don't assert on varlock behavior — pure function tests on `loadAuthConfig(env)` only.
- **Commit**: `test(backend): exercise loadAuthConfig in fixtures and tests`

### A17 · Nest OIDC config
- **Refs**: limwa [11].
- **Do**:
  - `AuthConfig.oidc = { clientId, clientSecret, redirectUri, authorizeEndpoint, tokenEndpoint, userinfoEndpoint, scopes }` (+ existing flat fields removed); optionally also `config.session = { ttlSeconds, secureCookies }` and `config.devLogin = { enabled, account }` if it falls out cheaply — otherwise keep flat for the rest and only nest oidc.
  - `main.ts` (post-A5 `defaultDeps`): `createSigarraOidcProvider(config.oidc)`.
  - Update `auth.routes.ts` uses (`config.oidc.*/frontendUrl`), A16 fixtures, and `sigarra-oidc.provider.ts` type stays as the slice type.
- **Commit**: `refactor(backend): nest oidc config inside AuthConfig`

---

## Workstream B — Frontend (independent, can run while A proceeds)

### B1 · `useSession` fixes
- **Refs**: limwa [19] (all four points verified) + limwa's own follow-up [26] "shouldn't this take an AbortSignal?".
- **Do** in `apps/frontend/src/hooks/useSession.tsx`:
  1. Remove `try/catch → anonymous`: let the fetch rejection propagate so SWR owns the error state (transient failures are no longer rendered as "signed out", and focus revalidation isn't throttled as if successful). Keep `console.error` optional.
  2. `role: data.role` (backend always sends it; drop `?? (data.isAdmin ? 'ADMIN' : 'USER')`).
  3. Hoist `ANONYMOUS` to a module constant.
  4. Type the context: `SessionContext.user: SessionUser | null` in `contexts/SessionContext.(ts|tsx)` (check current definition — `user: any`); keeps `HeaderProfileDropdown` cast removable in B2.
  5. AbortSignal: SWR 2.x fetchers receive only `key` by default; signal plumbing is a `useSWR` middleware concern — out of scope here, note in comment or PR reply.
- **Commit**: `fix(frontend): surface session errors and type useSession`

### B2 · Key the role badge map by role
- **Refs**: limwa [20]. Depends on B1 item 4.
- **Do** in `HeaderProfileDropdown.tsx`:
  ```tsx
  const ROLE_BADGES: Partial<Record<UserRole, { label: string; variant: 'success' | 'info' }>> = {
    ADMIN: { label: 'Admin', variant: 'success' },
    SUPERUSER: { label: 'Superuser', variant: 'info' },
  }
  const roleBadge = user && ROLE_BADGES[user.role]
  ```
  Drop the `user.role !== 'USER'` test and the `as keyof typeof` cast; import `UserRole`.
- **Gotcha**: `Badge.variant` typing — check the prop accepts the union; if it's a literal union from the badge component, rely on inference.
- **Commit**: `refactor(frontend): key role badges by UserRole`

### B3 · Restore `VITE_APP_FEDERATED_AUTH` default to `true`
- **Refs**: limwa [23] (verified: current committed default is dev-friendly `false`; prod builds that don't set it explicitly ship the username/password login UI — backend refuses `/dev-login` in prod, so the failure mode would be a broken login button rather than a hole).
- **Do**: `.env.schema` → `VITE_APP_FEDERATED_AUTH=true` with a comment: local dev overrides to false in `.env` (preserves production-safe defaults).
- **Commit**: `fix(frontend): default federated auth to true`

---

## Workstream S — Second pass (after A is fully merged/committed)

### S1 · One sign-in path (limwa [1], blocker 2)
Goal: `completeLogin` and `devLogin` share "upsert user → issue session".
- New `src/core/auth/profile.ts`: `type UserProfile = { id: string; name: string; email: string | null }` (collapse `OidcUserClaims` + `DevIdentity`).
- Ports: `IdentityProvider.exchangeCodeForUser(code): Promise<UserProfile>`; `DevAuthenticator.authenticate(u, p): Promise<UserProfile | null>`.
- `UserRepository.upsert(profile)`: one atomic `upsert` (A3 already instantiated this); semantics: update only provided (non-null) name/email → "keep seeded name when Sigarra gives none" lives in the adapter/repository, not a bespoke branch in dev-login; the `${username}@fe.up.pt` invented email disappears (email null unless IdP supplies it).
- New `application/use-cases/auth/start-session.ts`: `startSession(profile)` = `users.upsert(profile)` + `sessions.issue(user.id, ttl)`; `completeLogin` and `devLogin` both call it (loses the duplicated `sessionTtlSeconds * 1000` conversions — each use case gets `ttlMs` in its deps).
- `main.ts`/routes wiring updated; tests updated.
- **Commit**: `refactor(backend): unify login flows behind startSession`

---

## Workstream D — Review housekeeping (no code)

### D1
- **Reply to limwa [30]** ("why was tsconfig needed?") with the verified answer: `tsc -b` passes without it (paths exist in `tsconfig.lib.json`), but **`bun test` fails** — Bun resolves `@/*` via the package-root `tsconfig.json`; removing the block breaks 3 test files with module-resolution errors.
- **PR description**: add notes — port flip `local.json 8100→3000` is intentional for this migration branch (closes [22] properly, without code churn); scope = full auth system on a long-lived experimental branch; Sentry fix ([21]/[25]) rides along, fine per limwa.
- **Follow-up issues** (new, one issue each or batched):
  1. Validate the OIDC ID token (JWKS + `nonce` claim) — supersedes A9's removed nonce ([2]/[24]).
  2. CSRF posture for new backend POST routes (`/logout`, `/dev-login`) + remove dead `getCSRFToken()` senders in FE services (`exchangeRequestService`, `studentScheduleRequestService`, `courseUnitEnrollmentService`, `MineRequestCard`, `backend.ts` definition) — verified dillemma: `/csrf/` preflight removed in `App.tsx`, so those headers send `undefined` today.
  3. varlock `ENV` adoption in backend (already cataloged as #839 — just link [29]).
  4. Session model consolidation (hashed tokens) — the PR description's own follow-up + limwa's closing "keep hand-rolling vs package?" question.
  5. Middleware refinement: per-group mounting / macro so login/callback don't pay the derive (see A14 refinement note).

---

## Review-comment → commit map (for PR replies)

| Comment (id) | Fixed in |
|---|---|
| [0] delete compat (4243765163) | A1 |
| [8] cast (4243765188) | A2 |
| [9] upsert (4243765193) + CR2 (4237786294) | A3 |
| [10] randomToken (4243765197) | A4 |
| [12] createApp (4243765203) | A5 |
| [14] getSetCookie (4243765211) | A6 |
| [13] TTL NaN (4243765207) | A7 |
| [4] gate (4243765173) | A8 |
| [2]/[24] nonce (4243765168/4243831473) | A9 + D1 issue |
| [7] cookies (4243765184) | A10 |
| [3] error pipeline (4243765170) | A11 |
| [5] mount (4243765177) | A12 |
| [15] body (4243765216) | A13 |
| [6] middleware (4243765180) | A14 |
| [16]/[28] resolveReturnTo (4243765220/4243886312) | A15 |
| [17] fixtures (4243765224) | A16 |
| [11] oidc config (4243765200) | A17 |
| [1] one flow (4243765166) | S1 |
| [19]/[26] useSession (4243765232/4243864970) | B1 + D1 |
| [20] badges (4243765237) | B2 |
| [23] federated default (4243765251) | B3 |
| [21]/[25] Sentry (4243765241/4243863058) | none (rides along, fine) |
| [22] local.json (4243765245) | none (D1 description note) |
| [29] varlock (4243902112) | none (→ #839) |
| [30] tsconfig (4243943208) | none (D1 reply with evidence) |
| [18] logout thinness (4243765229) | none (deferred, low value) |
| CR1 timeout (4237786292) | D1 follow-up (dev-only + OIDC fetches share the gap; do with token-validation issue) |
| CR3 /me userId (4237786297) | none — stale (already fixed by PR's later commits) |
| CSRF summary note | D1 issue #2 |
