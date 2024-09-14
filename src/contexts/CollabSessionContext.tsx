import { Context, Dispatch, createContext, SetStateAction } from 'react';
import { CollabSession } from '../@types';

interface CollabSessionContextContent {
  sessions: CollabSession[];
  setSessions: Dispatch<SetStateAction<CollabSession[]>>;
  currentSessionId: number | null;  // Use index instead of the full session object
  setcurrentSessionId: Dispatch<SetStateAction<number | null>>;
}

const CollabSessionContext: Context<CollabSessionContextContent> = createContext({
  sessions: [],
  setSessions: () => {},
  currentSessionId: null,  // Initially no session is selected
  setcurrentSessionId: () => {},
});

export default CollabSessionContext;