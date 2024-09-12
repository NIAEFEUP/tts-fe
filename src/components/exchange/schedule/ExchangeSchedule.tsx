import { useContext, useEffect, useState } from "react";
import { ClassDescriptor, SlotInfo } from "../../../@types";
import ScheduleContext from "../../../contexts/ScheduleContext";
import useSchedule from "../../../hooks/useSchedule";
import { Schedule } from "../../planner";

const ExchangeSchedule = () => {
  const { exchangeSchedule } = useContext(ScheduleContext);
  const [slots, setSlots] = useState<SlotInfo[]>([]);

  useEffect(() => {
    if (!exchangeSchedule) return;

    setSlots(exchangeSchedule.map((currentClass: ClassDescriptor) => currentClass.classInfo.slots).flat())
  }, [exchangeSchedule])

  return <Schedule
    classes={exchangeSchedule ?? []}
    slots={slots ?? []}
  />;
}

export default ExchangeSchedule;
