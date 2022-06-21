import classNames from 'classnames'
import { Lesson, LessonBoxRef } from '../../../@types'
import { convertWeekdayLong, getLessonBoxName, getLessonBoxTime } from '../../../utils'

type Props = {
  lesson: Lesson
  active: boolean
  conflict?: boolean
  extraClassNames?: string
}

const ResponsiveLessonBox = ({ lesson, active, conflict, extraClassNames }: Props) => {
  const type = lesson.schedule.lesson_type
  const lessonBoxRef: LessonBoxRef = {
    type: type,
    id: lesson.course.course_unit_id,
    acronym: lesson.course.acronym,
  }

  return (
    active && (
      <div
        className={classNames(
          'schedule-class-responsive',
          getLessonBoxName(lessonBoxRef, 'responsive'),
          conflict ? 'schedule-class-conflict' : '',
          type === 'T' ? 'schedule-class-t' : '',
          type === 'AL' ? 'schedule-class-al' : '',
          type === 'TP' ? 'schedule-class-tp' : '',
          type === 'OT' ? 'schedule-class-ot' : '',
          type === 'L' ? 'schedule-class-l' : ''
        )}
      >
        <div
          className={classNames(
            extraClassNames ? extraClassNames : 'text-sm',
            'p-2 leading-none tracking-tighter text-white',
            'flex h-full w-full flex-col items-center justify-between space-y-4'
          )}
        >
          <div className="flex w-full flex-col justify-between space-y-0.5">
            <span className="font-bold">{convertWeekdayLong(lesson.schedule.day)}</span>
            <span>{getLessonBoxTime(lesson.schedule)}</span>
          </div>

          <div className="flex w-full flex-col items-start space-y-1">
            <span className="font-bold">{lesson.course.acronym}</span>
            <span>{lesson.schedule.class_name ? lesson.schedule.class_name : lesson.schedule.composed_class_name}</span>
          </div>

          <div className="flex w-full items-center justify-between">
            <span>{lesson.schedule.location}</span>
            <span>{lesson.schedule.teacher_acronym}</span>
          </div>
        </div>
      </div>
    )
  )
}

export default ResponsiveLessonBox