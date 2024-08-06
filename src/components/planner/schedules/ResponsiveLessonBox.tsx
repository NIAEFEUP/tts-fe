import classNames from 'classnames'
import { convertWeekdayLong, getClassTypeClassName, getLessonBoxTime, getLessonTypeLongName } from '../../../utils'
import { ClassInfo, CourseInfo, SlotInfo } from '../../../@types'

type Props = {
  courseInfo: CourseInfo
  classInfo: ClassInfo
  slotInfo: SlotInfo
  conflict?: boolean
}

const ResponsiveLessonBox = ({ 
  courseInfo,
  classInfo,
  slotInfo,
  conflict 
}: Props) => {
  const lessonType = slotInfo.lesson_type

  return (
    <div
      className={classNames(
        'schedule-class-responsive group',
        getClassTypeClassName(lessonType),
        conflict ? 'schedule-class-conflict' : ''
      )}
    >
      <div
        className={classNames(
          'p-2 text-sm leading-none tracking-tighter text-white',
          'flex h-full w-full flex-col items-center justify-between gap-4'
        )}
      >
        <div className='flex w-full justify-between gap-2'>
          <strong title="Sigla da Unidade Curricular" className='text-lg'>{courseInfo.acronym}</strong>
          <span title={getLessonTypeLongName(lessonType)} className='text-lg'>{lessonType}</span>
        </div>

        <div className="flex flex-col">
          <span title="Duração">{getLessonBoxTime(slotInfo)}</span>
          <span title="Nome da Turma">
            {classInfo.name}
          </span>
        </div>

        <div className='flex w-full justify-between'>
          <span title="Sala">{slotInfo.location}</span>
          <span title="Professor(es)" className="whitespace-nowrap">
            {slotInfo.professors.map((prof_info) => prof_info.acronym).join(', ')}
          </span>
        </div>
        
        <div className="flex w-full flex-col justify-between gap-2">
          <span className="flex w-full items-center justify-between">
            <strong title="Dia">{convertWeekdayLong(slotInfo.day)}</strong>
            <strong title={getLessonTypeLongName(lessonType)}>{lessonType}</strong>
          </span>
          <span title="Duração">{getLessonBoxTime(slotInfo)}</span>
        </div>

        <div className="flex w-full flex-col items-start gap-2">
          <strong title="Sigla da Unidade Curricular">{courseInfo.acronym}</strong>
          <span title="Nome da Turma">
            {classInfo.name}
          </span>
        </div>

        <div className="flex w-full items-center justify-between gap-3">
          <span title="Sala">{slotInfo.location}</span>
          <span title="Professor(es)" className="whitespace-nowrap">
            {slotInfo.professors.map((prof_info) => prof_info.acronym).join(', ')}
          </span>
        </div>
       
        
      </div>
    </div>
  )
}

export default ResponsiveLessonBox
