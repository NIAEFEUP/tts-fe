import classNames from 'classnames'
import { CourseInfo, ClassInfo, SlotInfo } from '../../../@types/new_index'
import { convertWeekdayLong, getClassTypeClassName, getLessonBoxTime, getLessonTypeLongName } from '../../../utils'

type Props = {
  courseInfo: CourseInfo
  classInfo: ClassInfo
  slotInfo: SlotInfo
  conflict?: boolean
}

/**
 * This is the lesson box that appears on the popover when a lesson box is clicked
 */
const InspectLessonBox = ({ courseInfo, classInfo, slotInfo, conflict }: Props) => {
  const lessonType = slotInfo.lesson_type
  const professors = slotInfo.professors
    .map((prof_info) => (slotInfo.professors.length > 1 ? '- ' : '') + prof_info.name)
    .join('\n')
  const professorDescription =
    'Professor' + (slotInfo.professors.length > 1 ? 'es' : '') + ':\n' + professors
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
            <strong title="Dia">{convertWeekdayLong(slotInfo.day)}</strong>
            <strong title={getLessonTypeLongName(lessonType)}>{lessonType}</strong>
          </span>
          <span title="Duração">{getLessonBoxTime(slotInfo)}</span>
        </div>

        <div className="flex w-full flex-col items-start gap-2">
          <div className="flex w-full items-center justify-between gap-4">
            <strong title="Sigla da Unidade Curricular">{courseInfo.acronym}</strong>
            <a href={courseInfo.url} target="_blank" rel="noreferrer" className="cursor-pointer underline">
              <span title="Nome da Unidade Curricular" className={classNames(conflict ? 'whitespace-nowrap' : '')}>
                {courseInfo.name}
              </span>
            </a>
          </div>
          <span title="Nome da Turma">
            {classInfo.name}
          </span>
        </div>

        <div className="flex w-full items-center justify-between gap-2">
          <span title="Sala">{slotInfo.location}</span>
          <a
            href={slotInfo.professors_link}
            target="_blank"
            rel="noreferrer"
            className="cursor-pointer underline"
          >
            <span title={professorDescription} className="whitespace-nowrap">
              {slotInfo.professors.map((prof_info) => prof_info.acronym).join(', ')}
            </span>
          </a>
        </div>
      </div>
    </div>
  )
}

export default InspectLessonBox
