import { useMemo } from "react";
import api from "../../api/backend";
import useSWR from "swr";

export default (query: string = "") => {
  const getCandidates = async (q: string) => {
    try {
      const url = new URL(`${api.BACKEND_URL}/exchange/admin/candidates/`);
      if (q) url.searchParams.set('q', q);
      const res = await fetch(url.toString(), {
        credentials: "include",
      });

      if (res.ok) {
        return await res.json();
      }
    } catch (error) {
      console.error(error);
    }
  };

  const { data, error, mutate } = useSWR(`admin-exchange-candidates-${query}`, () => getCandidates(query));
  const candidates = useMemo(() => (data ? data.candidates ?? data : null), [data]);

  return {
    candidates,
    error,
    loading: !data,
    mutate,
  };
};