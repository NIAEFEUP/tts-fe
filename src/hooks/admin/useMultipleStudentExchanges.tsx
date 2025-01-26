import { useMemo } from "react";
import api from "../../api/backend";
import useSWR from "swr";

/**
 * Gets the exchanges that involve multiple students.
*/
export default () => {
  const getExchanges = async () => {
    try {
        const res = await fetch(`${api.BACKEND_URL}/exchange/direct/`, {
            credentials: "include"
        });

        if(res.ok) {
            return await res.json();
        }
    } catch (error) {
      console.error(error);
    }
  };

  const { data, error, mutate } = useSWR("admin-multiple-student-exchanges", getExchanges);
  const exchanges = useMemo(() => data ? data : null, [data]);

  return {
    exchanges,
    error,
    loading: !data,
    mutate,
  };
};


