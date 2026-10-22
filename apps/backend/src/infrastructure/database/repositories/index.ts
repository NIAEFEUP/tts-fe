import type { Db } from '@/infrastructure/database/prisma'
import type { CourseRepository } from '@/domain/ports/course.repository'
import type { FacultyRepository } from '@/domain/ports/faculty.repository'
import type { UserRepository } from '@/domain/ports/user.repository'
import type { SessionRepository } from '@/domain/ports/session.repository'

import { createCourseRepository } from './prisma-course.repository'
import { createFacultyRepository } from './prisma-faculty.repository'
import { createUserRepository } from './user.repository'
import { createSessionRepository } from './session.repository'

export type Repositories = {
  courseRepository: CourseRepository
  facultyRepository: FacultyRepository
  userRepository: UserRepository
  sessionRepository: SessionRepository
}

export function createRepositories(db: Db): Repositories {
  return {
    courseRepository: createCourseRepository({ db }),
    facultyRepository: createFacultyRepository({ db }),
    userRepository: createUserRepository({ db }),
    sessionRepository: createSessionRepository({ db }),
  }
}
