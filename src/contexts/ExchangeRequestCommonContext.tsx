import { Context, Dispatch, SetStateAction } from 'react'
import { createContext } from 'react'
import { ClassDescriptor, DirectExchangeRequest, MarketplaceRequest } from '../@types'
import { StudentRequestCardStatus } from '../utils/requests'

interface ExchangeRequestCommonContext {
  request: MarketplaceRequest | DirectExchangeRequest
  setRequest: Dispatch<SetStateAction<MarketplaceRequest | DirectExchangeRequest>>
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
  togglePreview: (updatedOptions: Map<string, boolean>) => void
  hide: () => void
  handleSelectAll: () => void
  requestStatus: StudentRequestCardStatus | undefined
  setRequestStatus: Dispatch<SetStateAction<StudentRequestCardStatus | undefined>>
}

const ExchangeRequestCommonContext: Context<ExchangeRequestCommonContext> = createContext({
  request: null,
  setRequest: () => { },
  hiddenRequests: new Set(),
  setHiddenRequests: () => { },
  chosenRequest: null,
  setChosenRequest: () => { },
  exchangeSchedule: [],
  selectAll: true,
  setSelectAll: () => { },
  selectedOptions: new Map(),
  setSelectedOptions: () => { },
  open: false,
  setOpen: () => { },
  togglePreview: () => { },
  hide: () => { },
  handleSelectAll: () => { },
  requestStatus: undefined,
  setRequestStatus: () => { }
});

export default ExchangeRequestCommonContext;

