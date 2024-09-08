import { Context, Dispatch, SetStateAction } from 'react'
import { createContext } from 'react'
import { ClassDescriptor, CourseInfo, MultipleOptions } from '../@types'

interface ScheduleContent {
  schedule: Array<ClassDescriptor>
  enrolledCourseUnits: Array<CourseInfo>
}

const ScheduleContext: Context<ScheduleContent> = createContext({
  schedule: [],
  enrolledCourseUnits: []
});

export default ScheduleContext;

