import { ChevronDownIcon } from "@heroicons/react/24/outline"
import { Checkbox } from "@radix-ui/react-checkbox"
import { Dispatch, SetStateAction, useContext, useState } from "react"
import { CourseInfo } from "../../../../@types"
import ScheduleContext from "../../../../contexts/ScheduleContext"
import useStudentCourseUnits from "../../../../hooks/useStudentCourseUnits"
import { Schedule } from "../../../planner"
import { Badge } from "../../../ui/badge"
import { Button } from "../../../ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../../../ui/dropdown-menu"
import { ScrollArea } from "../../../ui/scroll-area"
import { Separator } from "../../../ui/separator"
import { Skeleton } from "../../../ui/skeleton"
import { ViewRequestBadgeFilter } from "./ViewRequestBadgeFilter"

type Props = {
  availableClasses: Array<string>
  filterCourseUnitsHook: [Set<number>, Dispatch<SetStateAction<Set<number>>>]
}

export const ViewRequestsFilters = ({
  availableClasses,
  filterCourseUnitsHook
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
              />
            ))
          }
        </div>}
    </div>

    {/* <div className="flex flex-row w-1/3"> */}
    {/*   skill */}
    {/* </div> */}

    </div>
}