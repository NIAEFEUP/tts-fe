# @tts/sigarra

TypeScript SDK for [SIGARRA](https://sigarra.up.pt), generated from [`openapi.json`](./openapi.json) with [Fern](https://buildwithfern.com).

```ts
import { SigarraClient } from '@tts/sigarra'

const sigarra = new SigarraClient()
await sigarra.feup.home()
```

## Retries

Retries are opt-in. Fern retries every request twice by default, including `POST`s, which could replay non-idempotent calls such as logging in or `finances.generateMbReference`. `scripts/patch-generated.ts` changes that default to 0, so a request is never retried unless you ask for it with `maxRetries`, either for the whole client or for a single request:

```ts
const sigarra = new SigarraClient({ maxRetries: 2 })
await sigarra.feup.home({ maxRetries: 1 })
```

Only enable retries for idempotent requests. Don't edit the generated files by hand: change the patch script instead, and `bun run generate` will reapply it.
