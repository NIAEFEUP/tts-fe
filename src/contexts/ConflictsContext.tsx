import { Context, Dispatch, createContext, SetStateAction } from "react";

interface ConflictsContextType {
    conflictsExist: boolean;
    setConflictsExist: Dispatch<SetStateAction<boolean>>;
}

 const ConflictsContext: Context<ConflictsContextType> = createContext({
    conflictsExist: false,
    setConflictsExist: () => {},
 })

 export default ConflictsContext