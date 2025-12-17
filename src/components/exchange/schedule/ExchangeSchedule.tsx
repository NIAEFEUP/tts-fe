import { useContext, useEffect, useState, ReactNode } from "react";
import { ClassDescriptor, SlotInfo } from "../../../@types";
import ScheduleContext from "../../../contexts/ScheduleContext";
import { Schedule } from "../../planner";
import ConflictsContext from "../../../contexts/ConflictsContext";

type ExchangeScheduleProps = {
  refresh?: ReactNode;
}

const ExchangeSchedule = ({refresh}: ExchangeScheduleProps) => {
  const { exchangeSchedule } = useContext(ScheduleContext);
  const [slots, setSlots] = useState<SlotInfo[]>([]);
  const [classes, setClasses] = useState<ClassDescriptor[]>([]);
  const { setTClassConflicts } = useContext(ConflictsContext);

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

  // Configure T-class conflicts based on environment variable
  useEffect(() => {
    const tClassConflicts = Number(import.meta.env.VITE_APP_T_CLASS_CONFLICTS) !== 0;
    setTClassConflicts(tClassConflicts);
  }, []);

  return <Schedule
      classes={classes}
      slots={slots}
      refresh={refresh}
    />;
}

export default ExchangeSchedule;
