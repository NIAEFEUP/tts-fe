import { Dispatch, SetStateAction, useContext } from "react"
import { CourseInfo } from "../../../../@types"
import ScheduleContext from "../../../../contexts/ScheduleContext"
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
  const { enrolledCourseUnits, loadingSchedule } = useContext(ScheduleContext);

  return <div className="flex flex-row justify-between w-full">
    {/* Course unit filters */}
    {loadingSchedule ? <ViewRequestsFiltersSkeletons />
      : <div className="flex flex-row gap-2 w-full flex-wrap">
        <div className="w-full flex flex-row flex-wrap gap-x-3 gap-y-5 items-center">
          {
            enrolledCourseUnits?.map((courseUnit: CourseInfo) => (
              <ViewRequestBadgeFilter 
                key={courseUnit.id}
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
