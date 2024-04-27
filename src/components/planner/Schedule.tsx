import '../../styles/schedule.css'
import classNames from 'classnames'
import { useMemo, useRef, useState } from 'react'
import { Lesson, CourseOption } from '../../@types'
import { ScheduleGrid, LessonBox, ResponsiveLessonBox } from './schedules'
import { minHour, maxHour, convertHour, convertWeekdayLong, timesCollide } from '../../utils/utils'
import { useShowGrid } from '../../hooks'
import ToggleScheduleGrid from './schedule/ToggleScheduleGrid'
import PrintSchedule from './schedule/PrintSchedule'

type Props = {
    courseOptions: CourseOption[]
}

const Schedule = ({ courseOptions }: Props) => {
    const scheduleRef = useRef(null)
    const lessonTypesDic = {
        T: 'Teórica',
        TP: 'Teórico-Prática',
        PL: 'Prática Laboratorial',
        OT: 'Orientação Tutorial',
        S: 'Seminário',
        P: 'Prática',
        TC: 'Teórica de Campo',
        O: 'Outros',
    }

    const dayValues = Array.from({ length: 6 }, (_, i) => i)
    const hourValues = Array.from({ length: maxHour - minHour + 1 }, (_, i) => minHour + i)

    const subjects = useMemo(() => {
        const classes = courseOptions.filter((item) => item.option !== null)

        const chosenSubjects = classes.map((subject, subjectIdx) => ({
            shown: subject.shown,
            course: subject.course.info,
            // A course schedule, may have more than one practical class.
            practicalLesson: classes.map((item) =>
                item.schedules.filter((elem) => elem.lesson_type !== 'T' && elem.class_name === subject.option.class_name)
            )[subjectIdx],
            // A course schedule, may have more than one theoretical class.
            theoreticalLessons: classes.map((item) =>
                item.schedules.filter((elem) => elem.lesson_type === 'T' && elem.class_name === subject.option.class_name)
            )[subjectIdx],
        }))
        return chosenSubjects
    }, [courseOptions])

    const lessons = useMemo(() => {
        let lessonsAcc: Lesson[] = []

        subjects.forEach((subject) => {
            if (subject.shown.T) {
                subject.theoreticalLessons.forEach((lesson) => lessonsAcc.push({ course: subject.course, schedule: lesson }))
            }

            if (subject.shown.TP) {
                subject.practicalLesson.forEach((lesson) => lessonsAcc.push({ course: subject.course, schedule: lesson }))
            }
        })

        lessonsAcc.sort((first, second) => {
            if (first.schedule.day === second.schedule.day)
                return parseFloat(first.schedule.start_time) > parseFloat(second.schedule.start_time) ? -1 : 1
            else return first.schedule.day > second.schedule.day ? 1 : -1
        })
        return lessonsAcc
    }, [subjects])

    const lessonTypes = useMemo(() => {
        let lessonTypesAcc = []

        lessons.forEach((lesson) => {
            if (!lessonTypesAcc.includes(lesson.schedule.lesson_type)) {
                lessonTypesAcc.push(lesson.schedule.lesson_type)
            }
        })

        // Same order every time
        lessonTypesAcc.sort((first, second) => {
            return Object.keys(lessonTypesDic).indexOf(first) > Object.keys(lessonTypesDic).indexOf(second) ? 1 : -1
        })

        return lessonTypesAcc
    }, [lessons, lessonTypesDic])

    const [hiddenLessonsTypes, setHiddenLessonsTypes] = useState<String[]>([])

    /**
     * Find conflicts among classes between classes.
     * Consider that the classes are ordered in ascending order by the start_time.
     * The final result is a matrix o schedules, where conflictuos classes are grouped together.
     *
     * Example:
     * => AMAT:   09h00 ~ 11h00
     * => RC:     11h00 ~ 12h00
     * => TC:     11h00 ~ 13h00
     *
     * 1st iteraction: acc = [AMAT]
     * 2nd iteraction: acc = [RC], conflictsAcc = [[AMAT]]
     * 3rd iteraction: acc = [RC, TC], conflictsAcc = [[AMAT], [RC, TC]]
     */
    const conflicts = useMemo(() => {
        let acc = []
        let conflictsAcc = []

        for (let i = 0; i < lessons.length; i++) {
            const curLesson = lessons[i]
            if (acc.length === 0) {
                acc.push(curLesson)
                if (i === lessons.length - 1) {
                    conflictsAcc.push(acc)
                }
                continue
            }

            let collidesWithAll = true
            for (let j = 0; j < acc.length; j++) {
                const curAccLesson = acc[j]
                if (!timesCollide(curLesson.schedule, curAccLesson.schedule)) {
                    collidesWithAll = false
                    break
                }
            }
            if (collidesWithAll) {
                acc.push(curLesson)
            } else {
                conflictsAcc.push(acc)
                acc = [curLesson]
            }
            if (i === lessons.length - 1) conflictsAcc.push(acc)
        }
        return conflictsAcc
    }, [lessons])

    const lessonsGroupedByDays = useMemo(() => {
        let i = 0
        let j = 0
        let lessonsAcc = []

        while (i < lessons.length) {
            let acc = []
            while (j < lessons.length && lessons[i].schedule.day === lessons[j].schedule.day) {
                acc.unshift(lessons[j])
                j++
            }
            i = j
            lessonsAcc.push(acc)
        }

        return lessonsAcc
    }, [lessons])

    const [showGrid, setShowGrid] = useShowGrid()

    return (
        <>
            {/* Schedule Desktop */}
            <div ref={scheduleRef} className="schedule-area gap-2">
                <div className="schedule-top">
                    <div className="schedule-top-empty">
                        <span className="dummy">00:00</span>
                    </div>
                    <div className="schedule-top-days">
                        {dayValues.map((day: number, dayLabelIdx: number) => (
                            <span key={`day-label-${dayLabelIdx}`}>{convertWeekdayLong(day)}</span>
                        ))}
                    </div>
                </div>

                <div className="schedule-main">
                    <div className="schedule-main-left">
                        {hourValues.map((hour: number, hourLabelIdx: number) => (
                            <span key={`hour-label-${hourLabelIdx}`}>{convertHour(hour.toString())}</span>
                        ))}
                    </div>
                    <div className="schedule-main-right">
                        <div className={classNames('schedule-grid-wrapper', showGrid ? 'show-grid-yes' : 'show-grid-no')}>
                            <ScheduleGrid showGrid={showGrid} />
                            <div className="schedule-classes">
                                {lessons.length === conflicts.length

                                    ? lessons.map((lesson: Lesson, lessonIdx: number) => (
                                        <LessonBox
                                            key={`lesson-box-${lessonIdx}`}
                                            lesson={lesson}
                                            active={!hiddenLessonsTypes.includes(lesson.schedule.lesson_type)}
                                        />
                                    ))
                                    : conflicts.map((lessons: Lesson[]) =>
                                        lessons.map((lesson: Lesson, lessonIdx: number) => (
                                            <LessonBox
                                                key={`conflict-lesson-box-${lessonIdx}`}
                                                lesson={lesson}
                                                conflict={lessons.length > 1 ? true : false}
                                                conflicts={lessons.length > 1 ? lessons : undefined}
                                                active={!hiddenLessonsTypes.includes(lesson.schedule.lesson_type)}
                                            />
                                        ))
                                    )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* TODO: Create a component for this */}
                <div className="flex justify-between gap-5 pl-16">
                    <div className="flex flex-wrap gap-4 gap-y-1 text-sm text-gray-600 dark:text-white 2xl:gap-y-2 2xl:text-base">
                        {lessonTypes.map((lessonType: string) => (
                            <label className="inline-flex items-center gap-1.5 lg:gap-1" key={`lesson-type-${lessonType}`}>
                                <input
                                    type="checkbox"
                                    className="peer hidden"
                                    checked={hiddenLessonsTypes.includes(lessonType)}
                                    onChange={(e) => {
                                        if (e.target.checked) {
                                            setHiddenLessonsTypes((prev) => [...prev, lessonType])
                                        } else {
                                            setHiddenLessonsTypes((prev) => prev.filter((type) => type !== lessonType))
                                        }
                                    }}
                                />
                                <span
                                    className={`h-3.5 w-3.5 rounded shadow 2xl:h-4 2xl:w-4 
                  ${'bg-schedule-' + lessonType.toLowerCase() + '/80'}`}
                                />
                                <span className="cursor-pointer select-none peer-checked:line-through">
                                    {lessonTypesDic[lessonType]}
                                </span>
                            </label>
                        ))}
                    </div>
                    <div className="flex gap-2">
                        <ToggleScheduleGrid showGridHook={[showGrid, setShowGrid]} />
                        <PrintSchedule component={scheduleRef} />
                    </div>
                </div>
            </div>

            {/* Schedule Mobile */}
            <div className="flex h-full w-full flex-col items-center justify-start space-y-2 lg:hidden">
                {lessonsGroupedByDays.length > 0 ? (
                    lessonsGroupedByDays.map((lessons: Lesson[], dayNumber: number) => (
                        <div className="flex w-full items-center justify-start gap-2" key={`responsive-lesson-row-${dayNumber}`}>
                            <div className="h-full w-1 rounded bg-primary" />
                            <div className="flex w-full flex-row flex-wrap items-center justify-start gap-2">
                                {lessons.map(
                                    (lesson: Lesson, lessonIdx: number) =>
                                        !hiddenLessonsTypes.includes(lesson.schedule.lesson_type) && (
                                            <ResponsiveLessonBox
                                                key={`responsive-lesson-box-${dayNumber}-${lessonIdx}`}
                                                lesson={lesson}
                                                conflict={false}
                                            />
                                        )
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <span>Nenhum horário selecionado</span>
                )}
            </div>
        </>
    )
}

export default Schedule
