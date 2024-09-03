import BackendAPI from '../api//backend'
import StorageAPI from '../api/storage'
import { useState, useEffect } from 'react'
import { Schedule, Sidebar } from '../components/planner'
import { CourseInfo, Major } from '../@types'
import MajorContext from '../contexts/MajorContext'
import CourseContext from '../contexts/CourseContext'

const TimeTableSchedulerPage = () => {
  const [majors, setMajors] = useState<Major[]>([])
  const [coursesInfo, setCoursesInfo] = useState([]);
  const [pickedCourses, setPickedCourses] = useState<CourseInfo[]>(StorageAPI.getPickedCoursesStorage());
  const [checkboxedCourses, setCheckboxedCourses] = useState<CourseInfo[]>(StorageAPI.getPickedCoursesStorage());
  const [ucsModalOpen, setUcsModalOpen] = useState<boolean>(false);

  //TODO: Looks suspicious
  const [choosingNewCourse, setChoosingNewCourse] = useState<boolean>(false);
  useEffect(() => {
    document.getElementById('layout').scrollIntoView()
    BackendAPI.getMajors().then((majors: Major[]) => {
      setMajors(majors)
    })
  }, [])
  return (
    <MajorContext.Provider value={{ majors, setMajors }}>
      <CourseContext.Provider value={
        {
          pickedCourses, setPickedCourses,
          coursesInfo, setCoursesInfo,
          checkboxedCourses, setCheckboxedCourses,
          choosingNewCourse, setChoosingNewCourse,
          ucsModalOpen, setUcsModalOpen
        }
      }>
        <div className="grid w-full grid-cols-12 gap-x-4 gap-y-4 px-4 py-4">
          {/* Schedule Preview */}
          <div className="lg:min-h-adjusted order-1 col-span-12 min-h-min rounded-md bg-lightest px-3 py-3 dark:bg-dark lg:col-span-9 2xl:px-5 2xl:py-5">
            <div className="h-full w-full">
              <Schedule />
            </div>
          </div>

          <Sidebar />
        </div>
      </CourseContext.Provider>
    </MajorContext.Provider>
  )
}

export default TimeTableSchedulerPage
