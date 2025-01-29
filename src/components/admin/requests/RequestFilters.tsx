import { useContext } from "react";
import { Button } from "../../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import RequestFiltersContext from "../../../contexts/admin/RequestFiltersContext";
import { AdminRequestState } from "../../../@types";
import useAdminExchangeCourses from "../../../hooks/admin/useAdminExchangeCourses";

/**
 * This component is the view that allows the user to control which filters are active and applied to the requests.
*/
export const RequestFilters = () => {
    const { 
        activeCourse, setActiveCourse, activeCurricularYear, 
        setActiveCurricularYear, activeState, setActiveState 
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
        <Select 
            value={`${activeState?.toString() || ""}`} 
            defaultValue={`${activeState?.toString() || ""}`} 
            onValueChange={(val) => setActiveState(val as AdminRequestState)}
        >
            <SelectTrigger className="flex flex-row gap-x-4">
                <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="accepted">Aceite</SelectItem>
                <SelectItem value="untreated">Não tratado</SelectItem>
                <SelectItem value="rejected">Rejeitado</SelectItem>
            </SelectContent>
        </Select>
        <Button
            onClick={() => {
                setActiveCourse(undefined);
                setActiveCurricularYear(undefined);
                setActiveState(undefined);
            }}
        >
            Reset
        </Button>
    </div>
}