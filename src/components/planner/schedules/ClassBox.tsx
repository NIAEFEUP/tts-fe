import { CourseInfo, ClassInfo } from '../../../@types/new_index'

import { useContext } from 'react'
import MultipleOptionsContext from '../../../contexts/MultipleOptionsContext'
import CourseContext from '../../../contexts/CourseContext'
import LessonBox from './LessonBox'

type Props = {
    courseInfo: CourseInfo
    classInfo: ClassInfo
  }

const ClassBox = ({courseInfo, classInfo} : Props) => {
  const { pickedCourses } = useContext(CourseContext)
  const { multipleOptions, selectedOption } = useContext(MultipleOptionsContext)

  return (

    <>
        {classInfo.slots.map((slot, index) => (
            <LessonBox
                key={`course[${courseInfo.id}]-class[${classInfo.id}]-${slot.lesson_type}-${index}`} 
                courseInfo={courseInfo}
                classInfo={classInfo}
                slotInfo={slot}
                conflictsInfo={[]} 
            />
        ))}
    </>
  )
}

export default ClassBox
