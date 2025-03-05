import BackendAPI from '../api/backend'
import { useEffect, useContext } from 'react'
import { PasteOptionModal, Sidebar } from '../components/planner'
import { Major } from '../@types'
import MajorContext from '../contexts/MajorContext'
import PlannerSchedule from '../components/planner/schedule/PlannerSchedule'

const TimeTableSelectorPage = () => {
  const {setMajors} = useContext(MajorContext);
  const params = new URLSearchParams(window.location.search)
  const pastedClasses = params.get('classes')

  // fetch majors when component is ready
  useEffect(() => {
    document.getElementById('layout').scrollIntoView()
    BackendAPI.getMajors().then((majors: Major[]) => {
      setMajors(majors)
    })
  }, [])

  return (
    <div className="grid w-full grid-cols-12 gap-x-4 gap-y-4 px-4 py-4">
      {/* Schedule Preview */}
      <div className="lg:min-h-adjusted order-1 col-span-12 min-h-min rounded bg-lightest px-3 py-3 dark:bg-dark lg:col-span-9 2xl:px-5 2xl:py-5">
        <div className="h-full w-full">
          <PlannerSchedule />
          {(pastedClasses && pastedClasses != '') && 
            <PasteOptionModal pastedClasses={pastedClasses}/>
          }
        </div>
      </div>

      <Sidebar />
    </div>
  )
}

export default TimeTableSelectorPage;
