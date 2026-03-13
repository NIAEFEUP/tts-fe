import { Dispatch, SetStateAction, useContext } from 'react'
import { CourseInfo } from '../../../../@types'
import ScheduleContext from '../../../../contexts/ScheduleContext'
import { Skeleton } from '../../../ui/skeleton'
import { ViewRequestBadgeFilter } from './ViewRequestBadgeFilter'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../ui/select'
type Props = {
  filterCourseUnitsHook: [Set<number>, Dispatch<SetStateAction<Set<number>>>]
  classesFilterHook: [Map<string, Set<string>>, Dispatch<SetStateAction<Map<string, Set<string>>>>]
  setRequestStateFilter: Dispatch<SetStateAction<string>>
  stateFilterActive?: boolean
}

const ViewRequestsFiltersSkeletons = () => {
  return (
    <div className="flex w-full flex-row items-center space-x-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-4 w-1/5 rounded-md" />
      ))}
    </div>
  )
}

export const ViewRequestsFilters = ({
  filterCourseUnitsHook,
  classesFilterHook,
  setRequestStateFilter,
  stateFilterActive,
}: Props) => {
  const { enrolledCourseUnits, loadingSchedule } = useContext(ScheduleContext)

  return (
    <div className="flex w-full flex-row justify-between">
      {/* Course unit filters */}
      {loadingSchedule ? (
        <ViewRequestsFiltersSkeletons />
      ) : (
        <div className="flex w-full flex-row flex-wrap gap-2">
          <div className="flex w-full flex-row flex-wrap items-center gap-x-3 gap-y-5">
            {enrolledCourseUnits?.map((courseUnit: CourseInfo) => (
              <ViewRequestBadgeFilter
                key={courseUnit.id}
                courseUnit={courseUnit}
                filterCourseUnitsHook={filterCourseUnitsHook}
                classesFilterHook={classesFilterHook}
              />
            ))}
            {stateFilterActive && (
              <Select onValueChange={(value) => setRequestStateFilter(value)}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Filtrar por tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos</SelectItem>
                  <SelectItem value="pending">Pendentes</SelectItem>
                  <SelectItem value="accepted">Aceites</SelectItem>
                  <SelectItem value="canceled">Canceladas</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
