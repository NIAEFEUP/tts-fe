// Seed the university catalog only — exactly what the scraper's `database.db`
// holds (faculty, courses, course units, occurrences). No mock data.
//
// Run: bun run db:seed
//
// Both seed scripts truncate every table first, so this one EMPTIES the demo
// layer (exchanges, users, classes, …). To get those, run `bun run db:seed:demo`
// instead. See `seed-core.ts` for the implementation.

import { runSeed } from './seed-core'

const { catalog } = await runSeed({ demo: false })

console.log(
  `Seeded ${catalog.courses} courses, ${catalog.courseUnits} course units, ` + `${catalog.occurrences} occurrences.`,
)
