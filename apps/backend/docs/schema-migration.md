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
| *(Django `auth_user`)* | `User` | New table. PK is the NMEC string, so there is no surrogate key to map. Legacy scattered `user_nmec` + `user_name` across six tables as plain columns. `email` is nullable + unique: OIDC provides it for real accounts, but students referenced in exchanges may never log in (see §7). |
| *(Django `django_session`)* | `Session` | Opaque random token in an httpOnly cookie. Replaces Django's session table. The PK stores **sha256(token)**, never the raw cookie value. |

`ExchangeAdmin` had **no successor table** — it was a one-column username list,
and it becomes `User.isAdmin`.

### University catalog

| Legacy table | New model | Change |
|---|---|---|
| `faculty` | `Faculty` | `last_updated` dropped (see §4). |
| `course` | `Course` | `faculty` FK → explicit `facultyId`; `plan_url` dropped (zero consumers — not even in the frontend types); `url` kept; `last_updated` dropped. |
| `course_unit` | `CourseUnit` | `schedule_url` dropped (no frontend consumer). Gains `ects`, absorbed from `course_metadata`. |
| `class` | `Class` | `course_unit` FK → `courseUnitId`. Unchanged otherwise. |
| `professor` | `Professor` | Renamed columns for consistency (`professor_acronym` → `acronym`). |
| `slot` | `ScheduleSlot` | Column renames only (`day` → 0-based `dayOfWeek`, `decimal(3,1)` hours → integer minutes). `classId` is **not** folded in — see `SlotClass`. |
| `slot_class` | `SlotClass` | **Kept as a real join table.** One lesson genuinely serves many classes: legacy `is_composed` marked slots shared by several classes (a "T" lecture shared by `1LEIC01`…`1LEIC10`), and the sync writes one slot plus one join row per class. Folding it into a single `classId` would make a shared lesson unrepresentable. |
| `slot_professor` | `SlotProfessor` | Now a composite PK `(slotId, professorId)` — legacy's table was shaped as OneToOne on `slot_id`, which silently limited a slot to one professor. |
| `course_metadata` | — | **Dropped.** Its only content was `ects`, which moved onto `CourseUnit`. |
| `course_group` | — | **Dropped.** Legacy exposed two routes over it (`/course/<id>/groups`, `/course_group/<id>/course_units`), but the frontend never calls them and no other consumer is known. Confirm no external consumer before the legacy DB is retired. |
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
| `info` | — | **Dropped.** The scrape is now a manual populate step, so data-freshness signaling has no reader (the only frontend consumer, `/info/`, was dead code — commented-out cache-invalidation logic). |

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
| `accepted = true`, `canceled = false` | `status = ACCEPTED` |
| `canceled = true` | `status = CANCELLED` |
| `accepted = false, canceled = false` | `status = PENDING` |
| `accepted = true`, `canceled = true` | `status = CANCELLED` — **canceled wins** |
| `admin_state = 'untreated'` | `adminState = UNTREATED` |
| `admin_state = 'treated'` | `adminState = TREATED` |
| `admin_state = 'rejected'` | `adminState = REJECTED` |
| `admin_state = 'awaiting-information'` | `adminState = AWAITING_INFORMATION` |
| `ExchangeUrgentRequestOptions` / `MarketplaceExchange` / `DirectExchange` (by table) | `type = URGENT` / `MARKETPLACE` / `DIRECT` |

The `accepted = true, canceled = true` row is real: `cancel_old_marketplace_exchanges()`
(in `MarketplaceExchangeView.py`) sets `canceled = True` on re-submission without
clearing `accepted`, so an already-claimed offer ends up with both flags set.
It means "was claimed, then superseded by a replacement" — i.e. no longer
active — so CANCELLED is the correct final status. Apply the rule in this order:
`canceled` first, then `accepted`.

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

Integrity of the class references is enforced at the DB level: `fromClassId` and
`toClassId` are **composite foreign keys** `(classId, courseUnitId) → Class(id, courseUnitId)`,
so a referenced class is guaranteed to belong to the same course unit as the item —
not merely to exist. `userId` uses `ON DELETE RESTRICT`: silently cascading away
one side's row would flip the derived "all accepted" to true with a side missing;
user deletion must explicitly cancel affected requests instead.

---

## 4. Columns dropped outright

| Column | Tables | Why |
|---|---|---|
| `last_updated` | `faculty`, `course`, `course_unit`, `class`, `slot` | Only ever written by the fetcher, never read by a route. No successor needed — the scrape is a manual populate step now. |
| `plan_url` | `course` | No consumer — not even in the frontend types. `course.url` and `course_unit.url` stay: the Major type declares the former (no component reads it yet, but linking a course page is a likely rewrite use), and `InspectLessonBox` links out with the latter. |
| `is_course_expiration` | `exchange_expirations` | Let the same row be visible through one endpoint and invisible through another, depending on the flag it was created with. Removed along with course-scoped periods. |
| `is_composed` | `slot` | Serialized into legacy class-schedule responses but never consumed by the frontend. Dropped as a column — the `SlotClass` join preserves the underlying fact (which classes share the slot), which is the only thing `is_composed` encoded. |
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
| Class ↔ slot | `slot` + `slot_class` join | Same join, kept as `SlotClass` — one lesson may serve many classes (shared "T" lectures), so a direct `classId` would be wrong |

---

## 7. Migration order

1. `User` — NMEC is the natural key and every other table references it.
2. `Faculty`, `Course`, `CourseUnit`, `Class`, `Professor`, `ScheduleSlot`, `SlotClass`, `SlotProfessor` — catalog, no dependencies on our side.
3. `Enrollment`, `StudentCourseMetadata`.
4. `AdminCourse`, `AdminCourseUnit`.
5. `ExchangePeriod`.
6. `EnrollmentRequest` + `EnrollmentRequestOption`.
7. `ExchangeRequest` + `ExchangeItem` — **last, and hardest.**

### Four hazards in step 7

**Class names are strings on the option tables.** `class_participant_goes_from`
holds a name like `1LEIC01`, which must be resolved to a `Class.id` via
`(name, courseUnitId)`. Rows that fail to resolve have no valid target and need
a decision — quarantine them rather than dropping silently.

**Course-level periods collide.** `ExchangeCoursePeriodView` inserted one row
per unit flagged `is_course_expiration = True`, while a unit-level insert creates
the same `(courseUnitId, startsAt, endsAt)` tuple flagged `False`. The new
`@@unique([courseUnitId, startsAt, endsAt])` will reject the second one, so the
migration must deduplicate before inserting.

**Duplicate direct-exchange items collide with the new unique key.**
`DirectExchangeView.post` does not reject repeated course-unit choices in the
request body, and legacy had no unique constraint on
`(direct_exchange, participant_nmec, course_unit_id)` — so the legacy tables can
contain duplicate requester rows. The new `@@unique([requestId, userId, courseUnitId])`
will reject them mid-insert. Check the legacy rows for duplicate
`(direct_exchange_id, participant_nmec, course_unit_id)` groups first; if any
exist, preserve distinct class moves and acceptance states with a lossless
mapping (e.g. an explicit legacy-id column), or quarantine them.

**Participants without accounts.** Legacy stored `participant_nmec` as free
text — the other student in a direct swap needs no TTS account (their schedule
is fetched straight from Sigarra, and acceptance happens via email link).
`ExchangeItem.userId` now references `User.id`, so every participant needs a
`User` row. Decide before migrating: either (a) create shadow `User` rows
(id = NMEC, name from Sigarra, `email = NULL` — the schema keeps this possible)
for legacy participants and at exchange-creation time, or (b) require login
before participating in an exchange (then legacy rows for never-registered
nmecs must be quarantined, not dropped). Do not invent fake emails.
`StudentCourseMetadata.nmec` has the same constraint — the same decision
applies to its rows.
