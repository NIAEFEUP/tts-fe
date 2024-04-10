import { Context, createContext, Dispatch, SetStateAction } from 'react'
import { CourseOption, ExchangeCourseUnit } from '../@types'

interface StudentScheduleContextType {
    schedule: Array<ExchangeCourseUnit>,
    isLoadingSchedule: boolean,
    isValidatingSchedule: boolean,
    courseOptions: CourseOption[],
    originalSchedule: CourseOption[]
}

export const StudentScheduleContext: Context<StudentScheduleContextType> = createContext({
    schedule: [],
    isLoadingSchedule: true,
    isValidatingSchedule: true,
    courseOptions: [],
    originalSchedule: []
})
