import { Context, Dispatch, createContext, SetStateAction } from "react";

interface ConflictsContextType {
    hasConflict: boolean;
    setHasConflict: Dispatch<SetStateAction<boolean>>;

    isConflictSevere: boolean;
    setConflictSeverity: Dispatch<SetStateAction<boolean>>;
}

const ConflictsContext: Context<ConflictsContextType> = createContext({
    isConflictSevere: false,
    setConflictSeverity: () => { },
    
    hasConflict: false,
    setHasConflict: () => { },
});
    

export default ConflictsContext