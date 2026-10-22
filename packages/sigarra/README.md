# @tts/sigarra

TypeScript SDK for [SIGARRA](https://sigarra.up.pt), generated from [`openapi.json`](./openapi.json) with [Fern](https://buildwithfern.com).

```ts
import { SigarraClient } from '@tts/sigarra'

const sigarra = new SigarraClient()
await sigarra.feup.home()
```

## Generating

The generated SDK is committed under `src/generated`. After changing `openapi.json` or `fern/generators.yml`, regenerate it with:

```sh
bun run generate
```

This runs `fern generate --local` and then `scripts/patch-generated.ts`, which patches the generated output: it fixes a type error in Fern's generated `Headers.ts` and turns off implicit retries (see [Retries](#retries)). CI regenerates the SDK on pull requests that touch this package and fails if the committed files differ. Fern needs Docker (the Fern TypeScript generator runs in a container) and `node`. With Podman, unqualified image names such as `fernapi/fern-typescript-sdk` must resolve to Docker Hub; if they don't, point `CONTAINERS_REGISTRIES_CONF` to a file containing `unqualified-search-registries = ["docker.io"]`.

## Retries

Retries are opt-in. Fern retries every request twice by default, including `POST`s, which could replay non-idempotent calls such as logging in or `finances.generateMbReference`. `scripts/patch-generated.ts` changes that default to 0, so a request is never retried unless you ask for it with `maxRetries`, either for the whole client or for a single request:

```ts
const sigarra = new SigarraClient({ maxRetries: 2 })
await sigarra.feup.home({ maxRetries: 1 })
```

Only enable retries for idempotent requests. Don't edit the generated files by hand: change the patch script instead, and `bun run generate` will reapply it.
