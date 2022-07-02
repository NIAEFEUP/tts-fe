import classNames from 'classnames'
import { Lesson, LessonBoxRef } from '../../../@types'
import {
  convertWeekdayLong,
  getClassTypeClassName,
  getLessonBoxName,
  getLessonBoxTime,
  getLessonTypeLongName,
} from '../../../utils'

type Props = {
  lesson: Lesson
  conflict?: boolean
  specialClassnames?: string
}

const ResponsiveLessonBox = ({ lesson, conflict, specialClassnames }: Props) => {
  const type = lesson.schedule.lesson_type
  const lessonBoxRef: LessonBoxRef = {
    type: type,
    id: lesson.course.course_unit_id,
    acronym: lesson.course.acronym,
  }

  return (
    <div
      className={classNames(
        'schedule-class-responsive group',
        getClassTypeClassName(type),
        getLessonBoxName(lessonBoxRef, 'responsive'),
        conflict ? 'schedule-class-conflict' : ''
      )}
    >
      <div
        className={classNames(
          specialClassnames ? specialClassnames : 'text-sm',
          'p-2 leading-none tracking-tighter text-white',
          'flex h-full w-full flex-col items-center justify-between space-y-4'
        )}
      >
        <div className="flex w-full flex-col justify-between gap-0.5">
          <span className="flex w-full items-center justify-between">
            <strong>{convertWeekdayLong(lesson.schedule.day)}</strong>
            {specialClassnames ? (
              <strong title={getLessonTypeLongName(type)}>{type}</strong>
            ) : (
              <strong title={getLessonTypeLongName(type)} className="hidden group-hover:inline-flex">
                {type}
              </strong>
            )}
          </span>
          <span>{getLessonBoxTime(lesson.schedule)}</span>
        </div>

        <div className="flex w-full flex-col items-start gap-1">
          <strong>{lesson.course.acronym}</strong>
          <span>{lesson.schedule.class_name ? lesson.schedule.class_name : lesson.schedule.composed_class_name}</span>
        </div>

        <div className="flex w-full items-center justify-between gap-2">
          <span>{lesson.schedule.location}</span>
          <span className="whitespace-nowrap">{lesson.schedule.teacher_acronym}</span>
        </div>
      </div>
    </div>
  )
}

export default ResponsiveLessonBox
