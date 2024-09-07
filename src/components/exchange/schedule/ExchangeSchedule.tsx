import { useContext, useEffect, useState } from "react";
import { ClassDescriptor, SlotInfo } from "../../../@types";
import CourseContext from "../../../contexts/CourseContext";
import MultipleOptionsContext from "../../../contexts/MultipleOptionsContext";
import useSchedule from "../../../hooks/useSchedule";
import { Schedule } from "../../planner";

const ExchangeSchedule = () => {
  const { classes, loading } = useSchedule();
  const [slots, setSlots] = useState<SlotInfo[]>([]);

  useEffect(() => {
    if (!classes) setSlots([]);
    else setSlots(classes.map((currentClass: ClassDescriptor) => currentClass.classInfo.slots).flat())
  }, [classes])

  return <Schedule
    classes={classes ?? []}
    slots={slots}
  />;
}

export default ExchangeSchedule;
