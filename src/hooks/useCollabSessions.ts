import { CollabSession } from "../@types";
import useLocalStorage from "./useLocalStorage";

const useCollabSessions = () => {
    return useLocalStorage('collab-sessions', [] as CollabSession[]);
}

export default useCollabSessions;