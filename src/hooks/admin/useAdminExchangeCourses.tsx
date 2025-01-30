import { useMemo } from "react";
import api from "../../api/backend";
import useSWR from "swr";

export default () => {
  const getCourses = async () => {
    try {
        const res = await fetch(`${api.BACKEND_URL}/exchange/admin/courses/`, {
            credentials: "include"
        });

        if(res.ok) {
            return await res.json();
        }
    } catch (error) {
      console.error(error);
    }
  };

  const { data, error, mutate } = useSWR("admin-exchange-courses", getCourses);
  const courses = useMemo(() => data ? data : null, [data]);

  return {
    courses,
    error,
    loading: !data,
    mutate,
  };
};


