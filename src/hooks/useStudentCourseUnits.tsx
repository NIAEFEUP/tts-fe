import { useMemo } from "react";
import api from "../api/backend";
import useSWR from "swr";
import { ClassDescriptor, CourseInfo } from "../@types";

export default (schedule: Array<ClassDescriptor>): Array<CourseInfo> => {
  if (!schedule) return [];

  const duplicates = new Set<number>();
  const result = [];

  schedule.forEach((scheduleItem: ClassDescriptor) => {
    if (!duplicates.has(scheduleItem.courseInfo.id)) {
      result.push(scheduleItem.courseInfo);
      duplicates.add(scheduleItem.courseInfo.id);
    }
  });

  return result;
};

