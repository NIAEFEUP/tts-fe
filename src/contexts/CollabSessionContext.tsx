import { Context, Dispatch, createContext, SetStateAction } from 'react';
import { CollabSession } from '../@types';

interface CollabSessionContextContent {
  sessions: CollabSession[];
  setSessions: Dispatch<SetStateAction<CollabSession[]>>;
  currentSessionIndex: number | null;  // Use index instead of the full session object
  setCurrentSessionIndex: Dispatch<SetStateAction<number | null>>;
}

const CollabSessionContext: Context<CollabSessionContextContent> = createContext({
  sessions: [],
  setSessions: () => {},
  currentSessionIndex: null,  // Initially no session is selected
  setCurrentSessionIndex: () => {},
});

export default CollabSessionContext;