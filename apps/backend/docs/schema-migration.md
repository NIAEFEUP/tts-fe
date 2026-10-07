# Schema Migration — Django → Prisma 8

Mapping from the legacy Django backend (`apps/backend/legacy/django`) to
`src/infrastructure/database/contract.prisma`.

**26 legacy tables → 19 models.** The reduction is concentrated in the exchange
domain: 6 tables collapse into 2.


[![Database ERD](docs/erd.svg)](https://erddocs.com/#sql=v1.H4sIAAAAAAAAA81b63Ibt5L-r6fo0p-Qa15sJzknJVdiyxSlMNFtJSrZVColQYMmiWgITACMaB4fV-1D7BPuk2x1A5gLRTt2jry7-mFLMxgM0OjL11_3DIdQOoTCKrcU_W92doZDmE4v4bXI7lBL-O___C-Qwotb4RAyo70Vmd8ZDmncATo112DLHPfAaARrVlCgBYsi76-MzSX4hdLzHmgDsixylQmPEpy3Ss8dX57lYu5oNr8QHjKhQSon5hYRVsovAEW2AOMXaAcwvke7hhznIltDYfL10thioTK4tUJnC5qlM0c_fpMthJ7jdF1gD5S7zkxpHV7jm0JZ4ZXRPRBZhoVH-SQTOsMcJdwak6PQrguK12OxyEVGN9YgwCk9zxFQl0vITF4u9SBK4afxxeTwF3g9Pjy7GMPJ5Ohifzo5PdpL65SY5cKigxGv4korD-c_gnBwo-QN3JYeRO4MTVVq9UeJ197MkTYMHSV7EBbfgzUK2wOHS3QebZdP5lLNhbUClmINFukgjUaayWRZaS3qDEFJEJk1zoHIhMSlyngqN4CLUu_RYIDL8fF4NAV63ejs6nTaOZhcTienoykP7cLhxdlJXMh1SRs4uji7OofXv9Ds3-__NDk9ig_-Wxe-g2cvaNrJLJypRV9a7Ug7XA_cSvls0RSGNyAgM8vCOOUR7nANHYcI2ngEkgN2k6wvxRIhW2B2BzNj4yTQiZLeFN9KuCDCmcjK3K-DDLvdT9_0v7BfPmTlaDfgvLjNcftxgNAybogm04jSPZCLN2bAJvrt4_3QdM8GMDkYn04n018ee_adpZGYw5VDC293gARIsmcPAK-UhOEQTk_Gox7gYD6A3edPn3_59NnzL7_a3QG-V-Y5S-1JPN89OJscjEDkK7F2UFhzryQ6UJ5VglwPGbcptXe9YF1hIudLiZqOZ4ZsGRKUBgFSWcw8YHQabEsa79HCQtwj5GY-56EDmC4wTFWNneVmBcvS0dGqPIdbBF6rN5BZFEF_lQW3ENKs2D92zo3zc4suTOVpmIPTq-NjRz5BKueVzjytLewXlJb4Bl13sAOAS6HyKL2X8CqM2AHQZBjx-k6Y-Sg3tyQLuVQavuVtmQI1rSheLITGHAT5n5wmJwPLTIHkMDJ0Djor0me_wDU_LjJfijznX8DoLuTqniSvYZ_mC8o7bPxO5k0TK8cX4XVwsfBK4kyUue_MRO6wSwsO4pL7Hg6Ex6laYj1Km1Wny6NQW5PnS9TeQfwZV5d-_Y1GxKNxozAhjYiXLvCPEp3_9TcAeGUx50jQ2U23-QFjd7vNWabCzpGn-chZwgOtSSYel3G548alsNxq9XFe19hQ9aodAIfOKaOrbZMNhUt8W9RCT0Ma57A5hM6Fhm0cFQ8LDu8EvaCwH14ULGfUuvPrbzvv2BWdFYK01AotzRK8uUPNhqVh4X1xpvM1ZMbcKRzAaGEcajBkXD_8PAVn6n0Jy37P4r3Jgpckf3h5cUgm7jEjMYPILQq5BnyjSFQmaPPMGu1Ry0H0NVEw7G7I8Bfi-dd_A0PuGeNawjrZpMGKVVq2i5ZfoHXKeZR7IODgNeQo7sJknVuR3ZVFj-GBykSPHITrBidAPn6tMJdQOt5D3F18qRvAsTF3ZRGmWgi3QNdc1L3IS3wRFsMSgYWaL_qovTXFmsQlYCac50fBlbOZytCRhfEj39PV6FmBfOsOELizk4bLjZeCirBThpYiz2j5bg9-DQ_-1qv9JV1VdMXoA8zR4x6MhKMg1v04AyaTKJRF1xhEVv3qFbu4Tnpnt3mteuS3blS4x4xOwyE8H8DV6eSn8cXlZPoLjPan-8dnR4yulspaY1GSgi0rrBXg4Fpn8Lu5_UzR8jAAFtZgQgt6vWwdLKnP7uH46ny38v3pgF9WNpwQZ7DUMHFETHUg5p-J9uGXOHXaagQ_SkInWR7B-xZwocOK-Ir0rNKyeI1mTbvZpmbVo5uaFrfNypBEUAMH2v_xYDwZNQXQVPKwdMoAWo_swj9h94T_ZdnRDhpCGA7bm4ug5PnT51_H-NiWTCHmCFcXxwM4NRAQt4fDcUBtOqANIRmcdMjOT8TvxoJfFxFIVLmB8t0e3GERQAwNtbiyBPtIEXOl72gL7feyVvqESQqV3aElFyYgV3eYr8nQB1DkQl-XNqc7c6NxD_6B1lAq58olWvYedLstwI816LKQcZDHZWGsyAfVpQ6HbEoXUkjaCDUckdy2aBUM_TjA-nbcgQ5mhOzucB1ysyCSJ_SeJwG4U-S4NX4Rb_Xn1pQFp5jklINjDaK4obluIo4xurHAHs-iDVhTekziksBzuRRpGllMy6SiQW2YUyspq3R0Iml49Wclpm3Wkp74WLfctJ2GGbw-aJlNZTQpuUy28Az-Cc-bVhKv0zZUVubCRit51if7IGHysMPcCN_Uq-oNwyEzCw6OxlMYNjLKIYW0l0q6bweDQVB69CE4kgZrtCCRYAB4tUQ-yDBdBGpMFpiSDK4_Q58R7QAUy5OCsCKSsnPsTPlHUujd3U9AoVkuXI2zYER_tsBnRHwP0F6BVhlZQ9d4_5wvb-BBHvUAC54VpBAPrGcrlov509l0vAcqgJ8FCok2URZ_lCSemdIychFMIVR0AaelPWJwYq4SdH57ZkonRm8gZiMnLmhF-VBm8lxJYiVCxFTaoeVTqOJ7pdLdbVdrwiMk7wEEROMjuW-GsqCjZHjVwYnSG6UziyTHTrfbNMmFoMw8nGjTKEmEG4bJVt70Ye830PD0JxhpHcEaVvrseDwZPX1GpnoviKZS6GhFLx_RO7vc-FFLnS_TlW36-P58i1X-kCJSW-u35Uh0h4byax6mSlPzIFN63yxTk-Zg5QnpcOdXEmcizuJZ0FuGQzj8ETxnaBxnm1MNKJzybEMfZm1o-OGPbg_mpbBCe6QIEmZrUAlBg24xN3ruKP8nY3BMV9XuhxJ8ul7xB4pe3Fp6zfg1Fr5hFtWdyhTOrZmhc6ZJsdSwbiMMFdXgzEh8gDBftnmXvfo5tM5ooGyENJGo2lxkdyCC-iYWLrCjRL6FiXQicLwxgbVk0ZA7EFIUFG6q5GlG7EbI6lgum9A2aqxjLa02XaeiDQ46rTqnIRo6hEISF0cL2LivZHcA--mvTGiaz6G9RzjZP_2l8vm0fkEpJeUFu9NdyDHzpUXWp2ixg8Gzp-k12tglCGLMgfA6Ud6ecmOUc4SMSPUkt6Wwd0iEOTqEG2atSf1Q3gQskqRGUzE0JMSCLA8o8rL-6zroYhIE_9UNqW64Q3AyMO5ocWYs1kROZf1hoTRgD2Yml-SUFLFSzNZGNpynm0hekSlzCUtxh7V4ojBLbbGw6FBz2K6y9GyBssyRXpnUNvpuOufw8CaAnzJ0n55HBM__BlB_Fm6d8b_jSB4-hW_hstRSrMP-XTz0G6nEDfS_g6d9KmxIwnf3lPMbXdmwYjVsw_6osL1IEzB_yFGUlFWK9dnsZ8S7GDaGQzhRuqSDcopA31JJreYLP0jIlqOtxEwtRd75svesCwsy8B6sFipbwFLIDcLxmqiTXBSdLjsnArIzwlruBZ0MztE6sLg090Q8Ck-2qizmvDznhfVhQXGBsgzVkBOl45XcZHxli82lKNGOD5UvcfAemxy_IZ5EefjdKB3KRFEvmFIsCsKWiv7S66ifLmpG4MTpCb5Os1G85pFhDjeAHylpEpRBOTArHTB-ZVQ3tUHcdOEWM0FFEjpXwjNCr_ve9HlCRZITeaWdaZusmjQLZbdBSmxyJKGmBm8BA-GpT6BQgjkl1MFvj_AygZttkCM89Qlo49UrJTtxdb301o1AU10Mp3jO9UH4JgEmtYynuny-bIqsHYiS2GIwaupLtc0kzM8h0DrSQSNEbhdjY2V_WZTNOVribN_4LDTWlwO4nF5REQcup_vT8aMzU5SQm0zkkRZLfGosq3zhKv4jKK5wVBxm5Ei-VzmyMK4nUJBgY65g0L3IlQyOpzDOKbLglM-JyvlaU2rZ91YVIa5RGZAKg7Bf1XZynCuvlsIT_bEwuXTgyFOLnKtxHKTZnzQwWWcKT2B63k1qXANc1uFEoD6gTyN5-hjU6Yfs_lEs_pGyBYKFwpckzpTzkTTrJIEPpkP7j36l-4K8hSutNXMqhykZkz-Z2N6PdECPqcrDIXw1gPPj_enh2cUJjM5ODydHV1S2Pzv9HGZzgLm6RRu0MnJSpHp9F6ptRlOEDhXuswJ1oPpWC0MQK1KwlHEzHLV9Rxn1TOi-Kf0eWHQm53ifBn_hAunW40aAABj6oWhOuJqqfZTVo45qccLhT_O0dJzeCu0EF1wGcIGCsB9NtcuQVrm0Jqom7oKYzy3S2QYKBqoiOld5KCrzYtL-CIWl2LytM-OGG0JqspJCjJBYp1PFYu0UuSFrVjThvQr-wi-sKeeLqJCyMEoT0KbK7eYQmos7SnogsUDN4NYw4udyEi_Ac_tANBzeWuUgWrQNO4n_fdIg4jkqpdBPVU6hlF2mq63rtQ9oXCcH9pDg2mLnIjhL5UIRGd-IzOdrMIRryehXSkuzqo27uadetdZeXF0zd20QVy2Hu8nlV5Kt6leP6IE_C_W64eY-SHS9RyIVtVzX8R5KpqV3dXWvWeB7RCl9Th5sm8Q-jgd5_BDx9QDG_zH6fv_0aHz56FGB-8iafWp8yAeTC-pIIj-0Mkx-yARtHLiVoMLxyf7Fj-Pp-fH-aEwD2RrNbEZlOb1mbCM0hVS13AG4ujgiQEjjiByIKEm4O9eLPSCioA4adFGGsdQfYkyuZpitsxwHQSU5VQ3VeiIMOP2l65eeQnvg7NmzUyGLZrtJXXY3w5vUZ3dTNdqxdxYabniSa0ez3MTeQOAF3K75fw5kISUWeW5WSIUZ7VA72hOHHqp4gcXfMfMo-7el72vj--GdOcoUfc7HpwfUu9X_DvZHo_H5dHwANCcUwnqVqUKQpNOqexBrcUG-HA9IsCh5RVt-jIVOkHm30WcTZSw3VjDaPx2Nj4_HB8E1G3KifiEtrvjFxLDrWa4yz6WMhJXvFG0IlG_rEJ1BGZLV-IodqPa4A_XL4kFTHJ6ZMjZMxXPj_gNHeQzeK1O6fA0zasT0-MZz09xuqblhCSXTLM3fk_D5D7ESipbdV3pm7JKdw25YMGvSTxXgD7pDy746nV6M98Nq698uxj-MR-HX_Z_3J9RZeT05JdwW4FrYzUXo1XRwwM1cSSjwBE6IVfN8t3E1_Xpl543WG04mbqg6S6WQOCMdYxTPRmtpp8uVXHBazWZKzzfxQZx2o0LRKuNXsbcslQwoPOrCRDa8fFSPrQ0bD_qXelB74TTXFhccCfFL9LAiLFjruarUPPY6FJipmcoq_9Fp-KAu6yrNEOYT0SfE_I-MPHkhG-QxYGqZ7DkPGJL7V5iUp-1VG3_Zuhw3_xI-2HbV2Htzxq3bp-np-OpaAx1qAFZkShuWVR1VNK8ElH4onSfphPSVEsz2dh10luINPH_61TfkMIMqcS_fEp2jOn6DaGu40612Ui2iMpa0jEZVNbmK4T1aNVsP33Jz0DvohOZB8ioq2iRTwS5UzCuys2rU7sctxI5b4sVJoSgvaNdRee2U6FjmkdurCP2Vw5jj4_Ctku_I_b0NaX8PcuF83ChKeEdzty8lsPqYhS-qvLjNCm0TYpBuMHD1pWuDj_qQevVq2kNINhuIJZni9jlb2tr9sFc7b8aqrR4uUAdPAv26xdOFKjLxMisTeRzu7s9zUVCySSQ_Z4LMpUbWNKVHlK2GqCEV-QvuZ6DYyOUOStFSpx2tos9X2h3zXImwynMaxwZLPiegvqpt3nluvZr-fBaoG0oyCAJVrEOBlms00SnR5cTv8jcDjCAWDWaYCnxDKl9QUhivhVDPKV-ikkJpg6oniYKK2DsTmmoi-IaKGZSPP--vBPUixrCSGmnbUYBUi0NANKamY0_29aC7dBukrp7_BDw9HMLP1HMJsSTALFxVfmh8kdHAP9d0Ys3WjOtYH4wO3qXPN7g69CJ02lAlQpsVk_zcUsTqSwMzH0pJcVl74FSOmnJHLlSE1JsqM5KICxY7l5JmuYp9krsJj8G3saODjLdCabtcbbVl_F6EilOSai2OTnLAUSM1W-XITo_LjRjrEkTJMEwEMZsxgqk9t9LOo2DKKurAJgv4L6agSUSBpPucJAK36aUKd13KiKXukFlWZatRu_DdaTzYzspC5OhUs2zcDbOxglTrCbxm48uWOLYX2lsflNRT80lVfZd03qFIR79Nv59cskIQA92gdckfkN4tkQpgNJKbhuksq-1EjvVPWxQasOK9ongo8y0JbOosSOzun7Q1NOGM-atvDeI7R9tvGHm0Hip5b37_QFRjMjhGhsHmyDLTWVT3-eswpKgvg5UHr50KmInxDy79i_j0RjQL_NuJ8eqeILWl1znso54rjUgxgL-pEZI7v-j8qtd_4HuC91DVqSjeEMUXLnhHrik0FCh8yBYga0VNVE64B5_MUjxodK6_QvtcHMbfBjA-vTg7Pj4hRHox_ver8eX08dmMJlapvVRdSKn6JR_0s31icvT43ezRR9UUffqObraRAOyFTDBRIqm_gzlpv7AYwXPkI1L9eSECvd-gQuAJNAiPFw0agEvQTPJTI9pwyNmESOlfP7ADYhW-Omr2CHMlXUrOKmL20sAU701g_lq-8WgQ3AQU-oEmx3d_rloVlL0JVSil53vAbuAGlswy7UpritDFSO2itYXvghX8naBfCA27QhIs3E0glRq6yeOSVh0ZpK60gGKDIpyfXU7h1kiiwPM1-0igDhd69G3zU8lrcsnV2uBdo5kHrRK5-gfa2E4SPhwkh1c3PKAKn75OG9-5hLy16h3nmgWjaPraTRv-5DasqDBFmTPAo97X99hgEOFHYNQHxvtIKPWzA5-Yc5gVl9bqkpqlRAEl3KvUWc9frIVfa5iM1MTFJxXtsnm8nN-0L6V-OkN5VIieQdcp_LxofbIU5ltxKhfGxLdTt1xQFcGgGoR2K2rvITQ1qL-Fow09CIOEhj8UBeNqPjXi_d_y8X8fwOXV-fnZxfRzxK8ZOjLVUMCOOWXaMWHTzAoq1aZvLlrNlIqa2tocTJxh-FYvMXs3fBvVQ8l3w2X8kGEA59Q3mJEK8sk4MeMvR8lf0XR0-Bb7yYarNpttX-MBWS-9a1t9qLIq2iSHz48upNGU_z_KaLSSVhHt3f8ASK1uErtAAAA)


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
| `faculty` | `Faculty` | `last_updated` dropped (see §4). The one-to-many `course` FK is gone — replaced by the explicit `FacultyCourse` m2m join (a course may be offered by several faculties). |
| `course` | `Course` | `faculty` FK → explicit `facultyId` *removed*; see `FacultyCourse`. `plan_url` dropped (zero consumers — not even in the frontend types); `url` kept; `last_updated` dropped. |
| `course_unit` | `CourseUnit` + `Occurrence` | Split into two tables: `CourseUnit` is the abstract, year-agnostic subject (PK is a synthetic serial — Sigarra exposes no stable id on the URLs the sync hits); `Occurrence` is the (courseUnit, course, academic year) tuple whose PK is the Sigarra `pv_ocorrencia_id` (composite `(id, year)` because Sigarra reuses the same occurrence id across years). `ects`, `schedule_url` and the per-occurrence `hash` and `url` move onto `Occurrence`. The natural key `(courseUnitId, year, courseId)` rejects duplicate inserts inside one sync run. |
| `class` | `Class` | Composite FK `(occurrenceId, occurrenceYear) → Occurrence(id, year)`. `course_unit` is derivable via `class.occurrence.courseUnit`. |
| `professor` | `Professor` | Renamed columns for consistency (`professor_acronym` → `acronym`). |
| `slot` | `ScheduleSlot` | Column renames only (`day` → 0-based `dayOfWeek`, `decimal(3,1)` hours → integer minutes). `classId` is **not** folded in — see `SlotClass`. |
| `slot_class` | `SlotClass` | **Kept as a real join table.** One lesson genuinely serves many classes: legacy `is_composed` marked slots shared by several classes (a "T" lecture shared by `1LEIC01`…`1LEIC10`), and the sync writes one slot plus one join row per class. Folding it into a single `classId` would make a shared lesson unrepresentable. |
| `slot_professor` | `SlotProfessor` | Now a composite PK `(slotId, professorId)` — legacy's table was shaped as OneToOne on `slot_id`, which silently limited a slot to one professor. |
| `course_metadata` | — | **Dropped.** Its only content was `ects`, which moved onto `Occurrence`. |
| `course_group` | — | **Dropped.** Legacy exposed two routes over it (`/course/<id>/groups`, `/course_group/<id>/course_units`), but the frontend never calls them and no other consumer is known. Confirm no external consumer before the legacy DB is retired. |
| `course_unit_course_group` | — | **Dropped.** Only existed to join the two above. |

### Student state

| Legacy table | New model | Change |
|---|---|---|
| `user_course_units` | `Enrollment` | `user_nmec` → `userId`; `course_unit` is **not** stored — it is derived via `class.occurrence.courseUnit`, since a class belongs to exactly one occurrence of exactly one course unit. |

### Platform configuration

| Legacy table | New model | Change |
|---|---|---|
| `exchange_expirations` | `ExchangePeriod` | Now occurrence-scoped only (composite FK `(occurrenceId, occurrenceYear) → Occurrence(id, year)`). `is_course_expiration` **deleted**; `active_date`/`end_date` renamed `startsAt`/`endsAt`. |
| `exchange_admin` | — | **Dropped** → `User.isAdmin`. |
| `exchange_admin_courses` | `AdminCourse` | `exchange_admin` FK → `userId`. |
| `exchange_admin_course_units` | `AdminOccurrence` | `exchange_admin` FK → `userId`; the row is now scoped to an *occurrence*, not an abstract course unit (composite `(occurrenceId, occurrenceYear)`). |
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
`toClassId` are **composite foreign keys**
`(fromClassId/toClassId, occurrenceId, occurrenceYear) → Class(id, occurrenceId, occurrenceYear)`,
so a referenced class is guaranteed to belong to the same occurrence as the item —
not merely to exist. `userId` uses `ON DELETE RESTRICT`: silently cascading away
one side's row would flip the derived "all accepted" to true with a side missing;
user deletion must explicitly cancel affected requests instead.

---

## 4. Columns dropped outright

| Column | Tables | Why |
|---|---|---|
| `last_updated` | `faculty`, `course`, `course_unit`, `class`, `slot` | Only ever written by the fetcher, never read by a route. No successor needed — the scrape is a manual populate step now. |
| `plan_url` | `course` | No consumer — not even in the frontend types. `course.url` and `occurrence.url` stay: the Major type declares the former (no component reads it yet, but linking a course page is a likely rewrite use), and `InspectLessonBox` links out with the latter. |
| `is_course_expiration` | `exchange_expirations` | Let the same row be visible through one endpoint and invisible through another, depending on the flag it was created with. Removed along with course-scoped periods. |
| `is_composed` | `slot` | Serialized into legacy class-schedule responses but never consumed by the frontend. Dropped as a column — the `SlotClass` join preserves the underlying fact (which classes share the slot), which is the only thing `is_composed` encoded. |
| `schedule_url` | `course_unit` | No frontend consumer. |
| `professor_id` | `slot` | Redundant with `slot_professor`. |
| `course_unit_id` | `user_course_units` | Derivable via `class.occurrence.courseUnit`. |
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
| `course_unit_id varchar(16)` on option tables | `(occurrenceId, occurrenceYear) int` | Matches the `Occurrence` composite PK. |

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
2. `Faculty`, `FacultyCourse`, `Course`, `CourseUnit`, `Occurrence`, `Class`, `Professor`, `ScheduleSlot`, `SlotClass`, `SlotProfessor` — catalog, no dependencies on our side.
4. `AdminCourse`, `AdminOccurrence`.
5. `ExchangePeriod`.
6. `EnrollmentRequest` + `EnrollmentRequestOption`.
7. `ExchangeRequest` + `ExchangeItem` — **last, and hardest.**

### Four hazards in step 7

**Class names are strings on the option tables.** `class_participant_goes_from`
holds a name like `1LEIC01`, which must be resolved to a `Class.id` via
`(name, occurrenceId, occurrenceYear)`. Rows that fail to resolve have no valid
target and need a decision — quarantine them rather than dropping silently.

**Course-level periods collide.** `ExchangeCoursePeriodView` inserted one row
per unit flagged `is_course_expiration = True`, while a unit-level insert creates
the same `(occurrenceId, occurrenceYear, startsAt, endsAt)` tuple flagged
`False`. The new `@@id([occurrenceId, occurrenceYear, startsAt, endsAt])` will
reject the second one, so the migration must deduplicate before inserting.

**Duplicate direct-exchange items collide with the new unique key.**
`DirectExchangeView.post` does not reject repeated occurrence choices in the
request body, and legacy had no unique constraint on
`(direct_exchange, participant_nmec, course_unit_id)` — so the legacy tables can
contain duplicate requester rows. The new
`@@id([requestId, userId, occurrenceId, occurrenceYear])` will reject them
mid-insert. Check the legacy rows for duplicate
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
