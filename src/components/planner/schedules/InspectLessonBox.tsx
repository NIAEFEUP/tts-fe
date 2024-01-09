import classNames from 'classnames'
import { Lesson } from '../../../@types'
import { convertWeekdayLong, getClassTypeClassName, getLessonBoxTime, getLessonTypeLongName } from '../../../utils'

type Props = {
  lesson: Lesson
  conflict?: boolean
}

const InspectLessonBox = ({ lesson, conflict }: Props) => {
  const lessonType = lesson.schedule.lesson_type
  const professors = lesson.schedule.professor_information
    .map((prof_info) => (lesson.schedule.professor_information.length > 1 ? '- ' : '') + prof_info.name)
    .join('\n')
  const professorDescription =
    'Professor' + (lesson.schedule.professor_information.length > 1 ? 'es' : '') + ':\n' + professors
  return (
    <div
      className={classNames(
        'schedule-class-responsive group',
        conflict ? '' : 'w-full',
        getClassTypeClassName(lessonType)
      )}
    >
      <div className="flex flex-col items-center justify-between w-full h-full gap-8 p-4 leading-none tracking-tighter text-white">
        <div className="flex flex-col justify-between w-full gap-2">
          <span className="flex items-center justify-between w-full">
            <strong title="Dia">{convertWeekdayLong(lesson.schedule.day)}</strong>
            <strong title={getLessonTypeLongName(lessonType)}>{lessonType}</strong>
          </span>
          <span title="Duração">{getLessonBoxTime(lesson.schedule)}</span>
        </div>

        <div className="flex flex-col items-start w-full gap-2">
          <div className="flex items-center justify-between w-full gap-4">
            <strong title="Sigla da Unidade Curricular">{lesson.course.acronym}</strong>
            <a
              href={lesson.course.url}
              target="_blank"
              rel="noreferrer"
              className="underline cursor-pointer"
            >
              <span title="Nome da Unidade Curricular" className={classNames(conflict ? 'whitespace-nowrap' : '')}>
                {lesson.course.name}
              </span>
            </a>
          </div>
          <span title="Nome da Turma">
            {lesson.schedule.composed_class_name ? lesson.schedule.composed_class_name : lesson.schedule.class_name}
          </span>
        </div>

        <div className="flex items-center justify-between w-full gap-2">
          <span title="Sala">{lesson.schedule.location}</span>
          <a
            href={lesson.schedule.professors_link}
            target="_blank"
            rel="noreferrer"
            className="underline cursor-pointer"
          >
            <span title={professorDescription} className="whitespace-nowrap">
              {lesson.schedule.professor_information.map((prof_info) => prof_info.acronym).join(', ')}
            </span>
          </a>
        </div>
      </div>
    </div>
  )
}

export default InspectLessonBox
