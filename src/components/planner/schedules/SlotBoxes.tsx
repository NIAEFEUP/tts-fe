import { useState, useEffect, SetStateAction, Dispatch } from "react"
import { ClassDescriptor, SlotInfo } from "../../../@types"
import SlotBox from "./SlotBox"

type Props = {
  slots: Array<SlotInfo>
  classes: Array<ClassDescriptor>
  hiddenLessonsTypes: Array<string>
  setConflictsSeverities: Dispatch<SetStateAction<Array<number>>>
}

const SlotBoxes = ({ slots, classes, hiddenLessonsTypes, setConflictsSeverities }: Props) => {
  const filteredSlots = slots.filter((slot: SlotInfo) => !hiddenLessonsTypes.includes(slot.lesson_type));

  const [conflictMap, setConflictMap] = useState(new Map<number, number>());

  const updateConflictMap = (courseId: number, conflictData: number) => {
    setConflictMap((prevConflictMap) => {
      const newConflictMap = new Map(prevConflictMap);
      newConflictMap.set(courseId, conflictData);
      return newConflictMap;
    });
  };

  useEffect(() => {
    setConflictsSeverities(prev => [...prev, ...Array.from(conflictMap.values())])
  }, [conflictMap]);

  return (
    <>
      {
        filteredSlots.map((slot: SlotInfo, idx: number) => {
          const classDescriptor = classes.find((classDescriptor) => (
            classDescriptor.classInfo.slots.filter((otherSlot) => otherSlot.id === slot.id).length > 0
          ))

          if (!classDescriptor) return <></>;

          return <SlotBox
            key={`${classDescriptor.courseInfo.id}-${classDescriptor.classInfo.id}-${idx}`}
            courseInfo={classDescriptor.courseInfo}
            classInfo={classDescriptor.classInfo}
            classes={classes}
            slot={slot}
            setSlotBoxConflict={updateConflictMap}
          />
        })
      }
    </>
  );
}

export default SlotBoxes;
