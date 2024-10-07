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

export const ViewRequestsFilters = ({
  filterCourseUnitsHook,
  classesFilterHook
}: Props) => {
  const [filterCourseUnits, setFilterCourseUnits] = filterCourseUnitsHook
  const { exchangeSchedule } = useContext(ScheduleContext);
  const enrolledCourseUnits = useStudentCourseUnits(exchangeSchedule);

  return <div className="flex flex-row justify-between w-full">
    {/* Course unit filters */}
    <div className="flex flex-row gap-2 w-full flex-wrap">
      {enrolledCourseUnits.length === 0 ?
        <div>
          <Skeleton className="h-4 w-1/4 rounded-full" />
          <Skeleton className="h-4 w-1/4 rounded-full" />
          <Skeleton className="h-4 w-1/4 rounded-full" />
          <Skeleton className="h-4 w-1/4 rounded-full" />
        </div>
        : <div className="w-full flex flex-row flex-wrap gap-x-3 gap-y-3 items-center">
          {
            Array.from(enrolledCourseUnits).map((courseUnit: CourseInfo) => (
              <ViewRequestBadgeFilter
                courseUnit={courseUnit}
                filterCourseUnitsHook={filterCourseUnitsHook}
                classesFilterHook={classesFilterHook}
              />
            ))
          }
        </div>}
    </div>
  </div>
}
