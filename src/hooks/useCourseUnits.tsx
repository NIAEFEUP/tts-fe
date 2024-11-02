import { useMemo } from "react";
import api from "../api/backend";
import useSWR from "swr";

export default (courseId: number | null) => {
  const getCourseUnit = async (id) => {
    try {
      if (courseId) return await api.getCoursesByMajorId(Number(id));
    } catch (error) {
      console.error(error);
    }
  };

  const { data, error, mutate } = useSWR(`course-units-of-${String(courseId)}`, getCourseUnit, {
    revalidateIfStale: false,
    revalidateOnFocus: false,
    revalidateOnReconnect: false
  });
  const courseUnits = useMemo(() => data ? data : null, [data]);

  return {
    courseUnits,
    error,
    loading: !data,
    mutate,
  };
};

