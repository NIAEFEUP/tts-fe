// Patches the Fern-generated SDK after `fern generate`.
//
// The fallback Headers class declares its iterators as IterableIterator, but
// current DOM/Node typings require HeadersIterator (which adds the disposable
// iterator members), so the generated file fails to typecheck. Runtime behaviour
// is identical; only the declared return types change.
import { readFileSync, writeFileSync } from 'node:fs'

const headersPath = new URL('../src/generated/core/fetcher/Headers.ts', import.meta.url)
const original = readFileSync(headersPath, 'utf8')
const patched = original
  .replaceAll('IterableIterator<[string, string]>', 'HeadersIterator<[string, string]>')
  .replaceAll('IterableIterator<string>', 'HeadersIterator<string>')

if (patched !== original) {
  writeFileSync(headersPath, patched)
  console.log('Patched Headers.ts iterator return types')
} else if (!original.includes('HeadersIterator<')) {
  console.error('Expected IterableIterator declarations not found in Headers.ts; revisit this patch')
  process.exit(1)
}
