import { ClassDescriptor, CourseInfo } from "../@types";
import { useMemo } from "react";
import api from "../api/backend";
import useSWR from "swr";

export default () => {
  const getEligibileCourseUnits = async () => {
    try {
      const res = await fetch(`${api.BACKEND_URL}/student/course_units/eligible`, {
        credentials: "include"
      });

      if (res.ok) {
        return await res.json();
      }

      return [];
    } catch (e) {
      console.error(e);
      return [];
    }

  }

  const { data, error, mutate, isValidating } = useSWR("eligibleCourseUnits", getEligibileCourseUnits, {});
  const enrolledCourseUnits = useMemo(() => data ? data : null, [data]);

  return {
    enrolledCourseUnits,
    error,
    loading: !data,
    isValidating,
    mutate,
  };
};


// export default (schedule: Array<ClassDescriptor>): Array<CourseInfo> => {
//   if (!schedule) return [];
//
//   const duplicates = new Set<number>();
//   const result = [];
//
//   schedule?.forEach((scheduleItem: ClassDescriptor) => {
//     if (!duplicates.has(scheduleItem.courseInfo.id)) {
//       result.push(scheduleItem.courseInfo);
//       duplicates.add(scheduleItem.courseInfo.id);
//     }
//   });
//   return result.sort((a: CourseInfo, b: CourseInfo) => Number(a.acronym < b.acronym));
// };

