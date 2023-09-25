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

type Props = {
  lesson: Lesson
  active: boolean
  conflict?: boolean
  conflicts?: Lesson[]
}

const LessonBox = ({ lesson, active, conflict, conflicts }: Props) => {
  const classTitle = lesson.schedule.class_name
  const compClassTitle = lesson.schedule.composed_class_name
  const lessonType = lesson.schedule.lesson_type
  const timeSpan = getLessonBoxTime(lesson.schedule)
  const duration = parseFloat(lesson.schedule.duration)
  const smLesson = duration < 1
  const lgLesson = duration >= 2
  const mdLesson = !smLesson && !lgLesson
  const professors = lesson.schedule.professor_information
    .map((prof_info) => (lesson.schedule.professor_information.length > 1 ? '- ' : '') + prof_info.name)
    .join('\n')
  const professorDescription =
    'Professor' + (lesson.schedule.professor_information.length > 1 ? 'es' : '') + ':\n' + professors

  const [inspectShown, setInspectShown] = useState(false)
  const [conflictsShown, setConflictsShown] = useState(false)
  const [isHovered, setIsHovered] = useState(false);
  const severe = useMemo(() => conflicts?.filter((item) => item.schedule.lesson_type !== 'T').length > 1, [conflicts])
/*
  const isOverlapping = useMemo(() => {
    if (!conflicts) return false;
    return conflicts.some((conflictLesson) => {
      const conflictStartTime = getLessonBoxTime(conflictLesson.schedule);
      const conflictEndTime = conflictLesson.schedule.start_time + conflictLesson.schedule.duration;
      const lessonStartTime = getLessonBoxTime(lesson.schedule);
      const lessonEndTime = lesson.schedule.start_time + conflictLesson.schedule.duration;
      return (
        (lessonStartTime >= conflictStartTime && lessonStartTime < conflictEndTime) ||
        (lessonEndTime > conflictStartTime && lessonEndTime <= conflictEndTime) ||
        (lessonStartTime <= conflictStartTime && lessonEndTime >= conflictEndTime)
      );
    });
  }, [conflicts, lesson.schedule]);

  const earliestStartTime = useMemo(() => {
    if (!conflicts) return null;

    return conflicts.reduce((earliestStart, conflictLesson) => {
      const startTime = getLessonBoxTime(conflictLesson.schedule);
      return startTime < String(earliestStart) ? startTime : earliestStart;
    }, Number.POSITIVE_INFINITY);
  }, [conflicts]);

  const hasEarliestStartTime = useMemo(() => {
    if (!conflicts) return false;
    return getLessonBoxTime(lesson.schedule) === earliestStartTime;
  }, [conflicts, earliestStartTime, lesson.schedule]);
  */
  const conflictTitle = conflict && isHovered ? 'HORÁRIOS SOBREPOSTOS' : '';
  const conflictedLessonsInfo = useMemo(() => {
    if (!conflicts) return [];

    return conflicts.map((conflictLesson) => ({
      name: conflictLesson.course.acronym,
      type: conflictLesson.schedule.lesson_type,
    }));
  }, [conflicts]);


  const showConflicts = () => {
    setConflictsShown(true)
  }

  const inspectLesson = () => {
    setInspectShown(true)
  }



  return (
    <>
      {inspectShown && <LessonPopover lesson={lesson} isOpenHook={[inspectShown, setInspectShown]} />}
      {conflict && <ConflictsPopover lessons={conflicts} isOpenHook={[conflictsShown, setConflictsShown]} />}
      {active && (
        <button
          onClick={conflict ? showConflicts : inspectLesson}
          onMouseEnter={() => setIsHovered(true)} 
          onMouseLeave={() => setIsHovered(false)} 
          style={{
            ...getLessonBoxStyles(lesson, maxHour, minHour),
            backgroundColor: conflict && isHovered ? 'rgb(200,200,200)' : '',
          }}
          className={classNames(
            'schedule-class group',
            getClassTypeClassName(lessonType),
            conflict ? (severe ? (isHovered? 'schedule-class-conflict-info' : 'schedule-class-conflict')
                                  :(isHovered? 'schedule-class-conflict-warn-info' : 'schedule-class-conflict-warn')) : ''
          )}
          
        >
          <span>


            {severe? (conflictTitle && (
              <div className="absolute top-0 left-0 w-full text-red-700 text-center text-sm py-2 font-extrabold">
                {conflictTitle} 
                <div className="px-1 py-1 text-black text-left text-sm font-normal">
                  <ul className="list-disc pl-5">
                  {conflictedLessonsInfo.map((conflictInfo, index) => (
                    <li key={index}>
                      {`${conflictInfo.name} (${conflictInfo.type})`}
                    </li>
                  ))}
                  </ul>
                </div>
              </div>
              )): 
              (conflictTitle && (
                <div className="absolute top-0 left-0 w-full text-amber-700 text-center text-sm py-2 font-extrabold">
                  {conflictTitle} 
                  <div className="px-1 py-1 text-black text-left text-sm font-normal">
                    <ul className="list-disc pl-5">
                    {conflictedLessonsInfo.map((conflictInfo, index) => (
                      <li key={index}>
                        {`${conflictInfo.name} (${conflictInfo.type})`}
                      </li>
                    ))}
                    </ul>
                  </div>
                </div>)

            )}
          {lgLesson && (
            <div
              className="flex h-full w-full flex-col items-center justify-between p-1 text-xxs leading-none tracking-tighter 
              text-white lg:p-1.5 xl:text-xs 2xl:p-2 2xl:text-xs"
            >
              {/* Top */}
              <div className="flex w-full items-center justify-between">
                <span title="Duração">{timeSpan}</span>
                <strong title={getLessonTypeLongName(lessonType)}>{lessonType}</strong>
              </div>

              {/* Middle */}
              <div className="flex w-full items-center justify-between gap-1">
                <span title={`${lesson.course.name} (${lesson.course.acronym})`} className="font-semibold">
                  {lesson.course.acronym}
                </span>
                {
                  <span title="Nome da turma" className="truncate">
                    {lessonType === 'T'
                      ? compClassTitle
                        ? compClassTitle
                        : classTitle
                      : classTitle
                      ? classTitle
                      : compClassTitle}
                  </span>
                }
              </div>

              {/* Bottom */}
              <div className="flex w-full items-center justify-between gap-1">
                <span title="Sala">{lesson.schedule.location}</span>
                <span title={professorDescription} className="truncate">
                  {lesson.schedule.professor_information.map((prof_info) => prof_info.acronym).join(', ')}
                </span>
              </div>
            </div>
          )}
          {mdLesson && (
            <div className="flex h-full w-full flex-col items-center justify-between px-1 py-0.5 text-[0.55rem] tracking-tighter xl:text-xxs 2xl:px-1 2xl:py-0.5 2xl:text-[0.68rem]">
              <div className="flex w-full items-center justify-between gap-1">
                <span title="Duração">
                  {timeSpan} (<strong title={getLessonTypeLongName(lessonType)}>{lessonType}</strong>)
                </span>
                <span title={`${lesson.course.name} (${lesson.course.acronym})`} className="font-semibold">
                  {lesson.course.acronym}
                </span>
              </div>

              <div className="flex w-full items-center justify-between gap-2">
                <span title="Sala">{lesson.schedule.location}</span>
                <span title="Turma">{compClassTitle ? compClassTitle : classTitle}</span>
                <span title={professorDescription} className="truncate">
                  {lesson.schedule.professor_information.map((prof_info) => prof_info.acronym).join(', ')}
                </span>
              </div>
            </div>
          )}
          {smLesson && (
            <div className="flex h-full w-full items-center justify-between gap-1 px-1 py-0.5 text-[0.55rem] tracking-tighter xl:text-xxs 2xl:px-1 2xl:py-1 2xl:text-[0.6rem]">
              <span title="Duração">{timeSpan}</span>
              <span title="Sala">{lesson.schedule.location}</span>
              <span title={professorDescription} className="truncate">
                {lesson.schedule.professor_information.map((prof_info) => prof_info.acronym).join(', ')}
              </span>
            </div>
          )}
          </span>
        </button>
      )}
    </>
  )
}

export default LessonBox
