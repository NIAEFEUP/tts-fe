import { useState, useEffect, useCallback, SetStateAction, Dispatch } from 'react'
import { ClassDescriptor, SlotInfo } from '../../../@types'
import SlotBox from './SlotBox'

type Props = {
  slots: Array<SlotInfo>
  classes: Array<ClassDescriptor>
  hiddenLessonsTypes: Array<string>
  setConflictsSeverities?: Dispatch<SetStateAction<Array<number>>>
}

const SlotBoxes = ({ slots, classes, hiddenLessonsTypes, setConflictsSeverities }: Props) => {
  const filteredSlots = slots.filter((slot: SlotInfo) => !hiddenLessonsTypes.includes(slot.lesson_type))

  const [conflictMap, setConflictMap] = useState(new Map<number, number>())

  const updateConflictMap = useCallback((slotId: number, conflictData: number) => {
    setConflictMap((prevConflictMap) => {
      if (prevConflictMap.get(slotId) === conflictData) {
        return prevConflictMap
      }
      const newConflictMap = new Map(prevConflictMap)
      newConflictMap.set(slotId, conflictData)
      return newConflictMap
    })
  }, [])

  // Clean up slots that are no longer in the schedule
  useEffect(() => {
    const validSlotIds = new Set(slots.map((s) => s.id))
    setConflictMap((prevConflictMap) => {
      let changed = false
      const cleaned = new Map<number, number>()
      for (const [id, sev] of prevConflictMap.entries()) {
        if (validSlotIds.has(id)) {
          cleaned.set(id, sev)
        } else {
          changed = true
        }
      }
      return changed ? cleaned : prevConflictMap
    })
  }, [slots])

  useEffect(() => {
    setConflictsSeverities?.(Array.from(conflictMap.values()))
  }, [conflictMap, setConflictsSeverities])

  return (
    <>
      {filteredSlots.map((slot: SlotInfo, idx: number) => {
        const classDescriptor = classes.find(
          (classDescriptor) =>
            classDescriptor.classInfo.slots.filter((otherSlot) => otherSlot.id === slot.id).length > 0,
        )

        if (!classDescriptor) return <></>

        return (
          <SlotBox
            key={`${classDescriptor.courseInfo.id}-${classDescriptor.classInfo.id}-${idx}`}
            courseInfo={classDescriptor.courseInfo}
            classInfo={classDescriptor.classInfo}
            classes={classes}
            slot={slot}
            setSlotBoxConflict={updateConflictMap}
          />
        )
      })}
    </>
  )
}

export default SlotBoxes
