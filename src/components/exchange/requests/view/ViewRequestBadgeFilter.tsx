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
  classesFilterHook: [Map<string, Set<string>>, Dispatch<SetStateAction<Map<string, Set<string>>>>]
}

export const ViewRequestBadgeFilter = ({
  courseUnit,
  filterCourseUnitsHook,
  classesFilterHook
}: Props) => {
  const [classesFilter, setClassesFilter] = classesFilterHook;
  const [filterCourseUnits, setFilterCourseUnits] = filterCourseUnitsHook
  const { classes } = useCourseUnitClasses(courseUnit.id);

  const handleClassFilterChange = (className: string, checked: boolean) => {
    const classFilterItem = classesFilter.get(courseUnit.acronym);

    if (checked) {
      if (classFilterItem) classFilterItem.add(className);
      else classesFilter.set(courseUnit.acronym, new Set([className]));
    } else {
      classFilterItem?.delete(className);
      if (classFilterItem?.size === 0) classesFilter?.delete(courseUnit.acronym);
    }

    setClassesFilter(new Map(classesFilter));
  }

  return <div className="flex flex-row items-center gap-x-2">
    <Badge
      className={
        `${filterCourseUnits.has(courseUnit.id) ? "bg-primary text-white" : "bg-gray-200 text-gray-700"} 
                    cursor-pointer hover:text-white hover:bg-primary flex flex-row items-center gap-x-1`
      }
      onClick={() => {
        const newFilterCourseUnits = new Set(filterCourseUnits);

        if (newFilterCourseUnits.has(courseUnit.id)) newFilterCourseUnits.delete(courseUnit.id);
        else newFilterCourseUnits.add(courseUnit.id);

        setFilterCourseUnits(newFilterCourseUnits);
      }}
    >
      {courseUnit.acronym}
    </Badge>
    <DropdownMenu>
      <DropdownMenuTrigger className="p-0 xl:p-0" asChild>
        <Button variant="icon" className="p-0 h-5 w-5 text-black dark:text-white">
          <ChevronDownIcon className="h-5 w-5" />
        </Button>

      </DropdownMenuTrigger>
      <DropdownMenuContent className="flex flex-col gap-y-2 max-h-72 overflow-y-scroll">
        <p className="p-2">Turma de destino</p>
        {classes?.map((currentClass: ClassInfo) => (
          <DropdownMenuItem className="flex flex-row" key={`from-${currentClass.id}`}>
            <div className="flex flex-row items-center gap-x-2" key={`from-${currentClass.id}`}>
              <Checkbox
                id={`from-${currentClass.id}`}
                checked={classesFilter.get(courseUnit.acronym)?.has(currentClass.name)}
                onCheckedChange={(checked: boolean) => {
                  handleClassFilterChange(currentClass.name, checked);
                }}
                onClick={(e) => e.stopPropagation()}
              />
              <label
                htmlFor={`from-${currentClass.id}`}
                className="ml-2 text-sm text-gray-700 dark:text-white"
                onClick={(e) => e.stopPropagation()}
              >
                {currentClass.name}
              </label >
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>

  </div>
}
