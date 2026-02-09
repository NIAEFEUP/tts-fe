import BackendAPI from '../api/backend'
import { useEffect, useContext } from 'react'
import { Sidebar } from '../components/planner'
import { Major } from '../@types'
import MajorContext from '../contexts/MajorContext'
import { useSidebarContext } from '../components/layout/SidebarPosition'
import { SidebarProvider } from '../components/layout/SidebarPosition'
import PlannerSchedule from '../components/planner/schedule/PlannerSchedule'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs"
import Alert, { AlertType }  from '../components/planner/Alert'
import { AlertDescription } from '../components/ui/alert'
import SessionContext from '../contexts/SessionContext'
import { useState } from 'react';
import StorageAPI from '../api/storage'

const TimeTableSelectorPage = () => {
  const { setMajors } = useContext(MajorContext);

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
  );
};

const Content = () => {
  const { sidebarPosition } = useSidebarContext();
  const { user } = useContext(SessionContext);

  const [showExchangeAlert, setShowExchangeAlert] = useState<boolean>(true)

  useEffect(() => {
    setShowExchangeAlert(StorageAPI.getShowExchangeAlertStorage())
  }, [])

  const handleCloseAlert = () => {
    setShowExchangeAlert(false)
    StorageAPI.setShowExchangeAlertStorage(false)
  }

  return (
    <div className='h-full w-full'>
      <div className="flex w-full  px-4 py-4 lg:hidden justify-items-start">
       <Tabs defaultValue="planner" className="w-full">
        <TabsList className="grid w-full grid-cols-2 ">
          <TabsTrigger value="planner">Horário</TabsTrigger>
          <TabsTrigger value="sidebar">Turmas</TabsTrigger>
        </TabsList>
        <TabsContent value="planner">
          <div className="rounded bg-lightest px-3 py-3 dark:bg-dark ">
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
    <div className="hidden lg:grid w-full grid-cols-12 gap-x-4 gap-y-4 px-4 py-4">
      {user?.eligible_exchange && showExchangeAlert && (
        <div className="col-span-12 mb-2">
          <Alert type={AlertType.info} className="relative p-4">
            <AlertDescription>
              Esta secção funciona apenas como Planner de horários. As inscrições e trocas reais são realizadas na página de Inscrições e Trocas de Turmas.
            </AlertDescription>
            <button
              onClick={handleCloseAlert}
              className="absolute top-1 right-1 text-current hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 px-2 py-1 rounded">
              x
            </button>
          </Alert>
        </div>
      )}
      {sidebarPosition === 'left' ? (
        <>
          <div className='col-span-12 lg:col-span-3 min-h'>
            <Sidebar />
          </div>
          <div className='col-span-12 lg:col-span-9 min-h rounded-md bg-lightest px-3 py-3 dark:bg-dark 2xl:px-5 2xl:py-5'>
            <PlannerSchedule />
          </div>
        </>
      ) : (
        <>
          <div className='col-span-12 lg:col-span-9 min-h rounded-md bg-lightest px-3 py-3 dark:bg-dark 2xl:px-5 2xl:py-5'>
            <PlannerSchedule />
          </div>
          <div className='col-span-12 lg:col-span-3 min-h'>
            <Sidebar />
          </div>
        </>
      )}
    </div>

    </div>
    
  )
}


export default TimeTableSelectorPage;