import { useMemo } from "react";
import api from "../api/backend";
import useSWR from "swr";
import { CourseInfo } from "../@types";

export default (courseId: number, pickedCourses: Array<CourseInfo> = []) => {
  const getClasses = async () => {
    try {
      const res = await fetch(`${api.BACKEND_URL}/class/${courseId}/`, {
        credentials: "include"
      });

      if (!res.ok) return [];
      return await res.json();
    } catch (e) {
      console.error(e);
      return [];
    }
  }

  const { data, error, mutate, isValidating } = useSWR(`classes-of-${courseId}-${pickedCourses.length}`, getClasses, {
    dedupingInterval: 0
  });

  const classes = useMemo(() => data ? data : null, [data]);

  return {
    classes,
    error,
    loading: !data,
    isValidating,
    mutate,
  };
};

