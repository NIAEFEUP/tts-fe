import type { Db } from '@/infrastructure/database/prisma'
import type { FacultyRepository } from '@/domain/ports/FacultyRepository'
import type { UserRepository } from '@/domain/ports/user.repository'
import type { SessionRepository } from '@/domain/ports/session.repository'

import { PrismaFacultyRepository } from './PrismaFacultyRepository'
import { createUserRepository } from './user.repository'
import { createSessionRepository } from './session.repository'

export interface Repositories {
  facultyRepository: FacultyRepository
  userRepository: UserRepository
  sessionRepository: SessionRepository
}

export function createRepositories(db: Db): Repositories {
  return {
    facultyRepository: new PrismaFacultyRepository(db),
    userRepository: createUserRepository({ db }),
    sessionRepository: createSessionRepository({ db }),
  }
}
