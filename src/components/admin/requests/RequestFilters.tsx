import { useContext, useState } from "react";
import { Button } from "../../ui/button";
import RequestFiltersContext, { activeStatesPossibleValues, adminRequestStateToText } from "../../../contexts/admin/RequestFiltersContext";
import useAdminExchangeCourses from "../../../hooks/admin/useAdminExchangeCourses";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { Command, CommandGroup, CommandItem } from "../../ui/command";
import { Check, ChevronDownIcon } from "lucide-react";
import { Badge } from "../../ui/badge";
import { PageSizeSelector } from "./cards/PageSizeSelector";
import AdminPaginationContext from "../../../contexts/admin/AdminPaginationContext";

/**
 * This component is the view that allows the user to control which filters are active and applied to the requests.
*/
export const RequestFilters = () => {
    const {
        activeCourse, setActiveCourse, activeCurricularYear,
        setActiveCurricularYear, activeStates, setActiveStates
    } = useContext(RequestFiltersContext);

    const { itemsPerPage, setItemsPerPage, setCurrPage } = useContext(AdminPaginationContext);

    const { courses } = useAdminExchangeCourses();

    const [courseOpen, setCourseOpen] = useState(false);
    const [yearOpen, setYearOpen] = useState(false);

    const years = [1, 2, 3, 4, 5];

    return <div className="flex flex-row gap-x-2">
        <Popover open={courseOpen} onOpenChange={setCourseOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" className="flex flex-row gap-x-2">
                    <p>
                        {activeCourse ? courses?.find(c => c.id === activeCourse)?.acronym ?? "Curso" : "Curso"}
                        {activeCourse && <Badge variant="outline" className="ml-2">1</Badge>}
                    </p>
                    <ChevronDownIcon className="w-5 h-5" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-40 p-0">
                <Command>
                    <CommandGroup>
                        {courses?.length === 0 && <p className="p-2 text-sm">Nenhum</p>}
                        {courses?.map((course) => (
                            <CommandItem
                                key={`course-select-item-${course.id}`}
                                onSelect={() => {
                                    setActiveCourse(course.id);
                                    setCourseOpen(false);
                                }}
                            >
                                <div className="flex flex-row gap-x-2 items-center">
                                    <p>{course.acronym}</p>
                                    {activeCourse === course.id && <Check className="w-4 h-4" />}
                                </div>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>

        <Popover open={yearOpen} onOpenChange={setYearOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" className="flex flex-row gap-x-2">
                    <p>
                        {activeCurricularYear ? `Ano ${activeCurricularYear}` : "Ano"}
                        {activeCurricularYear && <Badge variant="outline" className="ml-2">1</Badge>}
                    </p>
                    <ChevronDownIcon className="w-5 h-5" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-32 p-0">
                <Command>
                    <CommandGroup>
                        {years.map((year) => (
                            <CommandItem
                                key={`year-${year}`}
                                onSelect={() => {
                                    setActiveCurricularYear(year);
                                    setYearOpen(false);
                                }}
                            >
                                <div className="flex flex-row gap-x-2 items-center">
                                    <p>{year}</p>
                                    {activeCurricularYear === year && <Check className="w-4 h-4" />}
                                </div>
                            </CommandItem>
                        ))}
                    </CommandGroup>
                </Command>
            </PopoverContent>
        </Popover>

        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" className="w-full flex flex-row gap-x-2">
                    <p>
                        Estado
                        {activeStates.length > 0 && <Badge variant="outline" className="ml-2">{activeStates.length}</Badge>}
                    </p>
                    <ChevronDownIcon className="w-5 h-5" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-0">
                <div className="flex flex-col">
                    <Command>
                        <CommandGroup>
                            {activeStatesPossibleValues.map((state) => (
                                <CommandItem
                                    key={`state-${state}`}
                                    className="w-full"
                                    onSelect={() => {
                                        const newActiveStates = [...activeStates];

                                        if (newActiveStates.includes(state)) {
                                            setActiveStates(newActiveStates.filter((currentState) => currentState !== state));
                                        } else {
                                            setActiveStates([...newActiveStates, state]);
                                        }
                                    }}
                                >
                                    <div className="flex flex-row gap-x-2">
                                        <p>{adminRequestStateToText[state]}</p>
                                        { activeStates.includes(state) && <Check className="w-5 h-5" /> }
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </Command>
                </div>
            </PopoverContent>
        </Popover>

        <Button
            onClick={() => {
                setActiveCourse(undefined);
                setActiveCurricularYear(undefined);
                setActiveStates([]);
            }}
        >
            Reset
        </Button>

        <PageSizeSelector
            value={itemsPerPage}
            onChange={(value) => {
                setCurrPage(1);
                setItemsPerPage(value);
            }}
        />
    </div>
}
