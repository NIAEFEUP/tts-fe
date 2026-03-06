import { useContext, useState } from 'react'
import { Button } from '../../ui/button'
import RequestFiltersContext, {
  activeStatesPossibleValues,
  adminRequestStateToText,
} from '../../../contexts/admin/RequestFiltersContext'
import useAdminExchangeCourses from '../../../hooks/admin/useAdminExchangeCourses'
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/newPopover'
import { Command, CommandGroup, CommandItem } from '../../ui/command'
import { Check, ChevronDownIcon } from 'lucide-react'
import { Badge } from '../../ui/badge'

export const RequestFilters = () => {
  const {
    activeCourse,
    setActiveCourse,
    activeCurricularYear,
    setActiveCurricularYear,
    activeStates,
    setActiveStates,
  } = useContext(RequestFiltersContext)

  const { courses } = useAdminExchangeCourses()

  const [courseOpen, setCourseOpen] = useState(false)
  const [yearOpen, setYearOpen] = useState(false)

  return (
    <div className="flex flex-row flex-wrap gap-2">
      <Popover open={courseOpen} onOpenChange={setCourseOpen} placement="bottom-start">
        <PopoverTrigger asChild>
          <Button variant="outline" className="justify-between w-36">
            {activeCourse ? courses?.find((c) => c.id === activeCourse)?.acronym : 'Curso'}
            <ChevronDownIcon className="w-4 h-4 ml-2 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-36 p-0">
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
          <Button variant="outline" className="justify-between w-28">
            {activeCurricularYear ? `${activeCurricularYear}º Ano` : 'Ano'}
            <ChevronDownIcon className="w-4 h-4 ml-2 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-28 p-0">
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
          <Button variant="outline" className="justify-between w-32">
            <span className="flex items-center">
              Estado
              {activeStates.length > 0 && (
                <Badge variant="secondary" className="px-1 py-0 ml-2 rounded-sm">
                  {activeStates.length}
                </Badge>
              )}
            </span>
            <ChevronDownIcon className="w-4 h-4 ml-2 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-48 p-0">
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
        onClick={() => {
          setActiveCourse(undefined)
          setActiveCurricularYear(undefined)
          setActiveStates([])
        }}
      >
        Limpar
      </Button>
    </div>
  )
}
