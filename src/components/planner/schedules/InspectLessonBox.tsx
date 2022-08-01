import classNames from 'classnames'
import { Lesson, LessonBoxRef } from '../../../@types'
import {
  convertWeekdayLong,
  getClassTypeClassName,
  getLessonBoxName,
  getLessonBoxTime,
  getLessonTypeLongName,
} from '../../../utils'

type Props = {
  lesson: Lesson
}

const InspectLessonBox = ({ lesson }: Props) => {
  const lessonType = lesson.schedule.lesson_type
  const lessonBoxRef: LessonBoxRef = {
    type: lessonType,
    id: lesson.course.course_unit_id,
    acronym: lesson.course.acronym,
  }

  return (
    <div
      className={classNames(
        'schedule-class-responsive group',
        getClassTypeClassName(lessonType),
        getLessonBoxName(lessonBoxRef, 'responsive')
      )}
    >
      <div
        className={classNames(
          'p-2 py-4 pl-4 pr-6 text-sm',
          'leading-none tracking-tighter text-white',
          'flex h-full w-full flex-col items-center justify-between gap-6'
        )}
      >
        <div className="flex w-full flex-col justify-between gap-2">
          <span className="flex w-full items-center justify-between">
            <strong title="Dia">{convertWeekdayLong(lesson.schedule.day)}</strong>
            <strong title={getLessonTypeLongName(lessonType)}>{lessonType}</strong>
          </span>
          <span title="Duração">{getLessonBoxTime(lesson.schedule)}</span>
        </div>

        <div className="flex w-full flex-col items-start gap-2">
          <div className="flex w-full items-center justify-between gap-4">
            <strong title="Sigla da Unidade Curricular">{lesson.course.acronym}</strong>
            <span title="Nome da Unidade Curricular" className="whitespace-nowrap">
              {lesson.course.name}
            </span>
          </div>
          <span title="Nome da Turma">
            {lesson.schedule.composed_class_name ? lesson.schedule.composed_class_name : lesson.schedule.class_name}
          </span>
        </div>

        <div className="flex w-full items-center justify-between gap-3">
          <span title="Sala">{lesson.schedule.location}</span>
          <span title="Professor(es)" className="whitespace-nowrap">
            {lesson.schedule.teacher_acronym}
          </span>
        </div>
      </div>
    </div>
  )
}

export default InspectLessonBox
