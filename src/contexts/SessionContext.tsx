import { Context, createContext, Dispatch, SetStateAction } from 'react'

interface SessionContextContent {
  signedIn: boolean
  user: any
  isSessionLoading: boolean
  setSignedIn: Dispatch<SetStateAction<boolean>>
  forceScheduleRevalidation: () => void
}

const SessionContext: Context<SessionContextContent> = createContext({
  signedIn: false,
  user: null,
  isSessionLoading: false,
  setSignedIn: () => { },
  forceScheduleRevalidation: () => { }
});

export default SessionContext
