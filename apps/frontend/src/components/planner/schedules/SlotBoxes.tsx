import { useState, useEffect, useContext} from "react"
import { ClassDescriptor, SlotInfo } from "../../../@types"
import SlotBox from "./SlotBox"
import ConflictsContext from '../../../contexts/ConflictsContext'

type Props = {
  slots: Array<SlotInfo>
  classes: Array<ClassDescriptor>
  hiddenLessonsTypes: Array<string>
}

const SlotBoxes = ({ slots, classes, hiddenLessonsTypes }: Props) => {
  const filteredSlots = slots.filter((slot: SlotInfo) => !hiddenLessonsTypes.includes(slot.lesson_type));

  const [conflictMap, setConflictMap] = useState(new Map<number, boolean>());

  const { setConflictSeverity } = useContext(ConflictsContext);
  const updateConflictMap = (courseId: number, conflictData: boolean) => {
    setConflictMap((prevConflictMap) => {
      const newConflictMap = new Map(prevConflictMap);
      newConflictMap.set(courseId, conflictData);
      return newConflictMap;
    });
  };

  useEffect(() => {
    const isSevere = Array.from(conflictMap.values()).reduce((acc, val) => acc || val, false);
    setConflictSeverity(isSevere);
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
