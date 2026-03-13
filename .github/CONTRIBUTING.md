# Contributing to TTS Frontend

Thank you for contributing to **[TTS — Time Table Selector](https://tts.niaefeup.pt)**, developed and maintained by [NIAEFEUP](https://ni.fe.up.pt).

> For backend contributions, see [tts-be](https://github.com/NIAEFEUP/tts-be/blob/develop/.github/CONTRIBUTING.md).

---

## Table of Contents

- [Before You Start](#before-you-start)
- [Workflow Overview](#workflow-overview)
- [Milestones & Issues](#milestones--issues)
- [Branching](#branching)
- [Commits](#commits)
- [Opening a Pull Request](#opening-a-pull-request)
- [Code Standards](#code-standards)
- [Wiki & Docs](#wiki--docs)
- [Getting Help](#getting-help)

---

## Before You Start

- Read the **[Wiki](https://github.com/NIAEFEUP/tts-fe/wiki)** — setup, file structure, state variables, and authentication are all documented there.
- Make sure you have a working local environment before starting. See [Running the project](https://github.com/NIAEFEUP/tts-fe/wiki/Running-the-project).
- **Never target `main` directly with a PR.** All work flows through milestone branches into `develop`.

---

## Workflow Overview

```
Find an issue → get assigned by PM → branch from milestone branch
     → implement → PR into milestone branch → review → merge
                                                          ↓
                              milestone branch → develop (when milestone is stable)
                                                          ↓
                                               develop → main (release)
```

1. **Get assigned an issue** — the **project manager assigns issues**. Do not self-assign.
2. **Identify the milestone branch** for your issue (e.g. `feature/exchange`, `feature/collaborative-sessions`). This is the branch your PR will target.
3. **Develop branch** if your issue is too broad and is not in a milestone, branch out from develop.
4. **Branch** from that milestone branch using the naming convention below.
5. **Implement**, keeping commits small and descriptive.
6. **Open a PR** targeting the **milestone branch** — not `develop`, not `main`.
7. Fill the PR template: ALWAYS link the issue (`Closes #<number>`), assign the milestone and a reviewer.
8. **Address feedback**, then merge once approved.
9. The PM will merge milestone branches into `develop` when the milestone is considered stable.

---

## Milestones & Issues

Every PR **must** be linked to:

- **An issue** — use `Closes #<number>` (or `Fixes`/`Resolves`) in the PR description. GitHub will close the issue automatically on merge.
- **A milestone** — assign the PR (and the issue) to the relevant milestone in the sidebar. If you're unsure, ask in the team channel.

### Active Milestones & Their Branches

| Milestone | GitHub Milestone | Branch to target |
|-----------|-----------------|-----------------|
| UI/UX mobile improvements | [#5](https://github.com/NIAEFEUP/tts-fe/milestone/5) | `feature/mobile` *(or ask coordinator)* |
| Feup Exchange | [#6](https://github.com/NIAEFEUP/tts-fe/milestone/6) | `feature/exchange` |
| Collaborative Sessions | [#7](https://github.com/NIAEFEUP/tts-fe/milestone/7) | `feature/collaborative-sessions` |
| Random Features | [#8](https://github.com/NIAEFEUP/tts-fe/milestone/8) | `develop` |

> **Random Features** don't fit a dedicated milestone branch, so those PRs target `develop` directly.


### Issue Labels

| Label | Meaning |
|-------|---------|
| `bug` | Something is broken |
| `enhancement` | New feature or improvement |
| `good first issue` | Great for newcomers |
| `help wanted` | Extra attention needed |
| `blocked` | Waiting on another task |
| `low / medium / high priority` | Urgency |
| `low / medium / high effort` | Implementation complexity |

---

## Branching

Branch **from the milestone branch** (see table above). Use this naming convention:

```
<type>/<short-description>
```

| Type | When to use |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `refactor` | Code restructure without behaviour change |
| `style` | CSS / visual-only changes |
| `chore` | Tooling, deps, config |
| `docs` | Documentation only |
| `test` | Tests only |

**Examples:**
```bash
# Working on a fix for the Exchange milestone
git checkout feature/exchange
git checkout -b fix/exchange-request-scroll

# Working on a new feature for Collaborative Sessions
git checkout feature/collaborative-sessions
git checkout -b feat/session-invite-modal
```

---

## Commits

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<optional scope>): <short description>
```

**Examples:**
```
feat(exchange): add request modal component
fix(admin): redirect unauthenticated users to OIDC login
chore(deps): bump vite to 5.4.0
```

- Use the **imperative mood** ("add" not "added", "fix" not "fixed")
- Keep the subject line under 72 characters
- Reference the issue in the body when relevant: `Closes #250`

---

## Opening a Pull Request

1. Target the **milestone branch** (e.g. `feature/exchange`) — not `develop`, not `main`.
2. Fill in the **PR template** completely.
3. In the sidebar:
   - Link the issue under **Development** (GitHub will show "Closes #..." automatically if you use the keyword in the description)
   - Assign the correct **Milestone**
   - Add relevant **Labels**
   - Add at least one **Reviewer**
4. Keep PRs focused — one feature or fix per PR.
5. If the PR is not ready for review, open it as a **Draft**.


## Code Standards

### TypeScript / React

- **TypeScript everywhere** — no implicit `any`. Define shared types in `src/@types/`.
- Reusable visual components go in `src/components/`. Route-level components go in `src/pages/`.
- **API calls belong in `src/api/`** — never call `fetch()` directly inside a component.
- Use existing contexts (`SessionContext`, etc.) instead of prop drilling.
- Custom hooks go in `src/hooks/` to keep components clean.

### Styling

- Use **Tailwind CSS** utility classes as the primary styling method.
- Avoid inline styles.
- Test your changes on mobile viewports.

### Linting & Formatting

The project uses **ESLint** and **Prettier**. Before pushing:

```bash
# Inside the container or with local node_modules
npm run lint
```

CI will fail on lint errors — fix them before requesting review.

---

## Wiki & Docs

If your change:
- Adds a new page or route → update [File Structure](https://github.com/NIAEFEUP/tts-fe/wiki/File-Structure)
- Changes a context or global state → update [State variables structure](https://github.com/NIAEFEUP/tts-fe/wiki/State-variables-structure)
- Changes the authentication flow → update [Federated authentication](https://github.com/NIAEFEUP/tts-fe/wiki/Federated-authentication-in-development-environment)

---

## Getting Help

- Check the [Wiki](https://github.com/NIAEFEUP/tts-fe/wiki) first.
- Ask in the team channel.
- Comment on the relevant issue.
- Reach out via [NIAEFEUP socials](https://linktr.ee/niaefeup).
