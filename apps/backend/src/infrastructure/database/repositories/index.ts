import type { Db } from '@/infrastructure/database/prisma'

import { PrismaFacultyRepository } from './PrismaFacultyRepository'
import type { FacultyRepository } from '@/domain/ports/FacultyRepository'

export interface Repositories {
  facultyRepository: FacultyRepository
}

export function createRepositories(db: Db): Repositories {
  return {
    facultyRepository: new PrismaFacultyRepository(db),
  }
}
