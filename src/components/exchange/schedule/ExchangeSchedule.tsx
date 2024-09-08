import { useContext, useEffect, useState } from "react";
import { ClassDescriptor, SlotInfo } from "../../../@types";
import ScheduleContext from "../../../contexts/ScheduleContext";
import useSchedule from "../../../hooks/useSchedule";
import { Schedule } from "../../planner";

const ExchangeSchedule = () => {
  const { schedule } = useContext(ScheduleContext);
  const [slots, setSlots] = useState<SlotInfo[]>([]);

  useEffect(() => {
    if (!schedule) return;

    setSlots(schedule.map((currentClass: ClassDescriptor) => currentClass.classInfo.slots).flat())
  }, [schedule])

  return <Schedule
    classes={schedule ?? []}
    slots={slots ?? []}
  />;
}

export default ExchangeSchedule;
