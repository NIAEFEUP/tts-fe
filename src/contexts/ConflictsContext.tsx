import { Context, Dispatch, createContext, SetStateAction } from "react";

interface ConflictsContextType {
    conflictsSeverity: boolean;
    setConflictsSeverity: Dispatch<SetStateAction<boolean>>;
}

const ConflictsContext: Context<ConflictsContextType> = createContext({
    conflictsSeverity: false,
    setConflictsSeverity: () => { },
})

export default ConflictsContext