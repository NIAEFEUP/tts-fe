import { ClassDescriptor, SlotInfo } from "../../../@types"
import SlotBox from "./SlotBox"

type Props = {
  slots: Array<SlotInfo>
  classes: Array<ClassDescriptor>
  hiddenLessonsTypes: Array<string>
}

const SlotBoxes = ({ slots, classes, hiddenLessonsTypes }: Props) => {
  const filteredSlots = slots.filter((slot: SlotInfo) => !hiddenLessonsTypes.includes(slot.lesson_type));

  return (
    <>
      {
        filteredSlots.map((slot: SlotInfo) => {
          const classDescriptor = classes.find((classDescriptor) => (
            classDescriptor.classInfo.slots.filter((otherSlot) => otherSlot.id === slot.id).length > 0
          ))

          if (!classDescriptor) return <></>;

          return <SlotBox
            key={`${classDescriptor.courseInfo.id}-${classDescriptor.classInfo.id}`}
            courseInfo={classDescriptor.courseInfo}
            classInfo={classDescriptor.classInfo}
            classes={classes}
            slot={slot}
          />
        })
      }
    </>
  );
}

export default SlotBoxes;
