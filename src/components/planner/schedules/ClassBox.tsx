import { CourseInfo, ClassInfo, ClassDescriptor } from '../../../@types'
import LessonBox from './LessonBox'

type Props = {
  courseInfo: CourseInfo
  classInfo: ClassInfo
  classes: ClassDescriptor[]
  hiddenLessonsTypes: String[]
}

const ClassBox = ({ courseInfo, classInfo, classes, hiddenLessonsTypes }: Props) => {
  return (
    <>
      {classInfo.slots
        .filter((slot) => !hiddenLessonsTypes.includes(slot.lesson_type))
        .map((slot, index) => (
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
