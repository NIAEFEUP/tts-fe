import { Context, createContext } from 'react'

interface SessionContextContent {
  signedIn: boolean
}

const SessionContext: Context<SessionContextContent> = createContext({
  signedIn: false
});

export default SessionContext
