

import { useMemo } from "react";
import useSWR from "swr";
import api from "../../api/backend"; 

export default () => {
  const fetchStatistics = async () => {
    try {
        
        const url = `${api.BACKEND_URL}/exchange/admin/statistics/`;
        
        const res = await fetch(url, {
            credentials: "include"
        });

        if (res.ok) {
            return await res.json();
        }
    } catch (error) {
      console.error(error);
    }
  };

  const { data, error, mutate } = useSWR("admin-exchange-statistics", fetchStatistics);
  const adminStatistics = useMemo(() => data || null, [data]);

  return {
    adminStatistics,
    error,
    loading: !data && !error, 
    mutate, 
  };
};