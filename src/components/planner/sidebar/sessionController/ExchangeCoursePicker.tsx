import { useState, useEffect } from 'react'
import CoursePicker from './CoursePicker'
import CoursePickerContext from '../../../../contexts/coursePicker/CoursePickerContext'
import { Major, CourseInfo } from '../../../../@types'
import BackendAPI from '../../../../api/backend'
import { Dispatch, SetStateAction } from 'react'
import useLocalStorage from '../../../../hooks/useLocalStorage'
import useCourseUnits from '../../../../hooks/useCourseUnits'

type Props = {
  enrollCourses: CourseInfo[]
  setEnrollCourses: Dispatch<SetStateAction<CourseInfo[]>>
}

export const ExchangeCoursePicker = ({
  enrollCourses,
  setEnrollCourses
}: Props) => {
  const [checkboxedCourses, setCheckboxedCourses] = useLocalStorage("enrollCoursesCheckboxedCourses", []);
  const [coursesInfo, setCoursesInfo] = useState<CourseInfo[]>([]);
  const [modalOpen, setModalOpen] = useState<boolean>(false)
  const [selectedMajor, setSelectedMajor] = useState<Major>(null);

 useEffect(() => {
    BackendAPI.getCoursesClasses(checkboxedCourses).then((courseWithClasses) => {
      // StorageAPI.setPickedCoursesStorage(courseWithClasses);
      setEnrollCourses(courseWithClasses);
    })
  }, [checkboxedCourses])

  return (
    <CoursePickerContext.Provider value={{ 
      coursesStorage: enrollCourses,
      setCoursesStorage: setEnrollCourses,
      checkboxedCourses: checkboxedCourses,
      setCheckboxedCourses: setCheckboxedCourses,
      choosingNewCourse: false,
      setChoosingNewCourse: () => { },
      ucsModalOpen: modalOpen,
      setUcsModalOpen: setModalOpen,
      coursesInfo: coursesInfo,
      setCoursesInfo: setCoursesInfo,
      selectedMajor: selectedMajor,
      setSelectedMajor: setSelectedMajor,
    }}>
      <CoursePicker />
    </CoursePickerContext.Provider>
  )
}
