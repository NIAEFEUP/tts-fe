import { Context, Dispatch, createContext, SetStateAction } from "react";

interface ConflictsContextType {
    isConflictSevere: boolean;
    setConflictSeverity: Dispatch<SetStateAction<boolean>>;
    tClassConflicts: boolean;
    setTClassConflicts: Dispatch<SetStateAction<boolean>>;
}

const ConflictsContext: Context<ConflictsContextType> = createContext({
    isConflictSevere: false,
    setConflictSeverity: () => { },
    tClassConflicts: false,
    setTClassConflicts: () => { },
})

export default ConflictsContext