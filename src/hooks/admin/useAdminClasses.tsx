import { useMemo } from "react";
import api from "../../api/backend";
import useSWR from "swr";

export default () => {
  const getClasses = async () => {
    try {
        const res = await fetch(`${api.BACKEND_URL}/exchange/admin/classes/`, {
            credentials: "include"
        });

        if(res.ok) {
            return await res.json();
        }
    } catch (error) {
      console.error(error);
    }
  };

  const { data, error, mutate } = useSWR("admin-exchange-classes", getClasses);
  const classes = useMemo(() => data ? data : null, [data]);

  return {
    classes: classes,
    error,
    loading: !data,
    mutate,
  };
};


