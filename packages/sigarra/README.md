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

This runs `fern generate --local` and then `scripts/patch-generated.ts`, which fixes a type error in Fern's generated `Headers.ts`. Fern needs Docker (the Fern TypeScript generator runs in a container) and `node`. With Podman, unqualified image names such as `fernapi/fern-typescript-sdk` must resolve to Docker Hub; if they don't, point `CONTAINERS_REGISTRIES_CONF` to a file containing `unqualified-search-registries = ["docker.io"]`.
