import { Context, Dispatch, SetStateAction } from 'react'
import { createContext } from 'react'
import { ClassDescriptor, CourseInfo, MultipleOptions } from '../@types'

interface ScheduleContent {
  exchangeSchedule: Array<ClassDescriptor>
  setExchangeSchedule: Dispatch<SetStateAction<Array<ClassDescriptor>>>
  enrolledCourseUnits: Array<CourseInfo>
  loadingSchedule: boolean
}

const ScheduleContext: Context<ScheduleContent> = createContext({
  exchangeSchedule: [],
  loadingSchedule: false,
  setExchangeSchedule: () => { },
  enrolledCourseUnits: []
});

export default ScheduleContext;

