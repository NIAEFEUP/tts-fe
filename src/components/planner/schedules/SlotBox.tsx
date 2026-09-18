import { useMemo } from 'react'
import { CourseInfo, ClassInfo, ClassDescriptor, SlotInfo } from '../../../@types'
import LessonBox from './LessonBox'
import ResponsiveLessonBox from './ResponsiveLessonBox'

type Props = {
  courseInfo: CourseInfo
  classInfo: ClassInfo
  slot: SlotInfo
  classes: ClassDescriptor[]
  setSlotBoxConflict: (slotId: number, conflictData: number) => void
}

const SlotBox = ({ courseInfo, classInfo, classes, slot, setSlotBoxConflict }: Props) => {
  const otherClasses = useMemo(
    () => classes.filter((classDescriptor) => classDescriptor.classInfo.id !== classInfo.id),
    [classes, classInfo.id],
  )

  return (
    <>
      <div className="hidden lg:flex lg:flex-col">
        <LessonBox
          key={`course[${courseInfo.id}]-class[${classInfo.id}]-${slot.lesson_type}-${slot.id}`}
          courseInfo={courseInfo}
          classInfo={classInfo}
          slotInfo={slot}
          classes={otherClasses}
          setLessonBoxConflict={setSlotBoxConflict}
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

export default SlotBox
