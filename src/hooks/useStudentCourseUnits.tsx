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
