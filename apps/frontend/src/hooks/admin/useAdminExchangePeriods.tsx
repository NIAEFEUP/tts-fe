import { useMemo } from "react";
import api from "../../api/backend";
import useSWR from "swr";

export default () => {
  const getPeriods = async () => {
    try {
        const res = await fetch(`${api.BACKEND_URL}/exchange/admin/course/periods`, {
            credentials: "include"
        });

        if(res.ok) {
            return await res.json();
        }
    } catch (error) {
      console.error(error);
    }
  };

  const { data, error, mutate } = useSWR("admin-exchange-periods", getPeriods);
  const exchangePeriods = useMemo(() => data ? data : null, [data]);

  return {
    exchangePeriods,
    error,
    loading: !data,
    mutate,
  };
};


