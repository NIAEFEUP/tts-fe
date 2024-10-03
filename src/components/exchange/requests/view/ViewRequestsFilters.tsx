import { Checkbox } from "@radix-ui/react-checkbox"
import { Dispatch, SetStateAction, useContext, useState } from "react"
import { CourseInfo } from "../../../../@types"
import ScheduleContext from "../../../../contexts/ScheduleContext"
import useStudentCourseUnits from "../../../../hooks/useStudentCourseUnits"
import { Schedule } from "../../../planner"
import { Badge } from "../../../ui/badge"
import { ScrollArea } from "../../../ui/scroll-area"
import { Skeleton } from "../../../ui/skeleton"

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
    <div className="flex flex-row gap-2 w-2/3 flex-wrap">
      {enrolledCourseUnits.length === 0
        ?
        <div className="flex flex-row space-y-2 space-x-2 w-full items-center">
          <Skeleton className="h-4 w-1/4 rounded-full" />
          <Skeleton className="h-4 w-1/4 rounded-full" />
          <Skeleton className="h-4 w-1/4 rounded-full" />
          <Skeleton className="h-4 w-1/4 rounded-full" />
        </div>
        : <>
          {
            Array.from(enrolledCourseUnits).map((courseUnit: CourseInfo) => (
              <div>
                <Badge
                  className={`${filterCourseUnits.has(courseUnit.id) ? "bg-black text-white" : "bg-gray-200 text-gray-700"} cursor-pointer hover:text-white`}
                  onClick={() => {
                    const newFilterCourseUnits = new Set(filterCourseUnits);

                    if (newFilterCourseUnits.has(courseUnit.id)) newFilterCourseUnits.delete(courseUnit.id);
                    else newFilterCourseUnits.add(courseUnit.id);

                    setFilterCourseUnits(newFilterCourseUnits);
                  }}
                >
                  {courseUnit.acronym}
                </Badge>
              </div>
            ))
          }
          </>}
    </div>

    {/* Classes filter */}
    {/* <div className="flex flex-row w-1/3"> */}
    {/*   <ScrollArea className="mx-5 h-72 rounded px-3"> */}
    {/*     { */}
    {/*       availableClasses.map((className: string) => ( */}
    {/*         <div */}
    {/*           // key={key}  */}
    {/*           className="mt-1 flex items-center space-x-2 rounded p-1 hover:cursor-pointer hover:bg-slate-100 hover:dark:bg-slate-700" */}
    {/*         > */}
    {/*           <Checkbox id={className} /> */}
    {/*           <label */}
    {/*             htmlFor={className} */}
    {/*             className="text-sm font-medium leading-none hover:cursor-pointer peer-disabled:cursor-not-allowed peer-disabled:opacity-70" */}
    {/*           > */}
    {/*             {className} */}
    {/*           </label> */}
    {/*         </div> */}
    {/*       ))} */}
    {/*   </ScrollArea> */}
    {/* </div> */}

    </div>
}