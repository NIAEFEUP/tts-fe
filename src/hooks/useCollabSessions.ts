import { CollabSession } from "../@types";
import useLocalStorage from "./useLocalStorage";

const useCollabSessions = () => {
    const [sessions, setSessions] = useLocalStorage('collab-sessions', [] as CollabSession[]);
    
    return [sessions, setSessions];
}

export default useCollabSessions;