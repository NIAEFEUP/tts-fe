import { Context, Dispatch, SetStateAction } from 'react'
import { createContext } from 'react'
import { ClassDescriptor, DirectExchangeRequest, MarketplaceRequest } from '../@types'

interface ExchangeRequestCommonContext {
  request: MarketplaceRequest | DirectExchangeRequest
  hiddenRequests: Set<number>
  setHiddenRequests: Dispatch<SetStateAction<Set<number>>>
  chosenRequest: MarketplaceRequest | DirectExchangeRequest | null
  setChosenRequest: Dispatch<SetStateAction<MarketplaceRequest | DirectExchangeRequest | null>>
  exchangeSchedule: Array<ClassDescriptor>
  selectAll: boolean
  setSelectAll: Dispatch<SetStateAction<boolean>>
  selectedOptions: Map<string, boolean>
  setSelectedOptions: Dispatch<SetStateAction<Map<string, boolean>>>
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  hide: () => void
}

const ExchangeRequestCommonContext: Context<ExchangeRequestCommonContext> = createContext({
  request: null,
  hiddenRequests: new Set(),
  setHiddenRequests: (param) => { },
  chosenRequest: null,
  setChosenRequest: (param) => { },
  exchangeSchedule: [],
  selectAll: true,
  setSelectAll: (param) => { },
  selectedOptions: new Map(),
  setSelectedOptions: (param) => { },
  open: false,
  setOpen: (param) => { },
  hide: () => { },
});

export default ExchangeRequestCommonContext;

