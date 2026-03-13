import BackendAPI from '../api/backend'
import { useEffect, useContext, useState } from 'react' // Adicionado useEffect aqui
import { Sidebar } from '../components/planner'
import { Major } from '../@types'
import MajorContext from '../contexts/MajorContext'
import { useSidebarContext } from '../components/layout/SidebarPosition'
import { SidebarProvider } from '../components/layout/SidebarPosition'
import PlannerSchedule from '../components/planner/schedule/PlannerSchedule'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs'
import Alert, { AlertType } from '../components/planner/Alert'
import { AlertDescription } from '../components/ui/alert'
import SessionContext from '../contexts/SessionContext'
import StorageAPI from '../api/storage'
import { X } from 'lucide-react'
const TimeTableSelectorPage = () => {
  const { setMajors } = useContext(MajorContext)

  // fetch majors when component is ready
  useEffect(() => {
    document.getElementById('layout').scrollIntoView()
    BackendAPI.getMajors().then((majors: Major[]) => {
      setMajors(majors)
    })
  }, [])

  return (
    <SidebarProvider>
      <Content />
    </SidebarProvider>
  )
}

const Content = () => {
  const { sidebarPosition } = useSidebarContext()
  const { user } = useContext(SessionContext)
  const [showExchangeAlert, setShowExchangeAlert] = useState<boolean>(true)

  useEffect(() => {
    setShowExchangeAlert(StorageAPI.getShowExchangeAlertStorage())
  }, [])

  const handleCloseAlert = () => {
    setShowExchangeAlert(false)
    StorageAPI.setShowExchangeAlertStorage()
  }

  return (
    <div className="h-full w-full">
      <div className="flex w-full  justify-items-start px-4 py-4 lg:hidden">
        <Tabs defaultValue="planner" className="w-full">
          <TabsList className="grid w-full grid-cols-2 ">
            <TabsTrigger value="planner">Horário</TabsTrigger>
            <TabsTrigger value="sidebar">Turmas</TabsTrigger>
          </TabsList>
          <TabsContent value="planner">
            <div className="bg-lightest dark:bg-dark rounded px-3 py-3 ">
              <div className="h-full w-full ">
                <PlannerSchedule />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="sidebar">
            <Sidebar />
          </TabsContent>
        </Tabs>
        {/* Tabs */}
        {/* Schedule Preview */}
      </div>
      <div className="hidden w-full grid-cols-12 gap-x-4 gap-y-4 px-4 py-4 lg:grid">
        {user?.eligible_exchange && showExchangeAlert && (
          <div className="col-span-12 mb-2">
            <Alert type={AlertType.info} className="relative p-4">
              <AlertDescription className="pr-8">
                Esta secção funciona apenas como Planner de horários. As inscrições e trocas reais são realizadas na
                página de Inscrições e Trocas de Turmas.
              </AlertDescription>
              <button
                onClick={handleCloseAlert}
                className="absolute right-3 top-1.5 rounded-full p-1 text-current opacity-70 transition-all hover:bg-black/5 hover:opacity-100 dark:hover:bg-white/10"
              >
                <X size={18} />
              </button>
            </Alert>
          </div>
        )}
        {sidebarPosition === 'left' ? (
          <>
            <div className="min-h col-span-12 lg:col-span-3">
              <Sidebar />
            </div>
            <div className="min-h bg-lightest dark:bg-dark col-span-12 rounded-md px-3 py-3 lg:col-span-9 2xl:px-5 2xl:py-5">
              <PlannerSchedule />
            </div>
          </>
        ) : (
          <>
            <div className="min-h bg-lightest dark:bg-dark col-span-12 rounded-md px-3 py-3 lg:col-span-9 2xl:px-5 2xl:py-5">
              <PlannerSchedule />
            </div>
            <div className="min-h col-span-12 lg:col-span-3">
              <Sidebar />
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default TimeTableSelectorPage
