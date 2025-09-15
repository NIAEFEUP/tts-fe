import classNames from 'classnames'
import { useState, useEffect, useContext } from 'react'
import LessonPopover from './LessonPopover'
import ConflictsPopover from './ConflictsPopover'
import { CourseInfo, ClassInfo, SlotInfo, ClassDescriptor, ConflictInfo } from '../../../@types'
import { getLessonBoxTime, schedulesConflict, conflictsSeverity, getLessonBoxStyles, maxHour, minHour, getClassTypeClassName, getLessonTypeLongName } from '../../../utils'
import ConflictsContext from '../../../contexts/ConflictsContext'
import ScheduleContext from '../../../contexts/ScheduleContext'

type Props = {
  courseInfo: CourseInfo
  classInfo: ClassInfo
  slotInfo: SlotInfo
  classes: ClassDescriptor[]
  setLessonBoxConflict: (courseId: number, conflictData: boolean) => void
}

const LessonBox = ({
  courseInfo,
  classInfo,
  slotInfo,
  classes,
  setLessonBoxConflict
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

  const conflicts = [];
  const [inspectShown, setInspectShown] = useState(false)
  const [conflictsShown, setConflictsShown] = useState(false) // Controls if the popover showing the conflicts appear
  const [isHovered, setIsHovered] = useState(false)
  const [conflict, setConflict] = useState(conflicts[slotInfo.id]);
  const hasConflict = conflict?.conflictingClasses?.length > 1;
  const { tClassConflicts } = useContext(ConflictsContext);
  const {originalExchangeSchedule} = useContext(ScheduleContext);

  // Needs to change the entry with the id of this lesson to contain the correct ConflictInfo when the classes change
  useEffect(() => {
    const newConflictInfo: ConflictInfo = {
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
          // The highest severity of the all the conflicts is the overall severity
          newConflictInfo.severe = conflictsSeverity(slotInfo, slot, tClassConflicts) == 2 || newConflictInfo.severe;
          const newClassDescriptor = {
            classInfo: classDescriptor.classInfo,
            courseInfo: classDescriptor.courseInfo,
            slotInfo: slot
          }
          newConflictInfo.conflictingClasses.push(newClassDescriptor);
        }
      }
    }

    const hasNewClasses = !newConflictInfo.conflictingClasses.every((conflictingClass) => originalExchangeSchedule.some((originalClass) => originalClass.classInfo.id === conflictingClass.classInfo.id));

    if(!hasNewClasses && newConflictInfo.severe) {
      newConflictInfo.severe = false;
    }

    setConflict(newConflictInfo);
  }, [classInfo, classes, hasConflict]);

  useEffect(() => {
    if (conflict?.severe !== undefined){
      setLessonBoxConflict(courseInfo.id, conflict?.severe);
    }
  }, [classInfo]);

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
              className={`absolute top-0 left-0 w-full py-2 text-center text-xs font-extrabold xl:text-sm ${conflict.severe ? 'text-red-600' : 'text-amber-500'
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
                className={`flex h-full w-full flex-col items-center justify-between px-1 py-0.5 text-[0.55rem] tracking-tighter ${conflictTitle ? 'group-hover:blur-md' : ''
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
