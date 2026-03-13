Closes #<!-- issue number — required -->

## What does this PR do?

<!-- A short description of the change and why it was needed. -->

## How to test

<!-- Steps to verify the behaviour locally. Include auth state, routes, edge cases. -->

1.
2.

## Checklist

### General
- [ ] PR targets the correct **milestone branch** (e.g. `feature/exchange`), not `develop` or `main`
- [ ] Linked to a **milestone** (set in the sidebar)
- [ ] Linked issue uses `Closes #<number>` above
- [ ] Branch follows naming convention (`feat/`, `fix/`, `refactor/`, etc.)

### Code quality
- [ ] No TypeScript errors (`npm run lint` passes)
- [ ] No `any` types introduced without justification
- [ ] API calls are in `src/api/`, not inside components
- [ ] No unused imports or dead code

### UI changes _(skip if not applicable)_
- [ ] Tested on mobile viewport
- [ ] Tested on desktop viewport
- [ ] No visual regressions on existing pages

### Auth / access control _(skip if not applicable)_
- [ ] Tested while **signed out**
- [ ] Tested while **signed in without required permissions**
- [ ] Tested while **signed in with required permissions**

## Screenshots _(if UI changed)_

<!-- Before / After screenshots or screen recordings -->
