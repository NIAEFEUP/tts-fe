import classNames from 'classnames'
import { useState } from 'react'
import { Lesson, LessonBoxRef } from '../../../@types'
import { getLessonBoxName, getLessonBoxStyles, getLessonBoxTime, maxHour, minHour } from '../../../utils'
import ConflictsPopover from './ConflictsPopover'

type Props = {
  lesson: Lesson
  active: boolean
  conflict?: boolean
  conflicts?: Lesson[]
}

const LessonBox = ({ lesson, active, conflict, conflicts }: Props) => {
  const type = lesson.schedule.lesson_type
  const timeSpan = getLessonBoxTime(lesson.schedule)
  const lessonBoxRef: LessonBoxRef = {
    type: type,
    id: lesson.course.course_unit_id,
    acronym: lesson.course.acronym,
  }

  const [conflictsShown, setConflictsShown] = useState(false)
  const showConflicts = () => {
    if (!conflict) return
    setConflictsShown(true)
  }

  return (
    <>
      {conflict && <ConflictsPopover lessons={conflicts} isOpenHook={[conflictsShown, setConflictsShown]} />}
      {active && (
        <button
          onClick={showConflicts}
          style={getLessonBoxStyles(lesson, maxHour, minHour)}
          className={classNames(
            'schedule-class',
            getLessonBoxName(lessonBoxRef),
            conflict ? 'schedule-class-conflict' : 'schedule-class-conflict-none',
            type === 'T' ? 'schedule-class-t' : '',
            type === 'AL' ? 'schedule-class-al' : '',
            type === 'TP' ? 'schedule-class-tp' : '',
            type === 'OT' ? 'schedule-class-ot' : '',
            type === 'L' ? 'schedule-class-l' : ''
          )}
        >
          {lesson.schedule.duration > 1 ? (
            <div className="flex h-full w-full flex-col items-center justify-between p-1 text-xxs leading-none tracking-tighter text-white lg:p-1.5 xl:text-xs 2xl:p-2 2xl:text-sm">
              <div className="flex w-full items-center justify-between">
                <span>{timeSpan}</span>
              </div>

              <div className="flex w-full items-center justify-between">
                <span className="font-semibold">{lesson.course.acronym}</span>
                <span>
                  {lesson.schedule.class_name ? lesson.schedule.class_name : lesson.schedule.composed_class_name}
                </span>
              </div>

              <div className="flex w-full items-center justify-between">
                <span>{lesson.schedule.location}</span>
                <span>{lesson.schedule.teacher_acronym}</span>
              </div>
            </div>
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-between p-0.5 text-[0.5rem] tracking-tighter xl:text-xxs 2xl:p-1 2xl:text-xs">
              <div className="flex w-full items-center justify-between">
                <span>{timeSpan}</span>
                <span className="font-semibold">{lesson.course.acronym}</span>
              </div>

              <div className="flex w-full items-center justify-between">
                <span>{lesson.schedule.location}</span>
                <span>
                  {lesson.schedule.class_name ? lesson.schedule.class_name : lesson.schedule.composed_class_name}
                </span>
                <span>{lesson.schedule.teacher_acronym}</span>
              </div>
            </div>
          )}
        </button>
      )}
    </>
  )
}

export default LessonBox
