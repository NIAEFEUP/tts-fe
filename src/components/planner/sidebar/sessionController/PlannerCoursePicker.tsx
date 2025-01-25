import { useContext, useEffect, useState } from 'react'
import CourseContext from '../../../../contexts/CourseContext'
import CoursePicker from './CoursePicker'
import CoursePickerContext from '../../../../contexts/coursePicker/CoursePickerContext'
import StorageAPI from '../../../../api/storage'
import BackendAPI from '../../../../api/backend'
import { Major } from '../../../../@types'
import useCourseUnits from '../../../../hooks/useCourseUnits'

export const PlannerCoursePicker = () => {
  const { 
    pickedCourses, setPickedCourses, checkboxedCourses, setCheckboxedCourses,
    choosingNewCourse,
    setChoosingNewCourse, ucsModalOpen, coursesInfo, setCoursesInfo,
    setUcsModalOpen 
  } = useContext(CourseContext)

  const [selectedMajor, setSelectedMajor] = useState<Major>(StorageAPI.getSelectedMajorStorage());

  useEffect(() => {
    BackendAPI.getCoursesClasses(checkboxedCourses).then((courseWithClasses) => {
      StorageAPI.setPickedCoursesStorage(courseWithClasses);
      setPickedCourses(courseWithClasses);
    })
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
      selectedMajor, setSelectedMajor, courseUnits
    }}
    >
      <CoursePicker />
    </CoursePickerContext.Provider>
  )
}
