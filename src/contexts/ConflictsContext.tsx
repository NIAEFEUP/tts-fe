import { Context, Dispatch, createContext, SetStateAction } from "react";

interface ConflictsContextType {
  conflictSeverity: boolean;
  setConflictSeverity: Dispatch<SetStateAction<boolean>>;
  tClassConflicts: boolean;
  setTClassConflicts: Dispatch<SetStateAction<boolean>>;
  hasSomeConflict: boolean;
  setHasSomeConflict: Dispatch<SetStateAction<boolean>>;
}

const ConflictsContext: Context<ConflictsContextType> = createContext({
  conflictSeverity: false,
  setConflictSeverity: () => { },
  tClassConflicts: false,
  setTClassConflicts: () => { },
  hasSomeConflict: false,
  setHasSomeConflict: () => { },
})

export default ConflictsContext
