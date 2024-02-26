import { Context, createContext, Dispatch, SetStateAction } from 'react'

interface SessionContextContent {
    loggedIn: boolean,
    setLoggedIn: Dispatch<SetStateAction<boolean>>
}

export const SessionContext: Context<SessionContextContent> = createContext({
    loggedIn: false,
    setLoggedIn: (enabled: boolean) => { },
})
