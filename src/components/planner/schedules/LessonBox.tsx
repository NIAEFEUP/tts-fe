import classNames from 'classnames'
import { useState } from 'react'
import { Lesson, LessonBoxRef } from '../../../@types'
import {
  getClassTypeClassName,
  getLessonTypeLongName,
  getLessonBoxName,
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
  const longLesson = parseFloat(lesson.schedule.duration) > 1
  const lessonBoxRef: LessonBoxRef = {
    type: lessonType,
    id: lesson.course.course_unit_id,
    acronym: lesson.course.acronym,
  }

  const [inspectShown, setInspectShown] = useState(false)
  const [conflictsShown, setConflictsShown] = useState(false)

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
          style={getLessonBoxStyles(lesson, maxHour, minHour)}
          className={classNames(
            'schedule-class group',
            getClassTypeClassName(lessonType),
            getLessonBoxName(lessonBoxRef),
            conflict ? 'schedule-class-conflict' : ''
          )}
        >
          {longLesson ? (
            <div className="flex h-full w-full flex-col items-center justify-between p-1 text-xxs leading-none tracking-tighter text-white lg:p-1.5 xl:text-xs 2xl:p-2 2xl:text-[0.8rem]">
              {/* Top */}
              <div className="flex w-full items-center justify-between">
                <span>{timeSpan}</span>
                <strong title={getLessonTypeLongName(lessonType)}>
                  {/*className="hidden group-hover:inline-flex"*/}
                  {lessonType}
                </strong>
              </div>

              {/* Middle */}
              <div className="flex w-full items-center justify-between gap-1">
                <span className="font-semibold">{lesson.course.acronym}</span>
                {
                  // prioritize composed class name when loading theoretical lessons
                  <span className="truncate">
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
                <span>{lesson.schedule.location}</span>
                <span className="truncate">{lesson.schedule.teacher_acronym}</span>
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
                <span>{compClassTitle ? compClassTitle : classTitle}</span>
                <span className="truncate">{lesson.schedule.teacher_acronym}</span>
              </div>
            </div>
          )}
        </button>
      )}
    </>
  )
}

export default LessonBox
