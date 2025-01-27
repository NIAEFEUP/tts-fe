import { useContext } from "react";
import { Button } from "../../ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../ui/select";
import RequestFiltersContext from "../../../contexts/admin/RequestFiltersContext";
import { AdminRequestState } from "../../../@types";

/**
 * This component is the view that allows the user to control which filters are active and applied to the requests.
*/
export const RequestFilters = () => {
    const { 
        activeCourse, setActiveCourse, activeCurricularYear, 
        setActiveCurricularYear, activeState, setActiveState 
    } = useContext(RequestFiltersContext);

    return <div className="flex flex-row gap-x-2">
        <Select defaultValue={`${activeCourse || ""}`} onValueChange={(val) => setActiveCourse(parseInt(val))}>
            <SelectTrigger className="flex flex-row gap-x-4">
                <SelectValue placeholder="Curso" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="m.eic">M.EIC</SelectItem>
                <SelectItem value="l.eic">L.EIC</SelectItem>
            </SelectContent>
        </Select>
        <Select defaultValue={`${activeCurricularYear || ""}`} onValueChange={(val) => setActiveCurricularYear(parseInt(val))}>
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
        <Select defaultValue={`${activeState?.toString() || ""}`} onValueChange={(val) => setActiveState(val as AdminRequestState)}>
            <SelectTrigger className="flex flex-row gap-x-4">
                <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="accepted">Aceite</SelectItem>
                <SelectItem value="pending">Pendente</SelectItem>
                <SelectItem value="rejected">Rejeitado</SelectItem>
                <SelectItem value="treated">Tratado</SelectItem>
            </SelectContent>
        </Select>
        <Button>Resetar</Button>
    </div>
}