import { useMemo } from "react";
import api from "../../api/backend";
import useSWR from "swr";

export default () => {
  const getCourseUnitPeriods = async () => {
    try {
        const res = await fetch(`${api.BACKEND_URL}/exchange/admin/course_unit/periods/`, {
            credentials: "include"
        });

        if(res.ok) {
            return await res.json();
        }
    } catch (error) {
      console.error(error);
    }
  };

  const { data, error, mutate } = useSWR("admin-exchange-course-unit-periods", getCourseUnitPeriods);
  const courseUnitPeriods = useMemo(() => data ? data : null, [data]);

  return {
    courseUnitPeriods,
    error,
    loading: !data,
    mutate,
  };
};


