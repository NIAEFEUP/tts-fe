import { Context, createContext, Dispatch, SetStateAction } from 'react'

interface SessionContextContent {
  signedIn: boolean
  user: any
  isSessionLoading: boolean
  setSignedIn: Dispatch<SetStateAction<boolean>>
}

const SessionContext: Context<SessionContextContent> = createContext({
  signedIn: false,
  user: null,
  isSessionLoading: false,
  setSignedIn: () => { }
});

export default SessionContext
