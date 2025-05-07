import { CourseInfo, ClassInfo, ClassDescriptor, SlotInfo } from '../../../@types'
import LessonBox from './LessonBox'
import ResponsiveLessonBox from './ResponsiveLessonBox'

type Props = {
  courseInfo: CourseInfo
  classInfo: ClassInfo
  slot: SlotInfo
  classes: ClassDescriptor[]
}

const SlotBox = ({ courseInfo, classInfo, classes, slot }: Props) => {
  console.log('SlotBox', slot)
  return (
    <>
      <div className="hidden lg:flex lg:flex-col">
        <LessonBox
          key={`course[${courseInfo.id}]-class[${classInfo.id}]-${slot.lesson_type}-${slot.id}`}
          courseInfo={courseInfo}
          classInfo={classInfo}
          slotInfo={slot}
          classes={classes.filter((classDescriptor) => classDescriptor.classInfo.id !== classInfo.id)}
        />
      </div>

      <div className="lg:hidden flex flex-col w-full ">
        <ResponsiveLessonBox
          key={`course[${courseInfo.id}]-class[${classInfo.id}]-${slot.lesson_type}-${slot.id}`}
          courseInfo={courseInfo}
          classInfo={classInfo}
          slotInfo={slot}
        />
      </div>
    </>
  )
}

export default SlotBox;
