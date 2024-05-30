import classNames from 'classnames'
import { useState, useMemo } from 'react'
import { Lesson } from '../../../@types'
import {
  getClassTypeClassName,
  getLessonTypeLongName,
  getLessonBoxStyles,
  getLessonBoxTime,
  maxHour,
  minHour,
} from '../../../utils'
import LessonPopover from './LessonPopover'
import ConflictsPopover from './ConflictsPopover'
import { ClassInfo, SlotInfo, CourseInfo, ConflictInfo } from '../../../@types/new_index'

type Props = {
  courseInfo: CourseInfo
  classInfo: ClassInfo
  slotInfo: SlotInfo
  conflictsInfo: Array<ConflictInfo>
}

const LessonBox = ({ 
  courseInfo,
  classInfo,
  slotInfo,
  conflictsInfo
 }: Props) => {
  const classTitle = classInfo.name
  const lessonType = slotInfo.lesson_type
  const timeSpan = getLessonBoxTime(slotInfo)
  const duration = slotInfo.duration
  const smLesson = duration < 1
  const lgLesson = duration >= 2
  const mdLesson = !smLesson && !lgLesson
  const professorDescription =
    'Professor' +
    (slotInfo.professors.length > 1 ? 'es' : '') +
    ':\n' +
    slotInfo.professors
      .map((prof_info) => (slotInfo.professors.length > 1 ? '- ' : '') + prof_info.professor_name)
      .join('\n')

  const [inspectShown, setInspectShown] = useState(false)
  const [conflictsShown, setConflictsShown] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  // const severe = useMemo(() => {
  //   if (slotInfo.type === 'T') return false
  //   return conflictsInfo.some((conflict) => conflict.slotInfo.type !== 'T')
  // }, [conflictsInfo, slotInfo.type])

  // const conflictTitle = conflict && isHovered ? 'Aulas Sobrepostas' : ''
  // const conflictedLessonsInfo = useMemo(() => {
  //   if (!conflicts) return []

  //   return conflicts.map((conflictLesson) => ({
  //     name: conflictLesson.course.acronym,
  //     type: conflictLesson.schedule.lesson_type,
  //   }))
  // }, [conflicts])

  const showConflicts = () => {
    setConflictsShown(true)
  }

  const inspectLesson = () => {
    setInspectShown(true)
  }

  return (
    <>
      {/* {inspectShown && <LessonPopover info={info} isOpenHook={[inspectShown, setInspectShown]} />}
      {conflictsInfo.length > 0 && (
        <ConflictsPopover info={info} conflictsInfo={conflictsInfo} isOpenHook={[conflictsShown, setConflictsShown]} />
      )} */}
      {
        <button
          onClick={conflictsInfo.length > 0 ? showConflicts : inspectLesson}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            ...getLessonBoxStyles(slotInfo, maxHour, minHour),
            // backgroundColor: conflict && isHovered ? 'rgb(200,200,200)' : '',
          }}
          className={classNames(
            'schedule-class group',
            getClassTypeClassName(lessonType),
            // conflict
            //   ? severe
            //     ? isHovered
            //       ? 'schedule-class-conflict-info'
            //       : 'schedule-class-conflict'
            //     : isHovered
            //     ? 'schedule-class-conflict-warn-info'
            //     : 'schedule-class-conflict-warn'
            //   : ''
          )}
        >
          <span>
            {/* <div
              className={`absolute top-0 left-0 w-full py-2 text-center text-xs font-extrabold xl:text-sm ${
                severe ? 'text-red-600' : 'text-amber-500'
              }`}
            >
              {conflictTitle}
              <div className="px-1 py-1 text-center text-xs font-normal text-white xl:text-sm">
                <ul className="flex flex-wrap justify-center gap-2">
                  {conflictedLessonsInfo.map((conflictInfo, index) => (
                    <li key={index}>
                      {`${conflictInfo.name} (${conflictInfo.type})`}
                      {index < conflictedLessonsInfo.length - 1 ? ',' : ''}
                    </li>
                  ))}
                </ul>
              </div>
            </div> */}

            {lgLesson && (
              <div
                className={`flex h-full w-full flex-col items-center justify-between p-1 text-xxs leading-none tracking-tighter text-white 
                  lg:p-1.5 xl:text-xs 2xl:p-2 2xl:text-xs`}
              //   className={`flex h-full w-full flex-col items-center justify-between p-1 text-xxs leading-none tracking-tighter text-white 
              // ${conflictTitle ? 'group-hover:blur-md' : ''} lg:p-1.5 xl:text-xs 2xl:p-2 2xl:text-xs`}
              >
                {/* Top */}
                <div className="flex w-full items-center justify-between">
                  <span title="Duração">{timeSpan}</span>
                  <strong title={getLessonTypeLongName(lessonType)}>{lessonType}</strong>
                </div>

                {/* Middle */}
                <div className="flex w-full items-center justify-between gap-1">
                  <span title={`${courseInfo.name} (${courseInfo.acronym})`} className="font-semibold">
                    {courseInfo.acronym}
                  </span>
                  {
                    <span title="Nome da turma" className="truncate">
                      {
                        // You won't believe what was here before
                        classTitle
                      } 
                    </span>
                  }
                </div>

                {/* Bottom */}
                <div className="flex w-full items-center justify-between gap-1">
                  <span title="Sala">{slotInfo.location}</span>
                  <span title={professorDescription} className="truncate">
                    {slotInfo.professors.map((prof_info) => prof_info.professor_acronym).join(', ')}
                  </span>
                </div>
              </div>
            )}
            {mdLesson && (
              <div
              //   className={`flex h-full w-full flex-col items-center justify-between px-1 py-0.5 text-[0.55rem] tracking-tighter ${
              //     conflictTitle ? 'group-hover:blur-md' : ''
              //   } 
              // xl:text-xxs 2xl:px-1 2xl:py-0.5 2xl:text-[0.68rem]`}
                className={`flex h-full w-full flex-col items-center justify-between px-1 py-0.5 text-[0.55rem] tracking-tighter xl:text-xxs 2xl:px-1 2xl:py-0.5 2xl:text-[0.68rem]`}
              >
                <div className="flex w-full items-center justify-between gap-1">
                  <span title="Duração">
                    {timeSpan} (<strong title={getLessonTypeLongName(lessonType)}>{lessonType}</strong>)
                  </span>
                  <span title={`${classInfo.name} (${courseInfo.acronym})`} className="font-semibold">
                    {courseInfo.acronym}
                  </span>
                </div>

                <div className="flex w-full items-center justify-between gap-2">
                  <span title="Sala">{slotInfo.location}</span>
                  <span title="Turma">{classTitle}</span>
                  <span title={professorDescription} className="truncate">
                    {slotInfo.professors.map((prof_info) => prof_info.professor_acronym).join(', ')}
                  </span>
                </div>
              </div>
            )}
            {smLesson && (
              <div
                className={`flex h-full w-full items-center justify-between gap-1 px-1 py-0.5 text-[0.55rem] tracking-tighter xl:text-xxs 2xl:px-1 2xl:py-1 2xl:text-[0.6rem]`}
                // className={`flex h-full w-full items-center justify-between gap-1 px-1 py-0.5 text-[0.55rem] tracking-tighter 
                // ${conflictTitle ? 'group-hover:blur-md' : ''} xl:text-xxs 2xl:px-1 2xl:py-1 2xl:text-[0.6rem]`}
              >
                <span title="Duração">{timeSpan}</span>
                <span title="Sala">{slotInfo.location}</span>
                <span title={professorDescription} className="truncate">
                  {slotInfo.professors.map((prof_info) => prof_info.professor_acronym).join(', ')}
                </span>
              </div>
            )}
          </span>
        </button>
      }
    </>
  )
}

export default LessonBox
