import { t } from 'elysia'

// Wire schemas shared by the two catalog route groups (`/v1/faculties` and
// `/v1/courses`). Keeping the course shape here — rather than inline per route —
// means both surfaces describe a course identically and cannot drift.
//
// Error bodies (`{ error, code }`) use the shared `apiError` schema from
// `@/interface/middleware/error-handler`; each route instance registers it as
// the named model `ApiError`.

/** A course as the catalog exposes it. `faculties` is an array because a course
 * can be offered by multiple faculties (shared courses). */
export const courseSchema = t.Object({
  id: t.Number(),
  acronym: t.String(),
  name: t.String(),
  courseType: t.String(),
  year: t.Number(),
  url: t.String(),
  faculties: t.Array(t.String()),
})
