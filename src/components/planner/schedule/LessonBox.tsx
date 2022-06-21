import classNames from 'classnames'
import { Lesson } from '../../../@types'
import { getLessonBoxName, getLessonBoxStyles, getLessonBoxTime, maxHour, minHour } from '../../../utils'

type Props = {
  lesson: Lesson
  active: boolean
  conflict?: boolean
}

const LessonBox = ({ lesson, active, conflict }: Props) => {
  const timeSpan = getLessonBoxTime(lesson.schedule)

  return (
    active && (
      <div
        style={getLessonBoxStyles(lesson, maxHour, minHour)}
        className={classNames(
          'schedule-class',
          getLessonBoxName(lesson),
          conflict ? 'schedule-class-conflict' : '',
          lesson.schedule.lesson_type === 'T' ? 'schedule-class-t' : '',
          lesson.schedule.lesson_type === 'P' ? 'schedule-class-lab' : '',
          lesson.schedule.lesson_type === 'TP' ? 'schedule-class-tp' : ''
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
      </div>
    )
  )
}

export default LessonBox
