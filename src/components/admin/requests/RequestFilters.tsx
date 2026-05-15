import { useContext, useState } from 'react'
import { Button } from '../../ui/new/button'
import RequestFiltersContext, {
  activeStatesPossibleValues,
  adminRequestStateToText,
} from '../../../contexts/admin/RequestFiltersContext'
import useAdminExchangeCourses from '../../../hooks/admin/useAdminExchangeCourses'
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/new/newPopover'
import { Command, CommandGroup, CommandItem } from '../../ui/command'
import { Check, ChevronDown } from 'lucide-react'
import { Badge } from '../../ui/badge'
import { PageSizeSelector } from './cards/PageSizeSelector'
import AdminPaginationContext from '../../../contexts/admin/AdminPaginationContext'

export const RequestFilters = () => {
  const {
    activeCourse,
    setActiveCourse,
    activeCurricularYear,
    setActiveCurricularYear,
    activeStates,
    setActiveStates,
  } = useContext(RequestFiltersContext)

  // From main branch: Pagination context
  const { itemsPerPage, setItemsPerPage, setCurrPage } = useContext(AdminPaginationContext)

  const { courses } = useAdminExchangeCourses()

  const [courseOpen, setCourseOpen] = useState(false)
  const [yearOpen, setYearOpen] = useState(false)

  return (
    <div className="flex flex-row flex-wrap gap-2">
      <Popover open={courseOpen} onOpenChange={setCourseOpen} placement="bottom-start">
        <PopoverTrigger asChild>
          <Button variant="outline" className="justify-between w-36 hover:bg-accent/5">
            {activeCourse ? courses?.find((c) => c.id === activeCourse)?.acronym : 'Curso'}
            <ChevronDown size="18" />{' '}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-40 p-0">
          <Command>
            <CommandGroup>
              {(!courses || courses.length === 0) && <CommandItem disabled>Nenhum</CommandItem>}
              {courses?.map((course) => (
                <CommandItem
                  key={`course-${course.id}`}
                  onSelect={() => {
                    setActiveCourse(course.id === activeCourse ? undefined : course.id)
                    setCourseOpen(false)
                  }}
                >
                  <div className="flex flex-row items-center gap-x-2">
                    <div className="w-4 h-4">{activeCourse === course.id && <Check className="w-4 h-4" />}</div>
                    <p>{course.acronym}</p>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      <Popover open={yearOpen} onOpenChange={setYearOpen} placement="bottom-start">
        <PopoverTrigger asChild>
          <Button variant="outline" className="justify-between w-28 hover:bg-accent/5">
            {activeCurricularYear ? `${activeCurricularYear}º Ano` : 'Ano'}
            <ChevronDown size="18" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-32 p-0">
          <Command>
            <CommandGroup>
              {[1, 2, 3, 4, 5].map((year) => (
                <CommandItem
                  key={`year-${year}`}
                  onSelect={() => {
                    setActiveCurricularYear(year === activeCurricularYear ? undefined : year)
                    setYearOpen(false)
                  }}
                >
                  <div className="flex flex-row items-center gap-x-2">
                    <div className="w-4 h-4">{activeCurricularYear === year && <Check className="w-4 h-4" />}</div>
                    <p>{year}</p>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      <Popover placement="bottom-start">
        <PopoverTrigger asChild>
          <Button variant="outline" className="justify-between hover:bg-accent/5">
            <span className="flex items-center">
              Estado
              {activeStates.length > 0 && (
                <Badge variant="secondary" className="px-1 py-0 ml-2 rounded-sm">
                  {activeStates.length}
                </Badge>
              )}
            </span>
            <ChevronDown size="18" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-56 p-0">
          <Command>
            <CommandGroup>
              {activeStatesPossibleValues.map((state) => (
                <CommandItem
                  key={`state-${state}`}
                  onSelect={() => {
                    const newActiveStates = [...activeStates]
                    if (newActiveStates.includes(state)) {
                      setActiveStates(newActiveStates.filter((currentState) => currentState !== state))
                    } else {
                      setActiveStates([...newActiveStates, state])
                    }
                  }}
                >
                  <div className="flex flex-row items-center gap-x-2">
                    <div className="w-4 h-4">{activeStates.includes(state) && <Check className="w-4 h-4" />}</div>
                    <p>{adminRequestStateToText[state]}</p>
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      <Button
        variant="ghost"
        className="hover:bg-foreground/5"
        onClick={() => {
          setActiveCourse(undefined)
          setActiveCurricularYear(undefined)
          setActiveStates([])
        }}
      >
        Limpar
      </Button>

      {/* From main branch: Page Size Selector */}
      <PageSizeSelector
        value={itemsPerPage}
        onChange={(value) => {
          setCurrPage(1)
          setItemsPerPage(value)
        }}
      />
    </div>
  )
}
