import { useContext } from "react";
import { Button } from "../../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import RequestFiltersContext, { activeStatesPossibleValues, adminRequestStateToText } from "../../../contexts/admin/RequestFiltersContext";
import useAdminExchangeCourses from "../../../hooks/admin/useAdminExchangeCourses";
import { AdminRequestState } from "../../../contexts/admin/RequestFiltersContext";
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover";
import { Command, CommandGroup, CommandItem } from "../../ui/command";
import { Check, ChevronDownIcon } from "lucide-react";
import { set } from "date-fns";

/**
 * This component is the view that allows the user to control which filters are active and applied to the requests.
*/
export const RequestFilters = () => {
    const {
        activeCourse, setActiveCourse, activeCurricularYear,
        setActiveCurricularYear, activeStates, setActiveStates
    } = useContext(RequestFiltersContext);

    const { courses } = useAdminExchangeCourses();

    return <div className="flex flex-row gap-x-2">
        <Select
            value={`${activeCourse || ""}`}
            defaultValue={`${activeCourse || ""}`}
            onValueChange={(val) => setActiveCourse(parseInt(val))}
        >
            <SelectTrigger className="flex flex-row gap-x-4">
                <SelectValue placeholder="Curso" />
            </SelectTrigger>
            <SelectContent>
                {courses?.length === 0 && <p>Nenhum</p>}
                {courses?.map((course) => (
                    <SelectItem
                        key={`course-select-item-${course.id}`}
                        value={`${course.id}`}
                    >
                        {course.acronym}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
        <Select
            value={`${activeCurricularYear || ""}`}
            defaultValue={`${activeCurricularYear || ""}`}
            onValueChange={(val) => setActiveCurricularYear(parseInt(val))}
        >
            <SelectTrigger className="flex flex-row gap-x-4">
                <SelectValue placeholder="Ano" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="1">1</SelectItem>
                <SelectItem value="2">2</SelectItem>
                <SelectItem value="3">3</SelectItem>
                <SelectItem value="4">4</SelectItem>
                <SelectItem value="5">5</SelectItem>
            </SelectContent>
        </Select>
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline" className="w-full flex flex-row gap-x-2">
                    <p>Estado</p>
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
    </div>
}