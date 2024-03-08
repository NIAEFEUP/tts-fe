import classNames from 'classnames'
import { Lesson } from '../../../@types'
import {
    convertWeekdayLong,
    getClassTypeClassName,
    getLessonBoxTime,
    getLessonTypeLongName,
} from '../../../utils/utils'

type Props = {
    lesson: Lesson
    conflict?: boolean
}

const ResponsiveLessonBox = ({ lesson, conflict }: Props) => {
    const lessonType = lesson.schedule.lesson_type

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
                    'flex h-full w-full flex-col items-center justify-between gap-6'
                )}
            >
                <div className="flex w-full flex-col justify-between gap-2">
                    <span className="flex w-full items-center justify-between">
                        <strong title="Dia">{convertWeekdayLong(lesson.schedule.day)}</strong>
                        <strong title={getLessonTypeLongName(lessonType)}>{lessonType}</strong>
                    </span>
                    <span title="Duração">{getLessonBoxTime(lesson.schedule)}</span>
                </div>

                <div className="flex w-full flex-col items-start gap-2">
                    <strong title="Sigla da Unidade Curricular">{lesson.course.acronym}</strong>
                    <span title="Nome da Turma">
                        {lesson.schedule.composed_class_name ? lesson.schedule.composed_class_name : lesson.schedule.class_name}
                    </span>
                </div>

                <div className="flex w-full items-center justify-between gap-3">
                    <span title="Sala">{lesson.schedule.location}</span>
                    <span title="Professor(es)" className="whitespace-nowrap">
                        {lesson.schedule.professor_information.map((prof_info) => prof_info.acronym).join(', ')}
                    </span>
                </div>
            </div>
        </div>
    )
}

export default ResponsiveLessonBox
