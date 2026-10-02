# Contributing to TTS Backend

Thank you for contributing to **[TTS — Time Table Selector](https://tts.niaefeup.pt)**, developed and maintained by [NIAEFEUP](https://ni.fe.up.pt).

> For frontend contributions, see [tts-fe](https://github.com/NIAEFEUP/tts-fe/blob/develop/.github/CONTRIBUTING.md).

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

- Read the **[Wiki](https://github.com/NIAEFEUP/tts-be/wiki)** — setup, database schema, exchange logic, and the API reference are documented there.
- Make sure your local environment runs before starting. See [Database](https://github.com/NIAEFEUP/tts-be/wiki/Database) and [API](https://github.com/NIAEFEUP/tts-be/wiki/API).
- API documentation lives at [tts-niaefeup.readme.io](https://tts-niaefeup.readme.io/).
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

1. **Find an issue** in the [issue tracker](https://github.com/NIAEFEUP/tts-be/issues). If your idea doesn't have one, open it first so it can be discussed and prioritised.
2. **Get assigned** — the **project manager assigns issues**. Do not self-assign. Comment on the issue or ask in the team channel to be assigned.
3. **Identify the milestone branch** for your issue (e.g. `feature/exchange`, `feature/collaborative-sessions`). This is the branch your PR will target.
4. **Branch** from that milestone branch using the naming convention below.
5. **Implement**, keeping commits small and descriptive.
6. **Open a PR** targeting the **milestone branch** — not `develop`, not `main`.
7. Fill the PR template: link the issue (`Closes #<number>`), assign the milestone and a reviewer.
8. **Address feedback**, then merge once approved.
9. Coordinators merge milestone branches into `develop` when the milestone is considered stable.

---

## Milestones & Issues

Every PR **must** be linked to:

- **An issue** — use `Closes #<number>` (or `Fixes`/`Resolves`) in the PR description. GitHub will close the issue automatically on merge.
- **A milestone** — assign the PR (and the issue) to the relevant milestone in the sidebar.

### Active Milestones & Their Branches

| Milestone | GitHub Milestone | Branch to target |
|-----------|-----------------|-----------------|
| Feup Exchange | [#3](https://github.com/NIAEFEUP/tts-be/milestone/3) | `feature/exchange` |
| Collaborative Sessions | [#6](https://github.com/NIAEFEUP/tts-be/milestone/6) | `feature/collaborative-sessions` |

> If your work doesn't fit any milestone, discuss with a coordinator before creating a new one. Those PRs may target `develop` directly.

### Issue Labels

| Label | Meaning |
|-------|---------|
| `bug` | Something is broken |
| `enhancement` | New feature or improvement |
| `good first issue` / `good starting issue` | Great for newcomers |
| `help wanted` | Extra attention needed |
| `blocked` | Waiting on another task |
| `low / medium / high priority` | Urgency |
| `low / medium / high effort` | Implementation complexity |
| `database` | Database-related changes |
| `python` | Python-specific changes |

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
| `chore` | Tooling, deps, migrations, config |
| `docs` | Documentation only |
| `test` | Tests only |

**Examples:**
```bash
# Working on a fix for the Exchange milestone
git checkout feature/exchange
git checkout -b fix/exchange-conflict-validation

# Working on a new feature for Collaborative Sessions
git checkout feature/collaborative-sessions
git checkout -b feat/session-websocket-endpoint
```

---

## Commits

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
<type>(<optional scope>): <short description>
```

**Examples:**
```
feat(exchange): add endpoint to list pending requests
fix(auth): validate admin flag before returning user data
chore(db): add migration for collaborative sessions table
```

- Use the **imperative mood** ("add" not "added", "fix" not "fixed")
- Keep the subject line under 72 characters
- Reference the issue in the body: `Closes #123`

---

## Opening a Pull Request

1. Target the **milestone branch** (e.g. `feature/exchange`) — not `develop`, not `main`.
2. Fill in the **PR template** completely.
3. In the sidebar:
   - Link the issue under **Development** (use `Closes #<number>` in the description)
   - Assign the correct **Milestone**
   - Add relevant **Labels**
   - Add at least one **Reviewer**
4. Keep PRs focused — one feature or fix per PR.
5. If the PR is not ready for review, open it as a **Draft**.

### PR Size Guidelines

| Size | Lines changed | Expectation |
|------|---------------|-------------|
| Small | < 100 | Fast review, same day |
| Medium | 100–400 | Review within 2 days |
| Large | > 400 | Break it up if possible |

---

## Code Standards

### Django Architecture

The project follows a **views → controllers → models** layered pattern:

```
views.py        ← handles HTTP request/response only
controllers/    ← business logic, validation, DB operations
models.py       ← data definitions only
serializers.py  ← data conversion (model ↔ JSON)
```

- **Views** should be thin — delegate all logic to controllers.
- **Controllers** own business logic, calculations, and rules.
- **Models** should not contain business logic.
- **Serializers** handle validation and conversion; keep them focused.

### Django / Python

- Follow [PEP 8](https://pep8.org/). Use a formatter (e.g. `black`).
- Use the Django ORM — avoid raw SQL unless strictly necessary.
- Migrations are required for any model change. Generate them locally:
  ```bash
  docker compose exec django python manage.py makemigrations
  ```
- Do not commit migration files without the corresponding model change in the same PR.
- New API endpoints must follow existing URL naming patterns in `tts_be/urls.py`.
- Document new endpoints in the [API reference](https://tts-niaefeup.readme.io/).

### Tests

- Add or update tests in `exchange/tests.py` (or the relevant app) for any logic change.
- Run the test suite before pushing:
  ```bash
  docker compose exec django python manage.py test
  ```

### Do's and Don'ts

| Do | Don't |
|----|-------|
| Keep views thin | Put business logic in views |
| Validate in serializers | Trust raw request data |
| Use controllers for reusable logic | Duplicate logic across views |
| Write migrations for model changes | Change models without migrations |

---

## Wiki & Docs

If your change:
- Adds or modifies a model → update [Database](https://github.com/NIAEFEUP/tts-be/wiki/Database)
- Adds or modifies an endpoint → update [API](https://github.com/NIAEFEUP/tts-be/wiki/API) and [tts-niaefeup.readme.io](https://tts-niaefeup.readme.io/)
- Touches the exchange feature → update [Exchange](https://github.com/NIAEFEUP/tts-be/wiki/Exchange)

---

## Getting Help

- Check the [Wiki](https://github.com/NIAEFEUP/tts-be/wiki) and [API docs](https://tts-niaefeup.readme.io/) first.
- Ask in the team channel.
- Comment on the relevant issue.
- Reach out via [NIAEFEUP socials](https://linktr.ee/niaefeup).
