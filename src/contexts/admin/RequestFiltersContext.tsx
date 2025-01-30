import { Context, Dispatch, createContext, SetStateAction } from "react";
import { AdminRequestState } from "../../@types";

export const requestFilterProperties = [
    "activeCourse",
    "activeCurricularYear",
    "activeState"
];

export interface RequestFiltersContextContent {
    activeCourse: number | undefined,
    setActiveCourse: Dispatch<SetStateAction<number | undefined>>,
    activeCurricularYear: number | undefined,
    setActiveCurricularYear: Dispatch<SetStateAction<number | undefined>>,
    activeState: AdminRequestState | undefined,
    setActiveState: Dispatch<SetStateAction<AdminRequestState>>
}

const RequestFiltersContext: Context<RequestFiltersContextContent> = createContext({
    activeCourse: undefined,
    setActiveCourse: () => { },
    activeCurricularYear: undefined,
    setActiveCurricularYear: () => { },
    activeState: undefined,
    setActiveState: () => { }
});

export default RequestFiltersContext;