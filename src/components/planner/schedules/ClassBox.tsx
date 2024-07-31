import { CourseInfo, ClassInfo, ClassDescriptor } from '../../../@types/new_index'

import { useContext, useMemo } from 'react'
import MultipleOptionsContext from '../../../contexts/MultipleOptionsContext'
import CourseContext from '../../../contexts/CourseContext'
import LessonBox from './LessonBox'

type Props = {
  courseInfo: CourseInfo
  classInfo: ClassInfo
  classes: ClassDescriptor[]
}

const ClassBox = ({courseInfo, classInfo, classes} : Props) => {
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
              classes={classes.filter((classDescriptor) => classDescriptor.classInfo.id !== classInfo.id)}
            />
        ))}
    </>
  )
}

export default ClassBox
