import { useMemo } from "react";
import api from "../../api/backend";
import useSWR from "swr";

export default (query: string = "") => {
  const getCourses = async (q: string) => {
    try {
      const url = new URL(`${api.BACKEND_URL}/exchange/admin/courses/search/`);
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

  const { data, error, mutate } = useSWR(`admin-exchange-courses-search-${query}`, () => getCourses(query));
  const courses = useMemo(() => (data ? data.courses ?? data : null), [data]);

  return {
    courses,
    error,
    loading: !data,
    mutate,
  };
};