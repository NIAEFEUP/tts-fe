import { Context, Dispatch, SetStateAction } from 'react'
import { createContext } from 'react'
import { ClassDescriptor, CourseInfo } from '../@types'

interface ScheduleContent {
  originalExchangeSchedule: Array<ClassDescriptor>
  exchangeSchedule: Array<ClassDescriptor>
  setExchangeSchedule: Dispatch<SetStateAction<Array<ClassDescriptor>>>
  enrolledCourseUnits: Array<CourseInfo>
  loadingSchedule: boolean
}

const ScheduleContext: Context<ScheduleContent> = createContext({
  originalExchangeSchedule: [],
  exchangeSchedule: [],
  loadingSchedule: false,
  setExchangeSchedule: () => { },
  enrolledCourseUnits: []
});

export default ScheduleContext;

