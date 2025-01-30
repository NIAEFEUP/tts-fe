import { useContext, useEffect, useState } from "react";
import { ClassDescriptor, SlotInfo } from "../../../@types";
import ScheduleContext from "../../../contexts/ScheduleContext";
import { Schedule } from "../../planner";

const ExchangeSchedule = () => {
  const { exchangeSchedule } = useContext(ScheduleContext);
  const [slots, setSlots] = useState<SlotInfo[]>([]);
  const [classes, setClasses] = useState<ClassDescriptor[]>([]);

  useEffect(() => {
    if (!exchangeSchedule) return;

    const groupedClasses: Record<string, ClassDescriptor[]> = {};
    exchangeSchedule.forEach((currentClass: ClassDescriptor) => {
      const courseUnitId = currentClass.courseInfo.id;
      if (!groupedClasses[courseUnitId]) {
        groupedClasses[courseUnitId] = [];
      }

      groupedClasses[courseUnitId].push(currentClass);
    });

    const combinedClasses: ClassDescriptor[] = Object.values(groupedClasses).map((group) => {
      const combinedClass: ClassDescriptor = {
        ...group[0],
        classInfo: {
          ...group[0].classInfo,
          name: getCombinedClassName(group),
          slots: group.flatMap((cls) => cls.classInfo.slots),
        },
      };
      return combinedClass;
    });

    setClasses(combinedClasses);
    setSlots(combinedClasses.map((newClass) => newClass.classInfo.slots).flat());
  }, [exchangeSchedule]);


  const getCombinedClassName = (classes: ClassDescriptor[]): string => {
    const praticalClass = classes.find((cls) =>
      cls.classInfo.slots.some(slot => slot.lesson_type === "TP" || slot.lesson_type === "PL")
    );


    if (praticalClass) return praticalClass.classInfo.name;
    return classes[0].classInfo.name;
  };

  return <Schedule
    classes={classes}
    slots={slots}
  />;
}

export default ExchangeSchedule;
