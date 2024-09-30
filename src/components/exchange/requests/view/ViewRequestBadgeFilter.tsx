import { ChevronDownIcon } from "@heroicons/react/24/outline"
import { Dispatch, SetStateAction } from "react"
import { ClassInfo, CourseInfo } from "../../../../@types"
import useCourseUnitClasses from "../../../../hooks/useCourseUnitClasses"
import { Badge } from "../../../ui/badge"
import { Button } from "../../../ui/button"
import { Checkbox } from "../../../ui/checkbox"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../../ui/dropdown-menu"

type Props = {
  courseUnit: CourseInfo
  filterCourseUnitsHook: [Set<number>, Dispatch<SetStateAction<Set<number>>>]
}

export const ViewRequestBadgeFilter = ({ courseUnit, filterCourseUnitsHook }: Props) => {
  const [filterCourseUnits, setFilterCourseUnits] = filterCourseUnitsHook
  const { classes } = useCourseUnitClasses(courseUnit.id);

  return <div className="flex flex-row items-center">
    <Badge
      className={
        `${filterCourseUnits.has(courseUnit.id) ? "bg-black text-white" : "bg-gray-200 text-gray-700"} 
                    cursor-pointer hover:text-white flex flex-row items-center gap-x-1`
      }
      onClick={() => {
        const newFilterCourseUnits = new Set(filterCourseUnits);

        if (newFilterCourseUnits.has(courseUnit.id)) newFilterCourseUnits.delete(courseUnit.id);
        else newFilterCourseUnits.add(courseUnit.id);

        setFilterCourseUnits(newFilterCourseUnits);
      }}
    >
      {courseUnit.acronym}
      <DropdownMenu>
        <DropdownMenuTrigger className="p-0 xl:p-0" asChild>
          <Button variant="icon" className="p-0 h-5 w-5 text-black hover:text-white">
            <ChevronDownIcon className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="flex flex-col gap-y-2">
          <p className="p-2">Turma de destino</p>
          {classes?.map((currentClass: ClassInfo) => (
            <DropdownMenuItem className="flex flex-row">
              <div className="flex flex-row items-center gap-x-2">
                <Checkbox
                  id={`from-${currentClass.id}`}
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                />
                <label htmlFor={`from-${currentClass.id}`} className="ml-2 text-sm text-gray-700">
                  {currentClass.name}
                </label>
              </div>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </Badge>
  </div>
}
