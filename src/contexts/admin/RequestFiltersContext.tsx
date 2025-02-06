import { Context, Dispatch, createContext, SetStateAction } from "react";

export enum AdminRequestState {
  ACCEPTED = "accepted",
  UNTREATED = "untreated",
  AWAITING = "awaiting-information",
  TREATED = "treated",
  REJECTED = "rejected"
};

// The string is not defined in the enum definition because this way it is easier to send to the backend
export const adminRequestStateToText = {
    "accepted": "Aceite",
    "untreated": "Não tratado",
    "awaiting-information": "Aguardar informação",
    "treated": "Tratado",
    "rejected": "Rejeitado"
};

export const activeStatesPossibleValues = [
    AdminRequestState.UNTREATED,
    AdminRequestState.AWAITING,
    AdminRequestState.TREATED,
    AdminRequestState.REJECTED
];

export const requestFilterProperties = [
    "activeCourse",
    "activeCurricularYear",
    "activeStates"
];

export interface RequestFiltersContextContent {
    activeCourse: number | undefined,
    setActiveCourse: Dispatch<SetStateAction<number | undefined>>,
    activeCurricularYear: number | undefined,
    setActiveCurricularYear: Dispatch<SetStateAction<number | undefined>>,
    activeStates: Array<AdminRequestState>,
    setActiveStates: Dispatch<SetStateAction<Array<AdminRequestState>>>
}

const RequestFiltersContext: Context<RequestFiltersContextContent> = createContext({
    activeCourse: undefined,
    setActiveCourse: () => { },
    activeCurricularYear: undefined,
    setActiveCurricularYear: () => { },
    activeStates: [],
    setActiveStates: () => { }
});

export default RequestFiltersContext;