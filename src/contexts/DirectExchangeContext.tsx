import { Context, createContext, Dispatch, SetStateAction } from 'react'
import { ClassExchange } from '../@types'

interface DirectExchangeContext {
    marketplaceToggled: boolean,
    setMarketplaceToggled: Dispatch<SetStateAction<boolean>>,
    currentDirectExchange: Map<string, ClassExchange>,
    setCurrentDirectExchange: Dispatch<SetStateAction<Map<string, ClassExchange>>>
}

export const DirectExchangeContext: Context<DirectExchangeContext> = createContext({
    marketplaceToggled: false,
    setMarketplaceToggled: (toggle) => { },
    currentDirectExchange: new Map(),
    setCurrentDirectExchange: (exchange) => { }
})
