import { Context, createContext } from 'react'

interface SessionContextContent {
  signedIn: boolean
  user: any
  isSessionLoading: boolean
  forceScheduleRevalidation: () => void
}

const SessionContext: Context<SessionContextContent> = createContext({
  signedIn: false,
  user: null,
  isSessionLoading: false,
  forceScheduleRevalidation: () => { }
});

export default SessionContext
