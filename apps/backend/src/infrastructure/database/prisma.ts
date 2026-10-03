// Wire this file up after running `bun run contract:emit` at least once
// (that generates contract.json and contract.d.ts from contract.prisma).
//
// Usage: import { db } from "@/infrastructure/database/prisma" from anywhere in src/.

import postgres from '@prisma/orm-postgres/runtime'
import 'temporal-polyfill/global' // required by Prisma 8 for DateTime fields

import type { Contract } from './contract.d.ts'
import contractJson from './contract.json' with { type: 'json' }

// postgres<Contract>() creates a lazily-connected typed client.
// It reads DATABASE_URL from process.env; pass { url: "..." } to override.
export const db = process.env.DATABASE_URL
  ? postgres<Contract>({ contractJson, url: process.env.DATABASE_URL })
  : postgres<Contract>({ contractJson })

// Call this at app startup to establish the connection eagerly.
// Optional — the client connects on first query if you skip this.
let _connection: Promise<void> | undefined
export function connectDatabase(): Promise<void> {
  _connection ??= db
    .connect()
    .then(() => undefined)
    .catch((err: unknown) => {
      _connection = undefined
      throw err
    })
  return _connection
}
