import type { Db } from '@/infrastructure/database/prisma'
import type { FacultyRepository } from '@/domain/ports/faculty.repository'
import type { UserRepository } from '@/domain/ports/user.repository'
import type { SessionRepository } from '@/domain/ports/session.repository'
import type { StudentRepository } from '@/domain/ports/student.repository'
import type { ScheduleRepository } from '@/domain/ports/schedule.repository'

import { createFacultyRepository } from './prisma-faculty.repository'
import { createUserRepository } from './user.repository'
import { createSessionRepository } from './session.repository'
import { createStudentRepository } from './prisma-student.repository'
import { createScheduleRepository } from './prisma-schedule.repository'

export type Repositories = {
  facultyRepository: FacultyRepository
  userRepository: UserRepository
  sessionRepository: SessionRepository
  studentRepository: StudentRepository
  scheduleRepository: ScheduleRepository
}

export function createRepositories(db: Db): Repositories {
  return {
    facultyRepository: createFacultyRepository({ db }),
    userRepository: createUserRepository({ db }),
    sessionRepository: createSessionRepository({ db }),
    studentRepository: createStudentRepository({ db }),
    scheduleRepository: createScheduleRepository({ db }),
  }
}
