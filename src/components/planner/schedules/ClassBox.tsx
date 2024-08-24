import { CourseInfo, ClassInfo, ClassDescriptor } from '../../../@types'
import LessonBox from './LessonBox'
import ResponsiveLessonBox from './ResponsiveLessonBox'

type Props = {
  courseInfo: CourseInfo
  classInfo: ClassInfo
  classes: ClassDescriptor[]
}

const ClassBox = ({ courseInfo, classInfo, classes }: Props) => {
  return (
    <>
      {classInfo.slots.map((slot, index) => (
        <>
          <div className="hidden lg:flex lg:flex-col">
            <LessonBox
              key={`course[${courseInfo.id}]-class[${classInfo.id}]-${slot.lesson_type}-${index}`}
              courseInfo={courseInfo}
              classInfo={classInfo}
              slotInfo={slot}
              classes={classes.filter((classDescriptor) => classDescriptor.classInfo.id !== classInfo.id)}
            />
          </div>

          <div className="lg:hidden flex flex-col ">
            <ResponsiveLessonBox
              key={`course[${courseInfo.id}]-class[${classInfo.id}]-${slot.lesson_type}-${index}`}
              courseInfo={courseInfo}
              classInfo={classInfo}
              slotInfo={slot}
            />
          </div>
        </>
      ))}
    </>
  )
}

export default ClassBox
