import { Context, Dispatch, SetStateAction } from 'react'
import { createContext } from 'react'
import { Conflicts } from '../@types'

interface ConflictContextContent {
    conflicts: Conflicts
    setConflicts: Dispatch<SetStateAction<Conflicts>>
}

const ConflictsContext: Context<ConflictContextContent> = createContext({
    conflicts: new Map(),
    setConflicts: (conflictInfo: Conflicts) => {},
})

export default ConflictsContext
