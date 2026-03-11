import { PlusIcon } from '@heroicons/react/24/outline'
import { Dispatch, SetStateAction, useContext, useRef, useState } from 'react'
import { DirectExchangeRequest, MarketplaceRequest } from '../../../../@types'
import ScheduleContext from '../../../../contexts/ScheduleContext'
import useMarketplaceRequests from '../../../../hooks/useMarketplaceRequests'
import { Desert } from '../../../svgs'
import { Button } from '../../../ui/new/newButton'
import { Skeleton } from '../../../ui/skeleton'
import { Tabs, TabsItem, TabsItems, TabsPanel, TabsPanels } from '../../../ui/new/tabs'
import { CommonRequestCard } from './cards/CommonRequestCard'
import { MineRequestCard } from './cards/MineRequestCard'
import { ReceivedRequestCard } from './cards/ReceivedRequestCard'
import { RequestCard } from './cards/RequestCard'
import { ViewRequestsFilters } from './ViewRequestsFilters'
import { ExchangeSidebarStatus } from '../../../../pages/Exchange'
import { MoonLoader } from 'react-spinners'

type Props = {
  setExchangeSidebarStatus: Dispatch<SetStateAction<ExchangeSidebarStatus>>
}

const requestTypeFilters = ['all', 'mine', 'received']

const isRequestVisible = (request: MarketplaceRequest | DirectExchangeRequest, filter: string) => {
  if (filter === 'all') return true
  if (filter === 'accepted') return request.accepted && !request.canceled
  if (filter === 'canceled') return request.canceled
  if (filter === 'pending') return !request.accepted && !request.canceled
  return false
}
const EmptyRequestGuard = ({
  requests,
  children,
}: {
  requests: Array<MarketplaceRequest | DirectExchangeRequest>
  children: React.ReactNode
}) => {
  return (
    <>
      {requests.length === 0 ? (
        <div className="flex flex-col">
          <Desert className="w-full" />
          <p className="text-center">Não existem pedidos.</p>
        </div>
      ) : (
        <>{children}</>
      )}
    </>
  )
}

const RequestCardSkeletons = () => {
  const skeletons = Array.from({ length: 3 }, (_, i) => (
    <div className="flex flex-row w-full space-x-4 items-center" key={`view-request-skeleton-${i}`}>
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="flex flex-col w-full space-y-2">
        <Skeleton className="h-4 w-full" />
        <div className="w-1/2 flex flex-row space-x-2">
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      </div>
    </div>
  ))

  return <>{skeletons}</>
}

const ViewMoreButton = ({
  hasNext,
  setSize,
  size,
  isValidating,
}: {
  hasNext: boolean
  setSize: Dispatch<SetStateAction<number>>
  size: number
  isValidating: boolean
}) => {
  return (
    <>
      {hasNext && (
        <div className="pt-2">
          <Button
            variant="ghost"
            className="w-full border-border border"
            onClick={() => {
              setSize(size + 1)
            }}
          >
            {isValidating ? <MoonLoader size={20} /> : 'Ver mais'}
          </Button>
        </div>
      )}
    </>
  )
}

export const ViewRequests = ({ setExchangeSidebarStatus }: Props) => {
  const { originalExchangeSchedule, setExchangeSchedule } = useContext(ScheduleContext)
  const requestCardsContainerRef = useRef(null)
  const [hiddenRequests, setHiddenRequests] = useState<Set<number>>(new Set())
  const [currentRequestTypeFilter, setCurrentRequestTypeFilter] = useState<number>(0)
  const [filterCourseUnitNames, setFilterCourseUnitNames] = useState<Set<number>>(new Set())
  const [classesFilter, setClassesFilter] = useState<Map<string, Set<string>>>(new Map())
  const [requestStateFilter, setRequestStateFilter] = useState<string>('all')
  const [chosenRequest, setChosenRequest] = useState<MarketplaceRequest | null>(null)

  const { requests, size, setSize, isLoading, hasNext, isValidating, mutate } = useMarketplaceRequests(
    filterCourseUnitNames,
    requestTypeFilters[currentRequestTypeFilter],
    classesFilter,
  )

  return (
    <div className="relative flex flex-col items-start gap-y-4 w-full overflow-x-hidden">
      <div className="flex flex-row justify-between items-center w-full">
        <h1 className="font-bold text-xl">Pedidos</h1>
        <div className="flex flex-row gap-x-2">
          <Button
            className="add-item-button bg-primary text-white"
            onClick={() => {
              setExchangeSidebarStatus(ExchangeSidebarStatus.CREATING_REQUEST)
              setExchangeSchedule(originalExchangeSchedule)
            }}
          >
            Criar pedido
            <PlusIcon className="h-5 w-5" />
          </Button>
        </div>
      </div>

      <Tabs defaultIndex={0} onChange={setCurrentRequestTypeFilter} className="w-full flex flex-col">
        <TabsItems className="flex flex-row justify-between w-full">
          <TabsItem className="flex-1">Todos</TabsItem>
          <TabsItem className="flex-1">Enviados</TabsItem>
          <TabsItem className="flex-1">Recebidos</TabsItem>
        </TabsItems>

        <TabsPanels className="grow w-full">
          {/* Todos */}
          <TabsPanel className="mt-4 w-full">
            <ViewRequestsFilters
              filterCourseUnitsHook={[filterCourseUnitNames, setFilterCourseUnitNames]}
              classesFilterHook={[classesFilter, setClassesFilter]}
              setRequestStateFilter={setRequestStateFilter}
              stateFilterActive={false}
            />
            <div ref={requestCardsContainerRef} className="mt-4 flex flex-col gap-y-3">
              {isLoading ? (
                <RequestCardSkeletons />
              ) : (
                <>
                  {
                    <EmptyRequestGuard requests={requests}>
                      {requests
                        ?.filter((request) => request !== undefined)
                        .map((request: MarketplaceRequest) => (
                          <CommonRequestCard
                            key={request?.id}
                            request={request}
                            hiddenRequests={hiddenRequests}
                            setHiddenRequests={setHiddenRequests}
                            setChosenRequest={setChosenRequest}
                            chosenRequest={chosenRequest}
                            type={request.type}
                          >
                            <RequestCard />
                          </CommonRequestCard>
                        ))}
                      <ViewMoreButton hasNext={hasNext} setSize={setSize} size={size} isValidating={isValidating} />
                    </EmptyRequestGuard>
                  }
                </>
              )}
            </div>
          </TabsPanel>

          {/* Enviados */}
          <TabsPanel className="mt-4 w-full">
            <ViewRequestsFilters
              filterCourseUnitsHook={[filterCourseUnitNames, setFilterCourseUnitNames]}
              classesFilterHook={[classesFilter, setClassesFilter]}
              setRequestStateFilter={setRequestStateFilter}
              stateFilterActive={true}
            />
            <div className="mt-4 flex flex-col gap-y-3">
              {isLoading ? (
                <RequestCardSkeletons />
              ) : (
                <EmptyRequestGuard requests={requests}>
                  {requests
                    ?.filter((request) => request !== undefined && isRequestVisible(request, requestStateFilter))
                    .map((request: MarketplaceRequest) => (
                      <CommonRequestCard
                        key={request.id}
                        request={request}
                        hiddenRequests={hiddenRequests}
                        setHiddenRequests={setHiddenRequests}
                        setChosenRequest={setChosenRequest}
                        chosenRequest={chosenRequest}
                        type={request.type}
                      >
                        <MineRequestCard request={request} mutate={mutate} />
                      </CommonRequestCard>
                    ))}
                  <ViewMoreButton hasNext={hasNext} setSize={setSize} size={size} isValidating={isValidating} />
                </EmptyRequestGuard>
              )}
            </div>
          </TabsPanel>

          {/* Recebidos */}
          <TabsPanel className="mt-4 w-full">
            <ViewRequestsFilters
              filterCourseUnitsHook={[filterCourseUnitNames, setFilterCourseUnitNames]}
              classesFilterHook={[classesFilter, setClassesFilter]}
              setRequestStateFilter={setRequestStateFilter}
              stateFilterActive={true}
            />
            <div className="mt-4 flex flex-col gap-y-3">
              {isLoading ? (
                <RequestCardSkeletons />
              ) : (
                <EmptyRequestGuard requests={requests}>
                  {requests
                    ?.filter((request) => isRequestVisible(request, requestStateFilter))
                    .map((request) => (
                      <CommonRequestCard
                        key={request?.id}
                        request={request}
                        hiddenRequests={hiddenRequests}
                        setHiddenRequests={setHiddenRequests}
                        setChosenRequest={setChosenRequest}
                        chosenRequest={chosenRequest}
                        type={request?.type}
                      >
                        <ReceivedRequestCard request={request} />
                      </CommonRequestCard>
                    ))}
                  <ViewMoreButton hasNext={hasNext} setSize={setSize} size={size} isValidating={isValidating} />
                </EmptyRequestGuard>
              )}
            </div>
          </TabsPanel>
        </TabsPanels>
      </Tabs>
    </div>
  )
}
