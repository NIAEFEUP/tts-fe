import { useContext, useEffect, useState } from "react";
import { ClassDescriptor, SlotInfo } from "../../../@types";
import ScheduleContext from "../../../contexts/ScheduleContext";
import useSchedule from "../../../hooks/useSchedule";
import { Schedule } from "../../planner";

const ExchangeSchedule = () => {
  const { exchangeSchedule } = useContext(ScheduleContext);
  const [slots, setSlots] = useState<SlotInfo[]>([]);
  console.log("exchangeSchedule: ", exchangeSchedule);

  useEffect(() => {
    if (!exchangeSchedule) return;
    console.log("exchangeSchedule: ", exchangeSchedule);

    setSlots(exchangeSchedule.map((currentClass: ClassDescriptor) => currentClass.classInfo.slots).flat())
  }, [exchangeSchedule])

  return <Schedule
    classes={exchangeSchedule ?? []}
    slots={slots ?? []}
  />;
}

export default ExchangeSchedule;
