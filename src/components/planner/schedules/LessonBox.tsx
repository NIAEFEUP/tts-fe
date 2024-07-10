import classNames from 'classnames'
import { useState, useMemo, useContext, useEffect } from 'react'
import { Lesson } from '../../../@types'
import {
  getClassTypeClassName,
  getLessonTypeLongName,
  getLessonBoxStyles,
  getLessonBoxTime,
  maxHour,
  minHour,
  schedulesConflict,
  conflictsSeverity,
} from '../../../utils'
import LessonPopover from './LessonPopover'
import ConflictsPopover from './ConflictsPopover'
import { ClassInfo, SlotInfo, CourseInfo, ConflictInfo, ClassDescriptor, Conflicts } from '../../../@types/new_index'
import ConflictContext from '../../../contexts/ConflictContext'

type Props = {
  courseInfo: CourseInfo
  classInfo: ClassInfo
  slotInfo: SlotInfo
  classes: ClassDescriptor[]
}

const LessonBox = ({ 
  courseInfo,
  classInfo,
  slotInfo,
  classes
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
      .map((prof_info) => (slotInfo.professors.length > 1 ? '- ' : '') + prof_info.name)
      .join('\n')
  const [inspectShown, setInspectShown] = useState(false)
  const [conflictsShown, setConflictsShown] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const {conflicts, setConflicts} = useContext(ConflictContext);
  const conflict = conflicts[slotInfo.id];
  const hasConflict = conflict?.conflictingClasses?.length > 1;

  // Needs to change the entry with the id of this lesson to contain the correct ConflictInfo when the classes change
  useEffect(() => {
    const newConflicts = conflicts;
    const aux : ConflictInfo = {
      severe: false,
      conflictingClasses: [{
        classInfo: classInfo,
        courseInfo: courseInfo,
        slotInfo: slotInfo
      }]
    };

    for (let i = 0; i < classes.length; i++) {                                // classes
      const classDescriptor = classes[i];
      for (let j = 0; j < classDescriptor.classInfo.slots.length; j++) {      // slots
        const slot = classDescriptor.classInfo.slots[j];
        if (schedulesConflict(slotInfo, slot)) {
          aux.severe = conflictsSeverity(slotInfo, slot) || aux.severe;
          const newClassDescriptor = {
            classInfo: classDescriptor.classInfo,
            courseInfo: classDescriptor.courseInfo,
            slotInfo: slot
          }
          aux.conflictingClasses.push(newClassDescriptor);
        }
      }
    }
    newConflicts[slotInfo.id] = aux;
    setConflicts(newConflicts);
  }, [classInfo, classes]);

  const showConflicts = () => {
    setConflictsShown(true)
  }

  const inspectLesson = () => {
    setInspectShown(true)
  }

  const conflictTitle = hasConflict && isHovered ? 'Aulas Sobrepostas' : ''

  return (
    <>
      {inspectShown && <LessonPopover courseInfo={courseInfo} classInfo={classInfo} slotInfo={slotInfo} isOpenHook={[inspectShown, setInspectShown]} />}
      {hasConflict && (
        <ConflictsPopover conflictsInfo={conflict} isOpenHook={[conflictsShown, setConflictsShown]} />
      )}
      {
        <button
          onClick={hasConflict ? showConflicts : inspectLesson}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          style={{
            ...getLessonBoxStyles(slotInfo, maxHour, minHour),
            backgroundColor: hasConflict && isHovered ? 'rgb(200,200,200)' : '',
          }}
          className={classNames(
            'schedule-class group',
            getClassTypeClassName(lessonType),
            hasConflict
              ? conflict.severe
                ? isHovered
                  ? 'schedule-class-conflict-info'
                  : 'schedule-class-conflict'
                : isHovered
                ? 'schedule-class-conflict-warn-info'
                : 'schedule-class-conflict-warn'
              : '',
            'overflow-hidden'
          )}
        >
          <span>
            {hasConflict && isHovered && <div
              className={`absolute top-0 left-0 w-full py-2 text-center text-xs font-extrabold xl:text-sm ${
                conflict.severe ? 'text-red-600' : 'text-amber-500'
              }`}
            >
              {conflictTitle}
              <div className="px-1 py-1 font-normal text-white">
                <ul className="flex flex-wrap justify-center gap-1">
                  {conflict.conflictingClasses
                    .sort((a, b) => (a.classInfo.name.length + a.courseInfo.acronym.length) - (b.classInfo.name.length + b.courseInfo.acronym.length))
                    .map((conflictingClass, index) => (
                      <li key={index}>
                        {`${conflictingClass.classInfo.name} (${conflictingClass.courseInfo.acronym})`}
                        {index < conflict.conflictingClasses.length - 1 ? ',' : ''}
                      </li>
                  ))}
                </ul>
              </div>
            </div>}
            

            {lgLesson && (
              <div
                className={`flex h-full w-full flex-col items-center justify-between p-1 text-xxs leading-none tracking-tighter text-white 
              ${conflictTitle ? 'group-hover:blur-md' : ''} lg:p-1.5 xl:text-xs 2xl:p-2 2xl:text-xs`}
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
                    {slotInfo.professors.map((prof_info) => prof_info.acronym).join(', ')}
                  </span>
                </div>
              </div>
            )}
            {mdLesson && (
              <div
                className={`flex h-full w-full flex-col items-center justify-between px-1 py-0.5 text-[0.55rem] tracking-tighter ${
                  conflictTitle ? 'group-hover:blur-md' : ''
                } 
              xl:text-xxs 2xl:px-1 2xl:py-0.5 2xl:text-[0.68rem]`}
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
                    {slotInfo.professors.map((prof_info) => prof_info.acronym).join(', ')}
                  </span>
                </div>
              </div>
            )}
            {smLesson && (
              <div
                className={`flex h-full w-full items-center justify-between gap-1 px-1 py-0.5 text-[0.55rem] tracking-tighter 
                ${conflictTitle ? 'group-hover:blur-md' : ''} xl:text-xxs 2xl:px-1 2xl:py-1 2xl:text-[0.6rem]`}
              >
                <span title="Duração">{timeSpan}</span>
                <span title="Sala">{slotInfo.location}</span>
                <span title={professorDescription} className="truncate">
                  {slotInfo.professors.map((prof_info) => prof_info.acronym).join(', ')}
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
