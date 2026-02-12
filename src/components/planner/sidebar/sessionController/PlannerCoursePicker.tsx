import { useContext, useEffect, useState } from 'react'
import CourseContext from '../../../../contexts/CourseContext'
import CoursePicker from './CoursePicker'
import CoursePickerContext from '../../../../contexts/coursePicker/CoursePickerContext'
import StorageAPI from '../../../../api/storage'
import { Major } from '../../../../@types'

export const PlannerCoursePicker = () => {
  const {
    pickedCourses, setPickedCourses, checkboxedCourses, setCheckboxedCourses,
    choosingNewCourse,
    setChoosingNewCourse, ucsModalOpen, coursesInfo, setCoursesInfo,
    setUcsModalOpen
  } = useContext(CourseContext)

  const [selectedMajor, setSelectedMajor] = useState<Major>(StorageAPI.getSelectedMajorStorage());
  const [electiveCourses, setElectiveCourses] = useState<any[]>([]);

  useEffect(() => {
    setPickedCourses(checkboxedCourses);
    StorageAPI.setPickedCoursesStorage(checkboxedCourses);
  }, [checkboxedCourses])

  useEffect(() => {
    if (!selectedMajor) return
    StorageAPI.setSelectedMajorStorage(selectedMajor);
  }, [selectedMajor, setCoursesInfo])

  return (
    <CoursePickerContext.Provider value={{
      coursesStorage: pickedCourses, setCoursesStorage: setPickedCourses,
      checkboxedCourses, setCheckboxedCourses, choosingNewCourse,
      setChoosingNewCourse, ucsModalOpen, setUcsModalOpen, coursesInfo, setCoursesInfo,
      electiveCourses, setElectiveCourses,
      selectedMajor, setSelectedMajor
    }}
    >
      <CoursePicker />
    </CoursePickerContext.Provider>
  )
}
