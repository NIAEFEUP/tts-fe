import BackendAPI from '../api/backend'
import { useEffect, useContext } from 'react'
import { Sidebar } from '../components/planner'
import { Major } from '../@types'
import MajorContext from '../contexts/MajorContext'
import { useSidebarContext } from '../components/layout/SidebarPosition'
import { SidebarProvider } from '../components/layout/SidebarPosition'
import PlannerSchedule from '../components/planner/schedule/PlannerSchedule'

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

  return (
    <div className="grid w-full grid-cols-12 gap-x-4 gap-y-4 px-4 py-4">
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
  )
}


export default TimeTableSelectorPage;