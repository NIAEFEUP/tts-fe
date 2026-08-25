import { useContext } from 'react'
import PickedCourse from './PickedCourse'
import CoursePickerContext from '../../../../../contexts/coursePicker/CoursePickerContext'
import { NoCourseSelectedSVG } from '../../../../svgs'
import { CourseInfo } from '../../../../../@types'

const PickedCoursesList = () => {
  const { checkboxedCourses } = useContext(CoursePickerContext)

  return checkboxedCourses.length > 0 ? (
    <div className="w-full pr-4 min-h-[16rem]">
      <div className="flex flex-col gap-2">
        {checkboxedCourses.map((course: CourseInfo) => (
          <PickedCourse course={course} key={course.id} />
        ))}
      </div>
    </div>
  ) : (
    <div className="flex h-64 items-center justify-center w-full">
      <NoCourseSelectedSVG />
    </div>
  )
}

export default PickedCoursesList
