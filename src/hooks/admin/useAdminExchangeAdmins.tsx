import { useMemo } from "react";
import api from "../../api/backend";
import useSWR from "swr";

export default (page: number = 1, pageSize: number = 10, q: string = "") => {
  const getAdmins = async () => {
    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('page_size', String(pageSize));
      if (q) params.set('q', q);

      const res = await fetch(`${api.BACKEND_URL}/exchange/admin/admins/?${params.toString()}`, {
        credentials: "include",
      });

      if (res.ok) {
        return await res.json();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const swrKey = `admin-exchange-admins-${page}-${pageSize}-${q}`;
  const { data, error, mutate } = useSWR(swrKey, getAdmins, { dedupingInterval: 1000 });
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
