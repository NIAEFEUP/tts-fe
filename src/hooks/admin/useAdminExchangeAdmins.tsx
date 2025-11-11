import { useMemo } from "react";
import api from "../../api/backend";
import useSWR from "swr";

export default () => {
  const getAdmins = async () => {
    try {
      const res = await fetch(`${api.BACKEND_URL}/exchange/admin/admins/`, {
        credentials: "include",
      });

      if (res.ok) {
        return await res.json();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const { data, error, mutate } = useSWR("admin-exchange-admins", getAdmins);
  const admins = useMemo(() => (data ? data.admins ?? data : null), [data]);

  return {
    admins,
    error,
    loading: !data,
    mutate,
  };
};
