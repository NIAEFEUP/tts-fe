import { useState } from 'react'
import { Tabs, TabsItem, TabsItems, TabsPanel, TabsPanels } from '../ui/new/tabs'
import { MultipleStudentExchanges } from './requests/MultipleStudentExchanges'
import { RequestFilters } from './requests/RequestFilters'
import { SingleStudentExchanges } from './requests/SingleStudentExchanges'
import { StudentEnrollments } from './requests/StudentEnrollments'
import { AdminRequestState } from '../../contexts/admin/RequestFiltersContext'
import RequestFiltersContext from '../../contexts/admin/RequestFiltersContext'
import { AdminPagination } from './AdminPagination'
import AdminPaginationContext from '../../contexts/admin/AdminPaginationContext'
import { AdminMarketplaceExchanges } from './requests/AdminMarketplaceExchanges'

export const AdminMainContent = () => {
  const [activeCourse, setActiveCourse] = useState<number | undefined>(undefined)
  const [activeCurricularYear, setActiveCurricularYear] = useState<number | undefined>(undefined)
  const [activeStates, setActiveStates] = useState<Array<AdminRequestState>>([
    AdminRequestState.AWAITING,
    AdminRequestState.UNTREATED,
  ])

  const [currPage, setCurrPage] = useState<number>(1)
  const [totalPages, setTotalPages] = useState<number>(1)
  // Brought in from the main branch
  const [itemsPerPage, setItemsPerPage] = useState<number>(10)

  return (
    <AdminPaginationContext.Provider
      value={{
        currPage,
        setCurrPage,
        totalPages,
        setTotalPages,
        itemsPerPage, // Added from main
        setItemsPerPage, // Added from main
      }}
    >
      <RequestFiltersContext.Provider
        value={{
          activeCourse: activeCourse,
          setActiveCourse: setActiveCourse,
          activeCurricularYear: activeCurricularYear,
          setActiveCurricularYear: setActiveCurricularYear,
          activeStates: activeStates,
          setActiveStates: setActiveStates,
        }}
      >
        <div className="flex flex-col gap-y-4 p-4">
          <div className="flex justify-between">
            <h1 className="text-3xl font-bold">Pedidos</h1>
            <RequestFilters />
          </div>

          {/* Kept your new Tabs component structure */}
          <Tabs onChange={() => setCurrPage(1)}>
            <TabsItems className="w-full">
              <TabsItem className="flex-1">Trocas entre estudantes</TabsItem>
              <TabsItem className="flex-1">Trocas urgentes</TabsItem>
              <TabsItem className="flex-1">Inscrições</TabsItem>
              <TabsItem className="flex-1">Trocas individuais</TabsItem>
            </TabsItems>

            <TabsPanels>
              <TabsPanel>
                <MultipleStudentExchanges />
              </TabsPanel>
              <TabsPanel>
                <SingleStudentExchanges />
              </TabsPanel>
              <TabsPanel>
                <StudentEnrollments />
              </TabsPanel>
              <TabsPanel>
                <AdminMarketplaceExchanges />
              </TabsPanel>
            </TabsPanels>

            <div className="mt-8">
              <AdminPagination />
            </div>
          </Tabs>
        </div>
      </RequestFiltersContext.Provider>
    </AdminPaginationContext.Provider>
  )
}
