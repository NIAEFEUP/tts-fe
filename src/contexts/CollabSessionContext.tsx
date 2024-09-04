import { Context, Dispatch, createContext, SetStateAction } from 'react';
import { CollabSession } from '../@types';



interface CollabSessionContextContent {
  sessions: CollabSession[];
  setSessions: Dispatch<SetStateAction<CollabSession[]>>;
  currentSession: CollabSession | null;
  setCurrentSession: Dispatch<SetStateAction<CollabSession | null>>;
}


const CollabSessionContext: Context<CollabSessionContextContent> = createContext({
  sessions: [],
  setSessions: () => {},
currentSession: null,
  setCurrentSession: () => {},
});

export default CollabSessionContext;
