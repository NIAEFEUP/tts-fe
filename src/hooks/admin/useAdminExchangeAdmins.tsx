import { useMemo } from "react";
import api from "../../api/backend";
import useSWR from "swr";

export default (page: number = 1, pageSize: number = 10) => {
  const getAdmins = async () => {
    try {
      const res = await fetch(`${api.BACKEND_URL}/exchange/admin/admins/?page=${page}&page_size=${pageSize}`, {
        credentials: "include",
      });

      if (res.ok) {
        return await res.json();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const { data, error, mutate } = useSWR(`admin-exchange-admins-${page}-${pageSize}`, getAdmins);
  const admins = useMemo(() => (data ? data.admins ?? [] : null), [data]);
  const totalPages = useMemo(() => (data ? data.total_pages ?? 1 : 1), [data]);
  const totalCount = useMemo(() => (data ? data.total_count ?? 0 : 0), [data]);

  return {
    admins,
    totalPages,
    totalCount,
    error,
    loading: !data,
    mutate,
  };
};
