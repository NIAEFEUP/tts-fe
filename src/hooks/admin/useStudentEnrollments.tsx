import { useMemo } from "react";
import api from "../../api/backend";
import useSWR from "swr";

/**
 * Gets the exchanges that a student made not involving any other student.
*/
export default () => {
  const getEnrollments = async () => {
    try {
        const res = await fetch(`${api.BACKEND_URL}/course_unit/enrollment/`, {
            credentials: "include"
        });

        if(res.ok) {
            return await res.json();
        }
    } catch (error) {
      console.error(error);
    }
  };

  const { data, error, mutate } = useSWR("admin-student-enrollments", getEnrollments);
  const enrollments = useMemo(() => data ? data : null, [data]);

  return {
    enrollments,
    error,
    loading: !data,
    mutate,
  };
};

