import BackendAPI from '../api/backend'
import { useEffect, useContext } from 'react'
import { Sidebar } from '../components/planner'
import { Major } from '../@types'
import MajorContext from '../contexts/MajorContext'
import PlannerSchedule from '../components/planner/schedule/PlannerSchedule'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs"
const TimeTableSelectorPage = () => {
  const {setMajors} = useContext(MajorContext);

  // fetch majors when component is ready
  useEffect(() => {
    document.getElementById('layout').scrollIntoView()
    BackendAPI.getMajors().then((majors: Major[]) => {
      setMajors(majors)
    })
  }, [])
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
      {/* Schedule Preview */}
      <div className="lg:min-h-adjusted order-1 col-span-12 min-h-min rounded bg-lightest px-3 py-3 dark:bg-dark lg:col-span-9 2xl:px-5 2xl:py-5">
        <div className="h-full w-full">
          <PlannerSchedule />
        </div>
      </div>
      
      <Sidebar />
    </div>

    </div>
    
  )
}

export default TimeTableSelectorPage;
