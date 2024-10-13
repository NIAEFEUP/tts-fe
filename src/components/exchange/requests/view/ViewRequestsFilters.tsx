import { Dispatch, SetStateAction, useContext, useState } from "react"
import { CourseInfo } from "../../../../@types"
import ScheduleContext from "../../../../contexts/ScheduleContext"
import useStudentCourseUnits from "../../../../hooks/useStudentCourseUnits"
import { Skeleton } from "../../../ui/skeleton"
import { ViewRequestBadgeFilter } from "./ViewRequestBadgeFilter"

type Props = {
  filterCourseUnitsHook: [Set<number>, Dispatch<SetStateAction<Set<number>>>]
  classesFilterHook: [Map<string, Set<string>>, Dispatch<SetStateAction<Map<string, Set<string>>>>]
}

const ViewRequestsFiltersSkeletons = () => {
  return <div className="flex flex-row w-full space-x-4 items-center">
    {
      Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-4 w-1/5 rounded-md" />
      ))
    }
  </div>
}

export const ViewRequestsFilters = ({
  filterCourseUnitsHook,
  classesFilterHook
}: Props) => {
  const { exchangeSchedule, loadingSchedule } = useContext(ScheduleContext);
  const enrolledCourseUnits = useStudentCourseUnits(exchangeSchedule);

  return <div className="flex flex-row justify-between w-full">
    {/* Course unit filters */}
    {loadingSchedule ? <ViewRequestsFiltersSkeletons />
      : <div className="flex flex-row gap-2 w-full flex-wrap">
        <div className="w-full flex flex-row flex-wrap gap-x-3 gap-y-5 items-center">
          {
            Array.from(enrolledCourseUnits).map((courseUnit: CourseInfo) => (
              <ViewRequestBadgeFilter
                courseUnit={courseUnit}
                filterCourseUnitsHook={filterCourseUnitsHook}
                classesFilterHook={classesFilterHook}
              />
            ))
          }
        </div>
      </div>}
  </div>
}
