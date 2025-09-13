import { useMemo } from "react";
import api from "../../api/backend";
import useSWR from "swr";

export default () => {
  const getCoursePeriods = async () => {
    try {
        const res = await fetch(`${api.BACKEND_URL}/exchange/admin/courses/periods/`, {
            credentials: "include"
        });

        if(res.ok) {
            return await res.json();
        }
    } catch (error) {
      console.error(error);
    }
  };

  const { data, error, mutate } = useSWR("admin-exchange-course-periods", getCoursePeriods);
  const exchangeCoursePeriods = useMemo(() => data ? data : null, [data]);

  return {
    exchangeCoursePeriods,
    error,
    loading: !data,
    mutate,
  };
};


