import config from '../config/prod.json'
import dev_config from '../config/local.json'
import { CourseOption, CourseSchedule, Lesson, ProfessorInformation } from '../@types'
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
const minHour = 8
const maxHour = 23
const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']
const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez']

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

/**
 * Get's the complete for a page.
 * @param simplePath Path withot a prefix.
 * @returns The complete path with the prefix.
 */
const getPath = (simplePath: string) => {

    return config.pathPrefix + simplePath
}

const getDisplayDate = () => {
    const date = new Date()
    return `${dayNames[date.getDay()]}, ${date.getDate() + 1} ${monthNames[date.getMonth()]}`
}

const getSemester = () => {
    //jan-jul --> 2º Semestre
    const date = new Date()
    const month = date.getMonth()

    return month >= 0 && month <= 6 ? 2 : 1
}

const getSchoolYear = () => {
    const date = new Date()
    const month = date.getMonth()
    const year = date.getFullYear()

    return month >= 0 && month <= 6
        ? `${year - 1}/${year.toString().slice(2, 4)}`
        : `${year}/${(year + 1).toString().slice(2, 4)}`
}

const convertWeekday = (dayNumber: number) => {
    if (dayNumber < 0 || dayNumber > 7) return null

    const weekdays = ['2ªf', '3ªf', '4ªf', '5ªf', '6ªf', 'Sab', 'Dom']
    return weekdays[dayNumber]
}

const convertWeekdayLong = (dayNumber: number) => {
    if (dayNumber < 0 || dayNumber > 7) return null

    const weekdays = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo']
    return weekdays[dayNumber]
}

const convertHour = (hourNumber: string) => {
    if (parseFloat(hourNumber) < 0 || parseFloat(hourNumber) > 24) return null

    const split = hourNumber.split('.')
    const hour = split[0].padStart(2, '0')
    const minutes = split[1] === '0' || !split[1] ? '00' : '30'

    return `${hour}:${minutes}`
}

const timesCollide = (first: CourseSchedule, second: CourseSchedule) => {
    if (first.day !== second.day) return false
    return parseFloat(second.start_time) < parseFloat(first.start_time) + parseFloat(first.duration)
}

const schedulesConflict = (first, second) => {
    if (first.day !== second.day) return false;

    const firstStart = parseFloat(first.start_time);
    const secondStart = parseFloat(second.start_time);
    const firstDuration = parseFloat(first.duration);
    const secondDuration = parseFloat(second.duration);
    const firstEnd = firstStart + firstDuration;
    const secondEnd = secondStart + secondDuration;

    return (firstStart < secondStart && firstEnd > secondStart) || (firstStart >= secondStart && firstStart < secondEnd);
}

const getScheduleOptionDisplayText = (option: CourseSchedule | null) => {
    // prioritize single class name
    const classTitle = option.class_name !== null ? option.class_name : option.composed_class_name
    const professor_acronyms = option.professor_information.map(prof_info => prof_info.acronym)
    return [classTitle, professor_acronyms, convertWeekday(option.day), getLessonBoxTime(option)].join(', ')
}

const getLessonBoxTime = (schedule: CourseSchedule) => {
    return [convertHour(schedule.start_time), convertHour(addHour(schedule.start_time, schedule.duration))].join('-')
}

const addHour = (hour1: string, hour2: string): string => {
    return (parseFloat(hour1) + parseFloat(hour2)).toString()
}

const getLessonBoxStyles = (lesson: Lesson, maxHour: number, minHour: number) => {
    const step = (maxHour - minHour) * 2
    const top = (parseFloat(lesson.schedule.start_time) - minHour) * 2
    const length = parseFloat(lesson.schedule.duration) * 2

    return {
        top: `${(top * 100) / step}%`,
        left: `${(lesson.schedule.day * 100) / 6}%`,
        height: `${length * (100 / step)}%`,
    }
}

const getLessonTypeLongName = (type: string) => {
    switch (type) {
        case 'T':
            return 'Aula Teórica'

        case 'P':
            return 'Aula Prática'

        case 'TP':
            return 'Aula Teórico-Prática'

        case 'S':
            return 'Seminário'

        case 'TC':
            return 'Teórica de Campo'

        case 'PL':
            return 'Aula Prática Laboratorial'

        case 'OT':
            return 'Aula de Orientação'

        default:
            return 'Aula Desconhecida'
    }
}

const getClassTypeClassName = (type: string) => {
    switch (type) {
        case 'T':
            return 'schedule-class-t'

        case 'P':
            return 'schedule-class-p'

        case 'TP':
            return 'schedule-class-tp'

        case 'S':
            return 'schedule-class-s'

        case 'PL':
            return 'schedule-class-pl'

        case 'OT':
            return 'schedule-class-ot'

        case 'TC':
            return 'schedule-class-tc'

        default:
            return 'schedule-class-o'
    }
}

const getCourseTeachers = (courseOption: CourseOption) => {
    let teachers = []
    courseOption.schedules.forEach((schedule, idx) => {
        if (schedule.lesson_type !== 'T') {
            schedule.professor_information.forEach(prof_info => {
                if (!teachers.some(other => other.acronym === prof_info.acronym)) {
                    teachers.push(prof_info);
                }
            });
        }
    })

    return teachers
}


const removeDuplicatesFromCourseOption = (courses: CourseOption[]): CourseOption[] => {
    if (!courses) return []

    let frequency: Map<number, number> = new Map()
    let newCourseOptions: CourseOption[] = []

    for (let courseOption of courses) {
        if (!frequency.has(courseOption.course.info.id)) {
            newCourseOptions.push(courseOption)
            frequency.set(courseOption.course.info.id, 1)
        }
    }

    return newCourseOptions
}

const getProfessorInformationFromSigarraScheduleApi = (course) => {
    const docentes = course.docentes;

    let result: Array<ProfessorInformation> = [];

    docentes.forEach(({ ...docente }) => {
        result.push({
            acronym: course["doc_sigla"],
            name: docente["doc_nome"]
        })
    });

    return result;
}

const convertSigarraCourseToTtsCourse = (course) => {
    return {
        shown: {
            T: false,
            TP: true,
        },
        locked: false,
        course: {
            checked: true,
            info: {
                id: parseInt(course.ocorrencia_id, 10),
                course_id: parseInt(course.ocorrencia_id, 10),
                course_unit_id: parseInt(course.ocorrencia_id, 10),
                sigarra_id: parseInt(course.ocorrencia_id, 10),
                course: course.ucurr_sigla,
                name: course.ucurr_sigla,
                acronym: course.ucurr_sigla,
                url: course.url,
                course_unit_year: 3,
                semester: 2,
                year: 2023,
                schedule_url: "",
                ects: course.ects,
                last_updated: course.last_updated
            }
        },
        option: {
            day: course.dia - 2,
            duration: course.aula_duracao.toString(),
            start_time: course.hora_inicio,
            location: course.sala_sigla,
            lesson_type: course.tipo,
            is_composed: false,
            class_name: course.turma_sigla,
            course_unit_id: course.ocorrencia_id,
            last_updated: "",
            composed_class_name: "",
            professors_link: "",
            professor_information: []
        },
        schedules: [{
            day: course.dia - 2,
            duration: course.aula_duracao.toString(),
            start_time: (course.hora_inicio / 3600).toString(),
            location: course.sala_sigla,
            lesson_type: course.tipo,
            is_composed: false,
            class_name: course.turma_sigla,
            course_unit_id: course.ocorrencia_id,
            last_updated: "",
            composed_class_name: "",
            professors_link: "",
            professor_information: getProfessorInformationFromSigarraScheduleApi(course)
        }],
        teachers: [],
        filteredTeachers: []
    }
}

export {
    config,
    dev_config,
    getPath,
    minHour,
    maxHour,
    dayNames,
    monthNames,
    getDisplayDate,
    getSemester,
    getSchoolYear,
    convertWeekday,
    convertWeekdayLong,
    convertHour,
    timesCollide,
    schedulesConflict,
    getScheduleOptionDisplayText,
    getLessonBoxTime,
    getLessonBoxStyles,
    getClassTypeClassName,
    getLessonTypeLongName,
    getCourseTeachers,
    cn,
    removeDuplicatesFromCourseOption,
    convertSigarraCourseToTtsCourse
}
