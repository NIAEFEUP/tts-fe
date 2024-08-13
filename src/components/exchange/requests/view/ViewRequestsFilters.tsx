import { Checkbox } from "@radix-ui/react-checkbox"
import { Dispatch, SetStateAction, useState } from "react"
import { Badge } from "../../../ui/badge"
import { ScrollArea } from "../../../ui/scroll-area"

type Props = {
  enrolledCourseUnits: Array<string>
  availableClasses: Array<string>
  filterCourseUnitsHook: [Set<string>, Dispatch<SetStateAction<Set<string>>>]
}

export const ViewRequestsFilters = ({
  enrolledCourseUnits,
  availableClasses,
  filterCourseUnitsHook
}: Props) => {
  const [filterCourseUnits, setFilterCourseUnits] = filterCourseUnitsHook

  return <div className="flex flex-row justify-between">
    {/* Course unit filters */}
    <div className="flex flex-row gap-x-2">
      {enrolledCourseUnits.map((courseUnitName: string) => (
        <div>
          <Badge
            className={`${filterCourseUnits.has(courseUnitName) ? "bg-black text-white" : "bg-gray-200 text-gray-700"} cursor-pointer hover:text-white`}
            onClick={() => {
              const newFilterCourseUnits = new Set(filterCourseUnits);

              if (newFilterCourseUnits.has(courseUnitName)) newFilterCourseUnits.delete(courseUnitName);
              else newFilterCourseUnits.add(courseUnitName);

              setFilterCourseUnits(newFilterCourseUnits);
            }}
          >
            {courseUnitName}
          </Badge>
        </div>
      ))}
    </div>

    {/* Classes filter */}
    {/* <div className="flex flex-row"> */}
    {/**/}
    {/*   <ScrollArea className="mx-5 h-72 rounded px-3"> */}
    {/*     { */}
    {/*       availableClasses.map((className: string) => ( */}
    {/*         <div */}
    {/*           // key={key} */}
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
