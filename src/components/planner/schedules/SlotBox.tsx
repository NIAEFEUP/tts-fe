import { CourseInfo, ClassInfo, ClassDescriptor, SlotInfo } from '../../../@types'
import LessonBox from './LessonBox'
import ResponsiveLessonBox from './ResponsiveLessonBox'

type Props = {
  courseInfo: CourseInfo
  classInfo: ClassInfo
  slot: SlotInfo
  classes: ClassDescriptor[]
  setSlotBoxConflict: (courseId: number, conflictData: boolean) => void
}

const SlotBox = ({ courseInfo, classInfo, classes, slot, setSlotBoxConflict }: Props) => {

  const updateSlotBoxConflict = (courseId: number, conflictData: boolean) => {
    setSlotBoxConflict(courseId, conflictData);
  };

  return (
    <>
      <div className="hidden lg:flex lg:flex-col">
        <LessonBox
          key={`course[${courseInfo.id}]-class[${classInfo.id}]-${slot.lesson_type}-${slot.id}`}
          courseInfo={courseInfo}
          classInfo={classInfo}
          slotInfo={slot}
          classes={classes.filter((classDescriptor) => classDescriptor.classInfo.id !== classInfo.id)}
          setLessonBoxConflict={updateSlotBoxConflict}
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
