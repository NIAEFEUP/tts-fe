import classNames from 'classnames'
import { Lesson } from '../../../@types'
import { convertWeekdayLong, getClassTypeClassName, getLessonBoxTime, getLessonTypeLongName } from '../../../utils'

type Props = {
  lesson: Lesson
  conflict?: boolean
}

const InspectLessonBox = ({ lesson, conflict }: Props) => {
  const lessonType = lesson.schedule.lesson_type

  return (
    <div
      className={classNames(
        'schedule-class-responsive group',
        conflict ? '' : 'w-full',
        getClassTypeClassName(lessonType)
      )}
    >
      <div className="flex h-full w-full flex-col items-center justify-between gap-8 p-4 leading-none tracking-tighter text-white">
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
            <span title="Nome da Unidade Curricular" className={classNames(conflict ? 'whitespace-nowrap' : '')}>
              {lesson.course.name}
            </span>
          </div>
          <span title="Nome da Turma">
            {lesson.schedule.composed_class_name ? lesson.schedule.composed_class_name : lesson.schedule.class_name}
          </span>
        </div>

        <div className="flex w-full items-center justify-between gap-2">
          <span title="Sala">{lesson.schedule.location}</span>
          <span title="Professor(es)" className="whitespace-nowrap">
            {lesson.schedule.professor_acronyms.join(', ')}
          </span>
        </div>
      </div>
    </div>
  )
}

export default InspectLessonBox
