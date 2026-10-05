# Schema Migration — Django → Prisma 8

Mapping from the legacy Django backend (`apps/backend/legacy/django`) to
`src/infrastructure/database/contract.prisma`.

**26 legacy tables → 19 models.** The reduction is concentrated in the exchange
domain: 6 tables collapse into 2.

---

## 1. Table mapping

### Identity

| Legacy table | New model | Change |
|---|---|---|
| *(Django `auth_user`)* | `User` | New table. PK is the NMEC string, so there is no surrogate key to map. Legacy scattered `user_nmec` + `user_name` across six tables as plain columns. |
| *(Django `django_session`)* | `Session` | Opaque random token in an httpOnly cookie. Replaces Django's session table. |

`ExchangeAdmin` had **no successor table** — it was a one-column username list,
and it becomes `User.isAdmin`.

### University catalog

| Legacy table | New model | Change |
|---|---|---|
| `faculty` | `Faculty` | `last_updated` dropped (see §4). |
| `course` | `Course` | `faculty` FK → explicit `facultyId`; `last_updated` dropped. |
| `course_unit` | `CourseUnit` | `schedule_url` dropped (no frontend consumer). Gains `ects`, absorbed from `course_metadata`. |
| `class` | `Class` | `course_unit` FK → `courseUnitId`. Unchanged otherwise. |
| `professor` | `Professor` | Renamed columns for consistency (`professor_acronym` → `acronym`). |
| `slot` | `ScheduleSlot` | **Merged with `slot_class`.** See below. |
| `slot_class` | — | **Folded into `ScheduleSlot`.** The join table existed only to give a Slot many classes. Since a slot belongs to exactly one class, that became a direct `classId` FK. |
| `slot_professor` | `SlotProfessor` | Unchanged, minus the redundant `professor_id` column already on `slot`. |
| `course_metadata` | — | **Dropped.** Its only content was `ects`, which moved onto `CourseUnit`. |
| `course_group` | — | **Dropped.** No route consumed it. |
| `course_unit_course_group` | — | **Dropped.** Only existed to join the two above. |

### Student state

| Legacy table | New model | Change |
|---|---|---|
| `user_course_units` | `Enrollment` | `user_nmec` → `userId`; `course_unit` is **not** stored — it is derived via `class.courseUnitId`, since a class belongs to exactly one course unit. |

### Platform configuration

| Legacy table | New model | Change |
|---|---|---|
| `exchange_expirations` | `ExchangePeriod` | Now course-unit-scoped only. `is_course_expiration` **deleted**; `active_date`/`end_date` renamed `startsAt`/`endsAt`. |
| `exchange_admin` | — | **Dropped** → `User.isAdmin`. |
| `exchange_admin_courses` | `AdminCourse` | `exchange_admin` FK → `userId`. |
| `exchange_admin_course_units` | `AdminCourseUnit` | `exchange_admin` FK → `userId`. |
| `info` | `ScrapeRun` | Single row keyed by `DateTime` → one row per sync run. |

### Exchanges — 6 tables → 2

| Legacy table | New model | Change |
|---|---|---|
| `direct_exchange` | `ExchangeRequest` | `issuer_nmec` → `creatorId`; `issuer_name` dropped (join `User.name`); `accepted` + `canceled` → `status` enum; `admin_state` → `adminState` enum; `date` → `createdAt`; `last_validated` → `lastValidated`; `marketplace_exchange` FK → `targetUserId` + `status`. Gains a `type` discriminator. |
| `marketplace_exchange` | `ExchangeRequest` | Same folds as above. |
| `exchange_urgent_requests` | `ExchangeRequest` | Same folds. `message` survives (urgent only). |
| `direct_exchange_participants` | `ExchangeItem` | **Gains `userId`** — two rows per swap, one per student. Class-name strings → `fromClassId`/`toClassId` FKs. `course_unit` acronym and `participant_name` dropped (joins). |
| `marketplace_exchange_class` | `ExchangeItem` | `userId` = the issuer; there is only one participant. |
| `exchange_urgent_request_options` | `ExchangeItem` | `userId` = the issuer. |

### Enrollment requests

| Legacy table | New model | Change |
|---|---|---|
| `course_unit_enrollments` | `EnrollmentRequest` | `user_nmec` → `userId`; `user_name` dropped; `accepted` → `status`; `admin_state` → `adminState`; `date` → `createdAt`. |
| `course_unit_enrollment_options` | `EnrollmentRequestOption` | `course_unit_enrollment` FK → `requestId`; `date` dropped. |
| `student_course_metadata` | `StudentCourseMetadata` | Unchanged. |

---

## 2. State mapping

Legacy stored lifecycle as free text plus booleans, which permitted contradictory
states such as *rejected but not cancelled*.

| Legacy representation | New |
|---|---|
| `accepted = true` | `status = ACCEPTED` |
| `canceled = true` | `status = CANCELLED` |
| `accepted = false, canceled = false` | `status = PENDING` |
| `admin_state = 'untreated'` | `adminState = UNTREATED` |
| `admin_state = 'treated'` | `adminState = TREATED` |
| `admin_state = 'rejected'` | `adminState = REJECTED` |
| `admin_state = 'awaiting-information'` | `adminState = AWAITING_INFORMATION` |
| `ExchangeUrgentRequestOptions` / `MarketplaceExchange` / `DirectExchange` (by table) | `type = URGENT` / `MARKETPLACE` / `DIRECT` |

The two axes are deliberately independent: an admin can approve a request while
the students are still deciding. Rejection exists in exactly one place
(`adminState`), so it can no longer disagree with `status`.

---

## 3. The `ExchangeItem` change

This is the one alteration that is not a mechanical rename, and it blocks
migration if skipped.

A direct exchange is a **swap**, so each side has its own origin class, its own
destination class, and its own accept flag. Legacy therefore wrote **two rows
per exchange choice** — see `ExchangeController.create_direct_exchange_participants()`:

```python
# other student's move
DirectExchangeParticipants(participant_nmec=other, goes_from=A, goes_to=B, ...)
# requester's move, mirrored
DirectExchangeParticipants(participant_nmec=auth_user, goes_from=B, goes_to=A, ...)
```

A single row without `userId` cannot represent this — you cannot tell whose move
is whose, nor when each side accepted.

`"accepted by all participants"` is now **derived** (`every item accepted`)
rather than stored, which is what `DirectExchangePendingMotive()` reverse-engineered
from the row set on every read.

---

## 4. Columns dropped outright

| Column | Tables | Why |
|---|---|---|
| `last_updated` | `faculty`, `course`, `course_unit`, `class`, `slot` | Only ever written by the fetcher, never read by a route. Sync freshness is now `ScrapeRun`. |
| `is_course_expiration` | `exchange_expirations` | Let the same row be visible through one endpoint and invisible through another, depending on the flag it was created with. Removed along with course-scoped periods. |
| `is_composed` | `slot` | Unused. |
| `schedule_url` | `course_unit` | No frontend consumer. |
| `professor_id` | `slot` | Redundant with `slot_professor`. |
| `course_unit_id` | `user_course_units` | Derivable via `class.courseUnitId`. |
| `course_unit`, `course_unit_name`, `course_unit_acronym` | option tables | Denormalized copies that could silently disagree with the catalog. |
| `participant_name`, `issuer_name`, `user_name` | option / exchange / enrollment tables | Denormalized copies of `User.name`. |
| `date` | option tables | Meaningless per-row; the parent row has `createdAt`. |

---

## 5. Type changes

| Legacy | New | Reason |
|---|---|---|
| `slot.start_time` / `slot.duration` — `decimal(3,1)` hours | `startMinute` / `durationMin` — `int` minutes | `exchange_overlap()` compared `hora_inicio / 3600` floats. Integers remove float comparison from the validation hot path. |
| `admin_state varchar(32)` | `AdminValidationState` enum | Four magic strings, one of them hyphenated (`awaiting-information`). |
| `accepted` + `canceled` booleans | `ExchangeStatus` enum | See §2. |
| `course_unit_id varchar(16)` on option tables | `courseUnitId int` | Matches the catalog PK. |

---

## 6. Structural changes

| Concern | Legacy | New |
|---|---|---|
| Overlap detection | 3 separate implementations: `exchange/utils.py:125`, `ExchangeController.py:166`, and an inline copy in `build_marketplace_submission_schedule`. Same rule, subtly different, one doing DB lookups inside its inner loop. | One pure function over `{studentId → (classId → slot)}`. |
| Exchange type dispatch | `getExchangeType()` + `getOptionsDependinOnExchangeType()` sniffing Python types | A `type` column |
| Opening a course for exchanges | `ExchangeCoursePeriodView` looped all units of the course, inserting one row each with no transaction | Same fan-out, wrapped in a transaction with an overlap pre-check |
| Class ↔ slot | `slot` + `slot_class` join | Direct `classId` FK |

---

## 7. Migration order

1. `User` — NMEC is the natural key and every other table references it.
2. `Faculty`, `Course`, `CourseUnit`, `Class`, `Professor`, `ScheduleSlot`, `SlotProfessor` — catalog, no dependencies on our side.
3. `Enrollment`, `StudentCourseMetadata`, `ScrapeRun`.
4. `AdminCourse`, `AdminCourseUnit`.
5. `ExchangePeriod`.
6. `EnrollmentRequest` + `EnrollmentRequestOption`.
7. `ExchangeRequest` + `ExchangeItem` — **last, and hardest.**

### Two hazards in step 7

**Class names are strings on the option tables.** `class_participant_goes_from`
holds a name like `1LEIC01`, which must be resolved to a `Class.id` via
`(name, courseUnitId)`. Rows that fail to resolve have no valid target and need
a decision — quarantine them rather than dropping silently.

**Course-level periods collide.** `ExchangeCoursePeriodView` inserted one row
per unit flagged `is_course_expiration = True`, while a unit-level insert creates
the same `(courseUnitId, startsAt, endsAt)` tuple flagged `False`. The new
`@@unique([courseUnitId, startsAt, endsAt])` will reject the second one, so the
migration must deduplicate before inserting.